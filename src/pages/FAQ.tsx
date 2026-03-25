import Layout from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const faqs = [
  {
    q: "Что такое метаболическая тарелка?",
    a: "Метаболическая тарелка — это принцип питания, при котором каждый приём пищи содержит правильное соотношение белков, сложных углеводов, клетчатки и полезных жиров. Этот баланс поддерживает обмен веществ и создаёт естественное насыщение.",
  },
  {
    q: "Нужно ли считать калории?",
    a: "Нет — в этом главная прелесть метода! Вы учитесь визуально составлять тарелку так, чтобы автоматически создавать умеренный дефицит калорий. Никаких весов и приложений с подсчётами.",
  },
  {
    q: "Как долго проходит курс?",
    a: "Курс рассчитан на 6 недель — по одному модулю в неделю. Вы можете проходить в своём темпе: доступ к материалам остаётся навсегда.",
  },
  {
    q: "Какие материалы прилагаются к урокам?",
    a: "К каждому уроку есть конспект, к большинству — PDF-шпаргалка для скачивания. Отдельные уроки содержат таблицы КБЖУ продуктов, размеров порций и дополнительные чек-листы.",
  },
  {
    q: "Подойдёт ли курс, если у меня нет опыта с правильным питанием?",
    a: "Да! Курс разработан специально для тех, кто начинает с нуля. Все термины объясняются доступным языком, уроки короткие и практичные.",
  },
  {
    q: "Можно ли питаться так при заболеваниях?",
    a: "Метаболическая тарелка — это общие принципы здорового питания. При наличии хронических заболеваний или особых медицинских показаний рекомендуем проконсультироваться с врачом перед началом курса.",
  },
  {
    q: "Как быстро можно увидеть результат?",
    a: "Большинство участников замечают изменения в самочувствии и снижении веса уже к третьей неделе. Скорость зависит от исходного рациона, образа жизни и вашей вовлечённости.",
  },
  {
    q: "Есть ли поддержка во время курса?",
    a: "Да! У участников курса есть доступ к чату с куратором, где можно задавать вопросы, делиться результатами и получать обратную связь.",
  },
];

export default function FAQ() {
  return (
    <Layout>
      <section className="bg-[var(--olive-pale)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--graphite)] mb-4">
            Часто задаваемые вопросы
          </h1>
          <p className="font-body text-lg text-[var(--warm-gray)] max-w-2xl leading-relaxed">
            Ответы на самые распространённые вопросы о курсе и методе
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-white border border-[var(--olive-pale)] rounded-2xl px-6 py-1 data-[state=open]:border-[var(--olive)]"
              >
                <AccordionTrigger className="font-body font-medium text-[var(--graphite)] text-left hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-[var(--warm-gray)] leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 bg-[var(--olive-pale)] rounded-2xl p-8 text-center">
            <p className="font-display text-2xl font-semibold text-[var(--graphite)] mb-2">
              Не нашли ответ?
            </p>
            <p className="font-body text-sm text-[var(--warm-gray)] mb-5">
              Напишите нам — ответим в течение рабочего дня
            </p>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 bg-[var(--olive)] text-[var(--cream)] px-6 py-3 rounded-lg font-body text-sm font-medium hover:bg-[var(--olive-light)] transition-colors"
            >
              <Icon name="Mail" size={15} />
              Написать нам
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
