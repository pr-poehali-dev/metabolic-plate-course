import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const features = [
  { icon: "Clock", text: "6 модулей и 24 урока" },
  { icon: "FileText", text: "PDF-шпаргалки к каждому уроку" },
  { icon: "Table", text: "Таблицы КБЖУ и размеров порций" },
  { icon: "Video", text: "Видео-лекции + текстовые конспекты" },
  { icon: "MessageCircle", text: "Поддержка в чате" },
  { icon: "Infinity", text: "Доступ навсегда" },
];

export default function About() {
  return (
    <Layout>
      <section className="bg-[var(--olive-pale)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--graphite)] mb-4">
            О курсе
          </h1>
          <p className="font-body text-lg text-[var(--warm-gray)] max-w-2xl leading-relaxed">
            Всё, что нужно знать о курсе «Худеем вместе, легко и вкусно»
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display text-3xl font-semibold text-[var(--graphite)] mb-5">
                Что такое метаболическая тарелка?
              </h2>
              <div className="font-body text-[var(--graphite)] leading-relaxed space-y-4 text-base">
                <p>
                  Метаболическая тарелка — это простой визуальный принцип питания, при котором каждый приём пищи 
                  включает правильное соотношение белков, сложных углеводов, клетчатки и полезных жиров.
                </p>
                <p>
                  Этот подход ускоряет обмен веществ, даёт устойчивое насыщение и создаёт естественный 
                  дефицит калорий — без жёстких ограничений и чувства голода.
                </p>
                <p>
                  На курсе вы научитесь составлять свою тарелку инстинктивно, понимать сигналы тела 
                  и выбирать продукты, которые работают на вас.
                </p>
              </div>
            </div>
            <div className="bg-[var(--olive-pale)] rounded-2xl p-8">
              <h3 className="font-display text-2xl font-semibold text-[var(--graphite)] mb-6">
                Что входит в курс
              </h3>
              <div className="space-y-4">
                {features.map((f) => (
                  <div key={f.text} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0">
                      <Icon name={f.icon as "Clock"} size={17} className="text-[var(--olive)]" />
                    </div>
                    <span className="font-body text-sm text-[var(--graphite)]">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-[var(--olive-pale)]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-display text-3xl font-semibold text-[var(--graphite)] mb-8 text-center">
            Для кого этот курс
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Хотите похудеть без диет", desc: "Устали от жёстких ограничений — этот курс для вас" },
              { title: "Новички в правильном питании", desc: "Доступно объясним все принципы с нуля" },
              { title: "Любите вкусно есть", desc: "Вы узнаете, как худеть, наслаждаясь едой" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-[var(--olive-pale)]">
                <div className="w-8 h-8 bg-[var(--olive-pale)] rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Check" size={16} className="text-[var(--olive)]" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--graphite)] mb-2">{item.title}</h3>
                <p className="font-body text-sm text-[var(--warm-gray)]">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/modules"
              className="inline-flex items-center gap-2 bg-[var(--olive)] text-[var(--cream)] px-8 py-3.5 rounded-lg font-body font-medium hover:bg-[var(--olive-light)] transition-colors"
            >
              Посмотреть модули
              <Icon name="ArrowRight" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
