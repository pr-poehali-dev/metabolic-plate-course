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

const supplies = {
  tools: [
    "Шагомер",
    "Весы для взвешивания пищи",
    "Весы-ложка",
    "Весы для контроля массы тела",
    "Сантиметровая лента",
    "Мерная бутылка для воды",
    "Термос для запаривания углеводов",
    "Двусторонний гриль (по желанию)",
    "Контейнеры для пищи",
    "Шейкер",
  ],
  products: [
    "Пектин без сахара",
    "Агар без сахара",
    "Отруби с количеством клетчатки более 40%",
    "Масло-спрей",
    "Поливитаминный препарат с микроэлементами",
    "Протеиновые батончики (много белка, мало углеводов, ноль жиров)",
    "Казеин очищенный (по желанию)",
    "Мороженое до 100 ккал",
    "Петиновое варенье",
    "Зефир на эритрите (по желанию)",
    "Цельнозерновая мука (по желанию)",
    "Нулевой творог до 60 ккал",
    "Яичные белки",
    "Кофе, чай",
  ],
  food: [
    "Телятина, говядина вырезка",
    "Куриная грудка или грудка индейки",
    "Рыба до 100 ккал, морепродукты",
    "Крупы любые",
    "Гарниры любые",
    "Рыбные консервы в собственном соку",
    "Овощные консервы",
    "Маринованные грибы, квашеная капуста",
    "Овощи любые",
    "Фрукты и ягоды любые до 50 ккал",
    "Соусы — кетчуп, аджика, соевый соус, до 100 ккал",
  ],
};

const ALL_ITEMS = [
  ...supplies.tools.map((item) => `tools::${item}`),
  ...supplies.products.map((item) => `products::${item}`),
  ...supplies.food.map((item) => `food::${item}`),
];

const STORAGE_KEY = "supplies_checked";

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export default function Lessons() {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [suppliesOpen, setSuppliesOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(loadChecked);

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const checkedCount = checked.size;
  const totalCount = ALL_ITEMS.length;

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

      {/* Что понадобится */}
      <section className="py-10 bg-white border-b border-[var(--olive-pale)]">
        <div className="container mx-auto px-4 max-w-5xl">
          <button
            onClick={() => setSuppliesOpen(!suppliesOpen)}
            className="w-full flex items-center justify-between gap-4 text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--olive-pale)] rounded-xl flex items-center justify-center shrink-0">
                <Icon name="ShoppingBag" size={18} className="text-[var(--olive)]" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--graphite)]">Что понадобится</h2>
                <p className="font-body text-sm text-[var(--warm-gray)]">
                  {checkedCount} из {totalCount} куплено
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex w-32 h-2 bg-[var(--olive-pale)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--olive)] rounded-full transition-all"
                  style={{ width: `${totalCount ? (checkedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
              <Icon
                name={suppliesOpen ? "ChevronUp" : "ChevronDown"}
                size={20}
                className="text-[var(--olive)] transition-transform"
              />
            </div>
          </button>

          {suppliesOpen && (
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {(
                [
                  { key: "tools", label: "Инструменты", icon: "Wrench", items: supplies.tools },
                  { key: "products", label: "Добавки и специальные продукты", icon: "Package", items: supplies.products },
                  { key: "food", label: "Продукты питания", icon: "Utensils", items: supplies.food },
                ] as const
              ).map(({ key, label, icon, items }) => (
                <div key={key} className="bg-[var(--olive-pale)] rounded-2xl p-5">
                  <h3 className="font-body font-semibold text-[var(--graphite)] mb-3 flex items-center gap-2">
                    <Icon name={icon} size={15} className="text-[var(--olive)]" />
                    {label}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((item) => {
                      const ck = `${key}::${item}`;
                      const done = checked.has(ck);
                      return (
                        <li
                          key={item}
                          onClick={() => toggle(ck)}
                          className="flex items-start gap-2 cursor-pointer group/item"
                        >
                          <div className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${done ? "bg-[var(--olive)] border-[var(--olive)]" : "bg-white border-[var(--warm-gray)] group-hover/item:border-[var(--olive)]"}`}>
                            {done && <Icon name="Check" size={10} className="text-white" />}
                          </div>
                          <span className={`font-body text-sm transition-colors ${done ? "line-through text-[var(--warm-gray)]" : "text-[var(--graphite)]"}`}>
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
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