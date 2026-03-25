import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";

interface Report {
  id: number; user_name: string; user_email: string; file_url: string;
  file_name: string; file_size: number; uploaded_at: string;
  admin_comment: string | null; commented_at: string | null;
}

const REPORTS_URL = "https://functions.poehali.dev/deea6be1-5f45-4406-a767-d59cacd92078";

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

export default function Reports() {
  const { user } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsFetched, setReportsFetched] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("auth_token") || "";

  const handleDownloadTemplate = async () => {
    const res = await fetch(`${REPORTS_URL}?action=template_url`);
    const data = await res.json();
    if (data.url) {
      window.open(data.url, "_blank");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadDone(false);
    setUploadError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    if (!user && (!guestName.trim() || !guestEmail.trim())) {
      setUploadError("Введите имя и email для отправки отчёта");
      return;
    }

    setUploading(true);
    setUploadError("");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const res = await fetch(`${REPORTS_URL}?action=upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "X-Auth-Token": token } : {}),
        },
        body: JSON.stringify({
          file: base64,
          file_name: selectedFile.name,
          user_name: user?.name || guestName,
          user_email: user?.email || guestEmail,
        }),
      });
      const data = await res.json();
      setUploading(false);
      if (data.ok) {
        setUploadDone(true);
        setSelectedFile(null);
        if (fileRef.current) fileRef.current.value = "";
        setReportsFetched(false);
      } else {
        setUploadError(data.error || "Ошибка загрузки");
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleLoadReports = async () => {
    if (!token) return;
    setLoadingReports(true);
    const res = await fetch(`${REPORTS_URL}?action=list`, {
      headers: { "X-Auth-Token": token },
    });
    const data = await res.json();
    setMyReports(data.reports || []);
    setLoadingReports(false);
    setReportsFetched(true);
  };

  return (
    <Layout>
      <section className="bg-[var(--olive-pale)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--graphite)] mb-4">
            Отчёты
          </h1>
          <p className="font-body text-lg text-[var(--warm-gray)] max-w-2xl leading-relaxed">
            Скачайте шаблон таблицы, заполните его и отправьте куратору
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">

          {/* Шаг 1 — скачать шаблон */}
          <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[var(--olive)] rounded-full flex items-center justify-center text-white font-display font-semibold text-sm shrink-0">
                1
              </div>
              <h2 className="font-display text-xl font-semibold text-[var(--graphite)]">
                Скачайте шаблон таблицы
              </h2>
            </div>
            <p className="font-body text-sm text-[var(--warm-gray)] mb-4">
              Таблица для расчёта калорийности за день. Заполните её и верните куратору.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 bg-[var(--olive)] text-white font-body text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Icon name="Download" size={16} />
              Скачать таблицу
            </button>
          </div>

          {/* Шаг 2 — загрузить заполненную */}
          <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[var(--olive)] rounded-full flex items-center justify-center text-white font-display font-semibold text-sm shrink-0">
                2
              </div>
              <h2 className="font-display text-xl font-semibold text-[var(--graphite)]">
                Отправьте заполненную таблицу
              </h2>
            </div>
            <p className="font-body text-sm text-[var(--warm-gray)] mb-5">
              Загрузите заполненный файл — куратор проверит его и оставит комментарий.
            </p>

            {!user && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="font-body text-xs text-[var(--warm-gray)] mb-1 block">Ваше имя</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Иванова Мария"
                    className="w-full border border-[var(--olive-pale)] rounded-xl px-3 py-2 font-body text-sm text-[var(--graphite)] focus:outline-none focus:border-[var(--olive)]"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-[var(--warm-gray)] mb-1 block">Email</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="maria@example.com"
                    className="w-full border border-[var(--olive-pale)] rounded-xl px-3 py-2 font-body text-sm text-[var(--graphite)] focus:outline-none focus:border-[var(--olive)]"
                  />
                </div>
              </div>
            )}

            <div
              className="border-2 border-dashed border-[var(--olive-pale)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--olive)] transition-colors mb-4"
              onClick={() => fileRef.current?.click()}
            >
              <Icon name="Upload" size={32} className="text-[var(--olive)] mx-auto mb-2" />
              {selectedFile ? (
                <p className="font-body text-sm text-[var(--graphite)]">
                  {selectedFile.name} <span className="text-[var(--warm-gray)]">({formatSize(selectedFile.size)})</span>
                </p>
              ) : (
                <p className="font-body text-sm text-[var(--warm-gray)]">
                  Нажмите чтобы выбрать файл (.xlsx, .xls, .csv)
                </p>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv,.ods"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {uploadError && (
              <p className="font-body text-sm text-red-500 mb-3">{uploadError}</p>
            )}

            {uploadDone && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-3">
                <Icon name="CheckCircle" size={18} className="text-green-500" />
                <p className="font-body text-sm text-green-700">Отчёт успешно отправлен! Куратор скоро проверит его.</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="inline-flex items-center gap-2 bg-[var(--olive)] text-white font-body text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><Icon name="Loader" size={16} className="animate-spin" /> Отправляем...</>
              ) : (
                <><Icon name="Send" size={16} /> Отправить отчёт</>
              )}
            </button>
          </div>

          {/* Мои отчёты (только для авторизованных) */}
          {user && (
            <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-[var(--graphite)]">
                  Мои отчёты
                </h2>
                <button
                  onClick={handleLoadReports}
                  className="font-body text-sm text-[var(--olive)] hover:underline"
                >
                  {reportsFetched ? "Обновить" : "Загрузить"}
                </button>
              </div>

              {loadingReports && (
                <div className="flex items-center gap-2 text-[var(--warm-gray)]">
                  <Icon name="Loader" size={16} className="animate-spin" />
                  <span className="font-body text-sm">Загружаем...</span>
                </div>
              )}

              {reportsFetched && !loadingReports && myReports.length === 0 && (
                <p className="font-body text-sm text-[var(--warm-gray)]">Вы ещё не отправляли отчётов</p>
              )}

              {myReports.length > 0 && (
                <div className="space-y-3">
                  {myReports.map((r) => (
                    <div key={r.id} className="border border-[var(--olive-pale)] rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Icon name="FileSpreadsheet" size={18} className="text-[var(--olive)] shrink-0" />
                          <div>
                            <a
                              href={r.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-body text-sm font-medium text-[var(--graphite)] hover:text-[var(--olive)] transition-colors"
                            >
                              {r.file_name}
                            </a>
                            <p className="font-body text-xs text-[var(--warm-gray)]">{formatDate(r.uploaded_at)}</p>
                          </div>
                        </div>
                        {r.admin_comment ? (
                          <span className="shrink-0 text-xs font-body bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                            Есть ответ
                          </span>
                        ) : (
                          <span className="shrink-0 text-xs font-body bg-[var(--olive-pale)] text-[var(--warm-gray)] px-2 py-0.5 rounded-full">
                            На проверке
                          </span>
                        )}
                      </div>
                      {r.admin_comment && (
                        <div className="mt-3 bg-[var(--olive-pale)] rounded-xl px-4 py-3">
                          <p className="font-body text-xs text-[var(--warm-gray)] mb-1">Комментарий куратора:</p>
                          <p className="font-body text-sm text-[var(--graphite)]">{r.admin_comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}