import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

const benefits = [
  { icon: "Salad", title: "Метаболическая тарелка", desc: "Простой принцип, который работает без подсчёта каждой калории" },
  { icon: "TrendingDown", title: "Дефицит без голода", desc: "Научишься есть меньше калорий, оставаясь сытой и довольной" },
  { icon: "ChefHat", title: "Вкусные рецепты", desc: "Блюда, которые хочется готовить снова и снова" },
  { icon: "BookOpen", title: "Материалы и PDF", desc: "Таблицы, шпаргалки и планы питания для скачивания" },
];

const steps = [
  { num: "01", title: "Понимаешь принцип", desc: "Узнаёшь, как работает метаболическая тарелка и почему она эффективна" },
  { num: "02", title: "Собираешь свою тарелку", desc: "Практикуешься составлять сбалансированные приёмы пищи" },
  { num: "03", title: "Создаёшь дефицит", desc: "Учишься мягко снижать калории без срывов и голода" },
  { num: "04", title: "Видишь результат", desc: "Чувствуешь лёгкость, бодрость и видишь цифры на весах" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[var(--olive-pale)] py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="inline-flex items-center gap-2 bg-white/70 text-[var(--olive)] text-sm font-body px-4 py-1.5 rounded-full mb-6 border border-[var(--olive-pale)]">
            <Icon name="Sparkles" size={14} />
            Онлайн-курс по правильному питанию
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-[var(--graphite)] mb-6 leading-tight">
            Худеем вместе,<br />
            <span className="text-[var(--olive)]">легко и вкусно</span>
          </h1>
          <p className="font-body text-lg text-[var(--warm-gray)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Принцип метаболической тарелки на дефиците калорий — простой, понятный и без голода. 
            Вы похудеете, не отказываясь от вкусной еды.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/modules"
              className="bg-[var(--olive)] text-[var(--cream)] px-8 py-3.5 rounded-lg font-body font-medium hover:bg-[var(--olive-light)] transition-colors flex items-center justify-center gap-2"
            >
              Начать курс
              <Icon name="ArrowRight" size={18} />
            </Link>
            <Link
              to="/about"
              className="border border-[var(--olive)] text-[var(--olive)] px-8 py-3.5 rounded-lg font-body font-medium hover:bg-white transition-colors"
            >
              О курсе подробнее
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--graphite)] text-center mb-12">
            Что вас ждёт на курсе
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="card-hover bg-white rounded-2xl p-6 border border-[var(--olive-pale)]">
                <div className="w-11 h-11 bg-[var(--olive-pale)] rounded-xl flex items-center justify-center mb-4">
                  <Icon name={b.icon as "Salad"} size={22} className="text-[var(--olive)]" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--graphite)] mb-2">{b.title}</h3>
                <p className="font-body text-sm text-[var(--warm-gray)] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-[var(--olive-pale)]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--graphite)] text-center mb-12">
            Как проходит обучение
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-5 bg-white rounded-2xl p-6 border border-[var(--olive-pale)]">
                <span className="font-display text-4xl font-semibold text-[var(--olive)] opacity-40 leading-none mt-1 shrink-0">{s.num}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-[var(--graphite)] mb-1">{s.title}</h3>
                  <p className="font-body text-sm text-[var(--warm-gray)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-[var(--graphite)] rounded-3xl p-10 md:p-14 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--cream)] mb-4">
              Готовы начать путь к лёгкости?
            </h2>
            <p className="font-body text-[var(--olive-pale)] mb-8 max-w-xl mx-auto">
              Присоединяйтесь к курсу и получите все материалы, уроки и поддержку.
            </p>
            <Link
              to="/modules"
              className="inline-flex items-center gap-2 bg-[var(--olive-pale)] text-[var(--graphite)] px-8 py-3.5 rounded-lg font-body font-medium hover:bg-white transition-colors"
            >
              Перейти к модулям
              <Icon name="ArrowRight" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
