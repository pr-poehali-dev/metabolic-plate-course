"""
Отчёты учеников: загрузка файла, список, комментарии куратора.
"""
import json
import os
import base64
import mimetypes
from datetime import datetime, timezone
import psycopg2
import boto3

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p59349480_metabolic_plate_cour')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}

TEMPLATE_KEY = 'reports/template/расчет_калорийности_за_день.xlsx'
TEMPLATE_CDN = None  # будет подставлен в runtime


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def get_user_by_token(conn, token):
    if not token:
        return None
    cur = conn.cursor()
    cur.execute(
        f"SELECT u.id, u.name, u.email FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON u.id = s.user_id "
        f"WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    if row:
        return {'id': row[0], 'name': row[1], 'email': row[2]}
    return None


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    qs = event.get('queryStringParameters') or {}
    action = qs.get('action', '')
    token = event.get('headers', {}).get('X-Auth-Token', '')
    body = json.loads(event['body']) if event.get('body') else {}

    s3 = get_s3()
    key_id = os.environ['AWS_ACCESS_KEY_ID']
    cdn_base = f"https://cdn.poehali.dev/projects/{key_id}/bucket"

    # GET /reports?action=template_url — получить ссылку для скачивания шаблона
    if method == 'GET' and action == 'template_url':
        try:
            url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': 'files', 'Key': TEMPLATE_KEY},
                ExpiresIn=3600
            )
            return {'statusCode': 200, 'headers': CORS_HEADERS,
                    'body': json.dumps({'url': url})}
        except Exception:
            return {'statusCode': 404, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Шаблон не найден. Загрузите его через админку.'})}

    # POST /reports?action=upload — загрузить заполненный отчёт
    if method == 'POST' and action == 'upload':
        conn = get_conn()
        user = get_user_by_token(conn, token)

        file_data = body.get('file')
        file_name = body.get('file_name', 'report.xlsx')
        user_name = body.get('user_name', user['name'] if user else 'Аноним')
        user_email = body.get('user_email', user['email'] if user else '')

        if not file_data:
            return {'statusCode': 400, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Файл не передан'})}

        file_bytes = base64.b64decode(file_data)
        file_size = len(file_bytes)

        ts = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')
        safe_name = file_name.replace(' ', '_')
        file_key = f'reports/uploads/{ts}_{safe_name}'

        content_type, _ = mimetypes.guess_type(file_name)
        content_type = content_type or 'application/octet-stream'

        s3.put_object(
            Bucket='files',
            Key=file_key,
            Body=file_bytes,
            ContentType=content_type
        )

        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.reports (user_id, user_name, user_email, file_key, file_name, file_size) "
            f"VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (user['id'] if user else None, user_name, user_email, file_key, file_name, file_size)
        )
        report_id = cur.fetchone()[0]
        conn.commit()

        return {'statusCode': 200, 'headers': CORS_HEADERS,
                'body': json.dumps({'ok': True, 'report_id': report_id})}

    # GET /reports?action=list — список отчётов (только для своих, или всех для admin)
    if method == 'GET' and action == 'list':
        conn = get_conn()
        user = get_user_by_token(conn, token)
        is_admin = qs.get('admin') == '1'

        cur = conn.cursor()
        if is_admin:
            cur.execute(
                f"SELECT id, user_name, user_email, file_key, file_name, file_size, uploaded_at, admin_comment, commented_at "
                f"FROM {SCHEMA}.reports ORDER BY uploaded_at DESC"
            )
        elif user:
            cur.execute(
                f"SELECT id, user_name, user_email, file_key, file_name, file_size, uploaded_at, admin_comment, commented_at "
                f"FROM {SCHEMA}.reports WHERE user_id = %s ORDER BY uploaded_at DESC",
                (user['id'],)
            )
        else:
            return {'statusCode': 401, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Необходима авторизация'})}

        rows = cur.fetchall()
        result = []
        for r in rows:
            file_url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': 'files', 'Key': r[3]},
                ExpiresIn=3600
            )
            result.append({
                'id': r[0],
                'user_name': r[1],
                'user_email': r[2],
                'file_url': file_url,
                'file_name': r[4],
                'file_size': r[5],
                'uploaded_at': r[6].isoformat() if r[6] else None,
                'admin_comment': r[7],
                'commented_at': r[8].isoformat() if r[8] else None,
            })

        return {'statusCode': 200, 'headers': CORS_HEADERS,
                'body': json.dumps({'reports': result})}

    # POST /reports?action=comment — добавить комментарий куратора
    if method == 'POST' and action == 'comment':
        report_id = body.get('report_id')
        comment = body.get('comment', '').strip()

        if not report_id:
            return {'statusCode': 400, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'report_id обязателен'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.reports SET admin_comment = %s, commented_at = NOW() WHERE id = %s",
            (comment, report_id)
        )
        conn.commit()

        return {'statusCode': 200, 'headers': CORS_HEADERS,
                'body': json.dumps({'ok': True})}

    # POST /reports?action=upload_template — загрузить шаблон (для куратора)
    if method == 'POST' and action == 'upload_template':
        file_data = body.get('file')
        file_name = body.get('file_name', 'template.xlsx')

        if not file_data:
            return {'statusCode': 400, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Файл не передан'})}

        file_bytes = base64.b64decode(file_data)
        content_type, _ = mimetypes.guess_type(file_name)
        content_type = content_type or 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

        s3.put_object(
            Bucket='files',
            Key=TEMPLATE_KEY,
            Body=file_bytes,
            ContentType=content_type
        )

        return {'statusCode': 200, 'headers': CORS_HEADERS,
                'body': json.dumps({'ok': True})}

    return {'statusCode': 404, 'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'Неизвестный action'})}
