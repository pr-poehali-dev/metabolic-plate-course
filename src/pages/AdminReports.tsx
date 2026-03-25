import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

const REPORTS_URL = "https://functions.poehali.dev/deea6be1-5f45-4406-a767-d59cacd92078";

interface Report {
  id: number; user_name: string; user_email: string; file_url: string;
  file_name: string; file_size: number; uploaded_at: string;
  admin_comment: string | null; commented_at: string | null;
}

function formatSize(bytes: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  const [templateUploading, setTemplateUploading] = useState(false);
  const [templateDone, setTemplateDone] = useState(false);
  const templateRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("auth_token") || "";

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const res = await fetch(`${REPORTS_URL}?action=list&admin=1`, {
      headers: { "X-Auth-Token": token },
    });
    const data = await res.json();
    const list: Report[] = data.reports || [];
    setReports(list);
    const initComments: Record<number, string> = {};
    list.forEach((r) => { initComments[r.id] = r.admin_comment || ""; });
    setComments(initComments);
    setLoading(false);
  };

  const handleSaveComment = async (reportId: number) => {
    setSaving((p) => ({ ...p, [reportId]: true }));
    await fetch(`${REPORTS_URL}?action=comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
      body: JSON.stringify({ report_id: reportId, comment: comments[reportId] || "" }),
    });
    setSaving((p) => ({ ...p, [reportId]: false }));
    setSaved((p) => ({ ...p, [reportId]: true }));
    setTimeout(() => setSaved((p) => ({ ...p, [reportId]: false })), 2000);
  };

  const handleUploadTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTemplateUploading(true);
    setTemplateDone(false);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      await fetch(`${REPORTS_URL}?action=upload_template`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Auth-Token": token },
        body: JSON.stringify({ file: base64, file_name: file.name }),
      });
      setTemplateUploading(false);
      setTemplateDone(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout>
      <section className="bg-[var(--olive-pale)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--graphite)] mb-4">
            Отчёты учеников
          </h1>
          <p className="font-body text-lg text-[var(--warm-gray)] max-w-2xl leading-relaxed">
            Просматривайте загруженные таблицы и оставляйте комментарии
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">

          {/* Загрузить шаблон */}
          <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--graphite)] mb-2">
              Шаблон для учеников
            </h2>
            <p className="font-body text-sm text-[var(--warm-gray)] mb-4">
              Загрузите или обновите шаблон таблицы, который будут скачивать ученики
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => templateRef.current?.click()}
                disabled={templateUploading}
                className="inline-flex items-center gap-2 bg-[var(--olive)] text-white font-body text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {templateUploading ? (
                  <><Icon name="Loader" size={16} className="animate-spin" /> Загружаем...</>
                ) : (
                  <><Icon name="Upload" size={16} /> Загрузить шаблон</>
                )}
              </button>
              {templateDone && (
                <span className="flex items-center gap-1.5 font-body text-sm text-green-600">
                  <Icon name="CheckCircle" size={16} /> Шаблон обновлён
                </span>
              )}
            </div>
            <input
              ref={templateRef}
              type="file"
              accept=".xlsx,.xls,.csv,.ods"
              className="hidden"
              onChange={handleUploadTemplate}
            />
          </div>

          {/* Список отчётов */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-[var(--graphite)]">
                Все отчёты {!loading && `(${reports.length})`}
              </h2>
              <button
                onClick={loadReports}
                className="font-body text-sm text-[var(--olive)] hover:underline flex items-center gap-1"
              >
                <Icon name="RefreshCw" size={14} /> Обновить
              </button>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-[var(--warm-gray)] py-8 justify-center">
                <Icon name="Loader" size={20} className="animate-spin" />
                <span className="font-body">Загружаем...</span>
              </div>
            )}

            {!loading && reports.length === 0 && (
              <div className="text-center py-16 text-[var(--warm-gray)]">
                <Icon name="FileX" size={40} className="mx-auto mb-3 opacity-40" />
                <p className="font-body">Отчётов пока нет</p>
              </div>
            )}

            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-display text-base font-semibold text-[var(--graphite)]">{r.user_name}</p>
                      <p className="font-body text-sm text-[var(--warm-gray)]">{r.user_email}</p>
                      <p className="font-body text-xs text-[var(--warm-gray)] mt-0.5">{formatDate(r.uploaded_at)}</p>
                    </div>
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[var(--olive)] text-[var(--olive)] font-body text-sm px-4 py-2 rounded-xl hover:bg-[var(--olive-pale)] transition-colors shrink-0"
                    >
                      <Icon name="FileSpreadsheet" size={16} />
                      {r.file_name}
                      {r.file_size ? <span className="text-xs text-[var(--warm-gray)]">({formatSize(r.file_size)})</span> : null}
                    </a>
                  </div>

                  <div>
                    <label className="font-body text-xs text-[var(--warm-gray)] mb-1.5 block">
                      Комментарий куратора
                    </label>
                    <textarea
                      rows={3}
                      value={comments[r.id] ?? ""}
                      onChange={(e) => setComments((p) => ({ ...p, [r.id]: e.target.value }))}
                      placeholder="Напишите обратную связь ученику..."
                      className="w-full border border-[var(--olive-pale)] rounded-xl px-3 py-2 font-body text-sm text-[var(--graphite)] resize-none focus:outline-none focus:border-[var(--olive)]"
                    />
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => handleSaveComment(r.id)}
                        disabled={saving[r.id]}
                        className="inline-flex items-center gap-1.5 bg-[var(--olive)] text-white font-body text-sm px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        {saving[r.id] ? (
                          <><Icon name="Loader" size={14} className="animate-spin" /> Сохраняю...</>
                        ) : (
                          <><Icon name="Save" size={14} /> Сохранить</>
                        )}
                      </button>
                      {saved[r.id] && (
                        <span className="flex items-center gap-1 font-body text-sm text-green-600">
                          <Icon name="Check" size={14} /> Сохранено
                        </span>
                      )}
                      {r.commented_at && (
                        <span className="font-body text-xs text-[var(--warm-gray)]">
                          Изменено {formatDate(r.commented_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
