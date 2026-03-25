import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";

const completedLessons = [1, 2, 5];

const recentLessons = [
  { id: 3, title: "Сравнение с обычными диетами", module: "Модуль 1", progress: 65 },
  { id: 6, title: "Лучшие источники белка", module: "Модуль 2", progress: 0 },
  { id: 7, title: "Сколько белка нужно именно вам", module: "Модуль 2", progress: 0 },
];

const materials = [
  { name: "Принцип метаболической тарелки.pdf", size: "1.2 МБ", type: "pdf" },
  { name: "Таблица белков в продуктах.pdf", size: "0.8 МБ", type: "table" },
  { name: "Шпаргалка по углеводам.pdf", size: "0.6 МБ", type: "pdf" },
];

export default function Cabinet() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const totalLessons = 12;
  const progress = Math.round((completedLessons.length / totalLessons) * 100);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Icon name="Loader2" size={32} className="animate-spin text-[var(--olive)]" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <section className="bg-[var(--olive-pale)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[var(--olive)] rounded-2xl flex items-center justify-center">
              <Icon name="User" size={26} className="text-[var(--cream)]" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--graphite)]">
                Личный кабинет
              </h1>
              <p className="font-body text-[var(--warm-gray)] text-sm">Добро пожаловать, {user.name}!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6 text-center">
              <p className="font-display text-4xl font-semibold text-[var(--olive)] mb-1">{completedLessons.length}</p>
              <p className="font-body text-sm text-[var(--warm-gray)]">уроков пройдено</p>
            </div>
            <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6 text-center">
              <p className="font-display text-4xl font-semibold text-[var(--olive)] mb-1">{totalLessons - completedLessons.length}</p>
              <p className="font-body text-sm text-[var(--warm-gray)]">уроков осталось</p>
            </div>
            <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6 text-center">
              <p className="font-display text-4xl font-semibold text-[var(--olive)] mb-1">{progress}%</p>
              <p className="font-body text-sm text-[var(--warm-gray)]">курс пройден</p>
            </div>
          </div>

          <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="font-body font-medium text-sm text-[var(--graphite)]">Общий прогресс</span>
              <span className="font-body text-sm text-[var(--olive)]">{progress}%</span>
            </div>
            <div className="h-2.5 bg-[var(--olive-pale)] rounded-full overflow-hidden">
              <div className="progress-bar h-full" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold text-[var(--graphite)] mb-4 flex items-center gap-2">
                <Icon name="Play" size={18} className="text-[var(--olive)]" />
                Продолжить обучение
              </h2>
              <div className="space-y-3">
                {recentLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-3 p-3 bg-[var(--olive-pale)] rounded-xl cursor-pointer group">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
                      <Icon name="Play" size={13} className="text-[var(--olive)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-[var(--warm-gray)]">{lesson.module}</p>
                      <p className="font-body text-sm text-[var(--graphite)] truncate font-medium">{lesson.title}</p>
                      {lesson.progress > 0 && (
                        <div className="mt-1 h-1 bg-white rounded-full overflow-hidden w-full">
                          <div className="progress-bar h-full" style={{ width: `${lesson.progress}%` }} />
                        </div>
                      )}
                    </div>
                    <Icon name="ChevronRight" size={15} className="text-[var(--warm-gray)] group-hover:text-[var(--olive)] transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold text-[var(--graphite)] mb-4 flex items-center gap-2">
                <Icon name="FolderOpen" size={18} className="text-[var(--olive)]" />
                Мои материалы
              </h2>
              <div className="space-y-3">
                {materials.map((mat) => (
                  <div key={mat.name} className="flex items-center gap-3 p-3 border border-[var(--olive-pale)] rounded-xl hover:bg-[var(--olive-pale)] cursor-pointer transition-colors group">
                    <div className="w-9 h-9 bg-[var(--olive-pale)] rounded-lg flex items-center justify-center shrink-0">
                      <Icon name={mat.type === "table" ? "Table" : "FileText"} size={15} className="text-[var(--olive)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-[var(--graphite)] truncate">{mat.name}</p>
                      <p className="font-body text-xs text-[var(--warm-gray)]">{mat.size}</p>
                    </div>
                    <Icon name="Download" size={15} className="text-[var(--warm-gray)] group-hover:text-[var(--olive)] transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
