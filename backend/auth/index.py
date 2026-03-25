"""
Авторизация пользователей: регистрация, вход, получение профиля, выход.
"""
import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def make_token() -> str:
    return secrets.token_hex(32)


def ok(data: dict, status: int = 200) -> dict:
    return {'statusCode': status, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps(data)}


def err(msg: str, status: int = 400) -> dict:
    return {'statusCode': status, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg})}


def get_user_by_token(conn, token: str):
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.name, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = %s AND s.expires_at > NOW()",
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
    if not action:
        path = event.get('path', '/')
        action = path.strip('/').split('/')[-1]

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    token = event.get('headers', {}).get('X-Auth-Token', '')

    conn = get_conn()

    # POST /auth/register
    if method == 'POST' and action == 'register':
        name = (body.get('name') or '').strip()
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''

        if not name or not email or not password:
            conn.close()
            return err('Заполните все поля')
        if len(password) < 6:
            conn.close()
            return err('Пароль должен быть не менее 6 символов')

        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return err('Пользователь с таким email уже существует')

        pw_hash = hash_password(password)
        cur.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (name, email, pw_hash)
        )
        user_id = cur.fetchone()[0]

        tok = make_token()
        expires = datetime.now(timezone.utc) + timedelta(days=30)
        cur.execute(
            "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, tok, expires)
        )
        conn.commit()
        conn.close()
        return ok({'token': tok, 'user': {'id': user_id, 'name': name, 'email': email}}, 201)

    # POST /auth/login
    if method == 'POST' and action == 'login':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''

        cur = conn.cursor()
        cur.execute("SELECT id, name, password_hash FROM users WHERE email = %s", (email,))
        row = cur.fetchone()
        if not row or row[2] != hash_password(password):
            conn.close()
            return err('Неверный email или пароль', 401)

        user_id, name, _ = row
        tok = make_token()
        expires = datetime.now(timezone.utc) + timedelta(days=30)
        cur.execute(
            "INSERT INTO sessions (user_id, token, expires_at) VALUES (%s, %s, %s)",
            (user_id, tok, expires)
        )
        conn.commit()
        conn.close()
        return ok({'token': tok, 'user': {'id': user_id, 'name': name, 'email': email}})

    # GET /auth/me
    if method == 'GET' and action == 'me':
        if not token:
            conn.close()
            return err('Не авторизован', 401)
        user = get_user_by_token(conn, token)
        conn.close()
        if not user:
            return err('Сессия истекла', 401)
        return ok({'user': user})

    # POST /auth/logout
    if method == 'POST' and action == 'logout':
        if token:
            cur = conn.cursor()
            cur.execute("UPDATE sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
        conn.close()
        return ok({'ok': True})

    conn.close()
    return err('Не найдено', 404)