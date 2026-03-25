import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const modules = [
  {
    num: "01",
    title: "Введение в метаболическую тарелку",
    desc: "Узнаёте, что такое метаболическая тарелка, как она влияет на обмен веществ и почему работает лучше обычных диет.",
    lessons: 4,
    hasPdf: true,
  },
  {
    num: "02",
    title: "Белки — строительный материал",
    desc: "Изучаете роль белка в похудении, какие источники выбирать и как включать белок в каждый приём пищи.",
    lessons: 4,
    hasPdf: true,
  },
  {
    num: "03",
    title: "Углеводы без страха",
    desc: "Разбираетесь, какие углеводы помогают худеть, а какие мешают. Учитесь выбирать «умные» углеводы.",
    lessons: 4,
    hasPdf: true,
  },
  {
    num: "04",
    title: "Клетчатка и овощи",
    desc: "Открываете силу клетчатки для насыщения и здоровья кишечника. Практикуете наполнение тарелки овощами.",
    lessons: 4,
    hasPdf: true,
  },
  {
    num: "05",
    title: "Расчет дефицита калорий",
    desc: "Создаёте мягкий дефицит с помощью тарелки — без приложений, весов и стресса.",
    lessons: 4,
    hasPdf: true,
  },
  {
    num: "06",
    title: "Привычки и долгосрочный результат",
    desc: "Выстраиваете устойчивые пищевые привычки, которые работают всю жизнь.",
    lessons: 4,
    hasPdf: true,
  },
];

export default function Modules() {
  return (
    <Layout>
      <section className="bg-[var(--olive-pale)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--graphite)] mb-4">
            Модули курса
          </h1>
          <p className="font-body text-lg text-[var(--warm-gray)] max-w-2xl leading-relaxed">
            6 модулей — от основ до устойчивого результата. К каждому модулю прилагаются PDF-материалы.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-5">
            {modules.map((mod, i) => (
              <div
                key={mod.num}
                className="card-hover bg-white border border-[var(--olive-pale)] rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start"
              >
                <span className="font-display text-4xl font-semibold text-[var(--olive)] opacity-30 leading-none shrink-0 mt-1">
                  {mod.num}
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-semibold text-[var(--graphite)] mb-2">{mod.title}</h2>
                  <p className="font-body text-sm text-[var(--warm-gray)] leading-relaxed mb-4">{mod.desc}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-body text-[var(--olive)] bg-[var(--olive-pale)] px-3 py-1 rounded-full">
                      <Icon name="BookOpen" size={12} />
                      {mod.lessons} урока
                    </span>
                    {mod.hasPdf && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-body text-[var(--warm-gray)] bg-[var(--olive-pale)] px-3 py-1 rounded-full">
                        <Icon name="FileText" size={12} />
                        PDF-материалы
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  to="/lessons"
                  className="shrink-0 flex items-center gap-1.5 text-sm font-body text-[var(--olive)] hover:text-[var(--graphite)] transition-colors mt-2 sm:mt-0"
                >
                  Уроки
                  <Icon name="ChevronRight" size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}