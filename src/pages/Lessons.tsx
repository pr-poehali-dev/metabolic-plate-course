import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

type Lesson = {
  id: number;
  module: number;
  title: string;
  duration: string;
  hasPdf: boolean;
  hasTable: boolean;
};

const lessons: Lesson[] = [
  { id: 1, module: 1, title: "Что такое метаболическая тарелка", duration: "15 мин", hasPdf: true, hasTable: false },
  { id: 2, module: 1, title: "Как тарелка влияет на обмен веществ", duration: "18 мин", hasPdf: true, hasTable: false },
  { id: 3, module: 1, title: "Сравнение с обычными диетами", duration: "12 мин", hasPdf: false, hasTable: true },
  { id: 4, module: 1, title: "Практика: собираем первую тарелку", duration: "20 мин", hasPdf: true, hasTable: true },

  { id: 5, module: 2, title: "Зачем нужен белок при похудении", duration: "16 мин", hasPdf: true, hasTable: false },
  { id: 6, module: 2, title: "Лучшие источники белка", duration: "14 мин", hasPdf: false, hasTable: true },
  { id: 7, module: 2, title: "Сколько белка нужно именно вам", duration: "18 мин", hasPdf: true, hasTable: true },
  { id: 8, module: 2, title: "Практика: белковое меню на день", duration: "22 мин", hasPdf: true, hasTable: false },

  { id: 9, module: 3, title: "Простые vs сложные углеводы", duration: "15 мин", hasPdf: true, hasTable: false },
  { id: 10, module: 3, title: "Гликемический индекс без страха", duration: "18 мин", hasPdf: false, hasTable: true },
  { id: 11, module: 3, title: "Крупы, которые помогают худеть", duration: "13 мин", hasPdf: true, hasTable: false },
  { id: 12, module: 3, title: "Практика: угловой блок тарелки", duration: "20 мин", hasPdf: true, hasTable: true },
];

const moduleNames: Record<number, string> = {
  1: "Введение в метаболическую тарелку",
  2: "Белки — строительный материал",
  3: "Углеводы без страха",
};

export default function Lessons() {
  const [activeModule, setActiveModule] = useState<number | null>(null);

  const filtered = activeModule ? lessons.filter((l) => l.module === activeModule) : lessons;
  const modules = [1, 2, 3];

  return (
    <Layout>
      <section className="bg-[var(--olive-pale)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--graphite)] mb-4">
            Уроки
          </h1>
          <p className="font-body text-lg text-[var(--warm-gray)] max-w-2xl leading-relaxed">
            Видео-уроки с конспектами, PDF-шпаргалками и таблицами
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveModule(null)}
              className={`px-4 py-2 rounded-full text-sm font-body border transition-colors ${
                activeModule === null
                  ? "bg-[var(--olive)] text-[var(--cream)] border-[var(--olive)]"
                  : "bg-white text-[var(--graphite)] border-[var(--olive-pale)] hover:border-[var(--olive)]"
              }`}
            >
              Все модули
            </button>
            {modules.map((m) => (
              <button
                key={m}
                onClick={() => setActiveModule(m)}
                className={`px-4 py-2 rounded-full text-sm font-body border transition-colors ${
                  activeModule === m
                    ? "bg-[var(--olive)] text-[var(--cream)] border-[var(--olive)]"
                    : "bg-white text-[var(--graphite)] border-[var(--olive-pale)] hover:border-[var(--olive)]"
                }`}
              >
                Модуль {m}
              </button>
            ))}
          </div>

          {/* Lessons list */}
          <div className="space-y-3">
            {filtered.map((lesson) => (
              <div
                key={lesson.id}
                className="card-hover bg-white border border-[var(--olive-pale)] rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-[var(--olive-pale)] rounded-xl flex items-center justify-center shrink-0">
                  <Icon name="Play" size={16} className="text-[var(--olive)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs text-[var(--warm-gray)] mb-0.5">
                    Модуль {lesson.module} — {moduleNames[lesson.module]}
                  </p>
                  <h3 className="font-body font-medium text-[var(--graphite)] truncate">{lesson.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--warm-gray)]">
                      <Icon name="Clock" size={11} />
                      {lesson.duration}
                    </span>
                    {lesson.hasPdf && (
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--olive)] bg-[var(--olive-pale)] px-2 py-0.5 rounded-full">
                        <Icon name="FileText" size={11} />
                        PDF
                      </span>
                    )}
                    {lesson.hasTable && (
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--olive)] bg-[var(--olive-pale)] px-2 py-0.5 rounded-full">
                        <Icon name="Table" size={11} />
                        Таблица
                      </span>
                    )}
                  </div>
                </div>
                <button className="shrink-0 flex items-center gap-1.5 text-sm font-body text-[var(--olive)] hover:text-[var(--graphite)] transition-colors">
                  Смотреть
                  <Icon name="ChevronRight" size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
