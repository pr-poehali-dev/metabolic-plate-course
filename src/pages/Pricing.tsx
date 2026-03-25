import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

const plans = [
  {
    id: "basic",
    name: "Базовый",
    price: 6000,
    duration: "2 месяца",
    color: "var(--olive-pale)",
    popular: false,
    features: [
      "Доступ к 6 модулям курса",
      "12 видеоуроков",
      "PDF-материалы к каждому модулю",
      "Поддержка в общем чате",
    ],
  },
  {
    id: "standard",
    name: "Стандарт",
    price: 14000,
    duration: "3 месяца",
    color: "var(--olive)",
    popular: true,
    features: [
      "Доступ к 6 модулям курса",
      "12 видеоуроков",
      "PDF-материалы к каждому модулю",
      "Поддержка в общем чате",
      "Еженедельные групповые созвоны",
      "Персональный план питания",
    ],
  },
  {
    id: "premium",
    name: "Премиум",
    price: 24000,
    duration: "4 месяца",
    color: "var(--graphite)",
    popular: false,
    features: [
      "Доступ к 6 модулям курса",
      "12 видеоуроков",
      "PDF-материалы к каждому модулю",
      "Поддержка в общем чате",
      "Еженедельные групповые созвоны",
      "Персональный план питания",
      "Личные консультации с куратором",
      "Разбор вашего рациона",
    ],
  },
];

export default function Pricing() {
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedPlan = plans.find((p) => p.id === selected);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <Layout>
      <section className="bg-[var(--olive-pale)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--graphite)] mb-4">
            Выберите тариф
          </h1>
          <p className="font-body text-lg text-[var(--warm-gray)] max-w-xl mx-auto leading-relaxed">
            Три варианта участия — выберите тот, что подходит вам по темпу и целям
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                  selected === plan.id
                    ? "border-[var(--olive)] shadow-lg scale-[1.02]"
                    : "border-[var(--olive-pale)] hover:border-[var(--olive)] hover:shadow-md"
                } ${plan.popular ? "bg-[var(--graphite)] text-[var(--cream)]" : "bg-white"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[var(--olive)] text-[var(--cream)] text-xs font-body font-medium px-4 py-1 rounded-full">
                      Популярный
                    </span>
                  </div>
                )}

                {selected === plan.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-[var(--olive)] rounded-full flex items-center justify-center">
                      <Icon name="Check" size={13} className="text-white" />
                    </div>
                  </div>
                )}

                <p className={`font-body text-sm font-medium mb-1 ${plan.popular ? "text-[var(--olive-pale)]" : "text-[var(--warm-gray)]"}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`font-display text-4xl font-semibold ${plan.popular ? "text-[var(--cream)]" : "text-[var(--graphite)]"}`}>
                    {plan.price.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className={`inline-flex items-center gap-1.5 text-xs font-body px-3 py-1 rounded-full mb-5 ${plan.popular ? "bg-white/10 text-[var(--cream)]" : "bg-[var(--olive-pale)] text-[var(--olive)]"}`}>
                  <Icon name="Clock" size={11} />
                  {plan.duration}
                </div>

                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Icon
                        name="Check"
                        size={14}
                        className={`mt-0.5 shrink-0 ${plan.popular ? "text-[var(--olive-pale)]" : "text-[var(--olive)]"}`}
                      />
                      <span className={`font-body text-sm leading-snug ${plan.popular ? "text-[var(--cream)] opacity-90" : "text-[var(--graphite)]"}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-lg mx-auto">
            <div className="bg-white border border-[var(--olive-pale)] rounded-2xl p-8">
              {sent ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-[var(--olive-pale)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name="Check" size={26} className="text-[var(--olive)]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[var(--graphite)] mb-2">Заявка отправлена!</h3>
                  <p className="font-body text-sm text-[var(--warm-gray)]">
                    Мы свяжемся с вами в ближайшее время и расскажем о следующих шагах.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-semibold text-[var(--graphite)] mb-1">
                    Оставить заявку
                  </h2>
                  <p className="font-body text-sm text-[var(--warm-gray)] mb-6">
                    {selectedPlan
                      ? `Тариф: ${selectedPlan.name} — ${selectedPlan.price.toLocaleString("ru-RU")} ₽ / ${selectedPlan.duration}`
                      : "Выберите тариф выше, затем заполните форму"}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block font-body text-sm font-medium text-[var(--graphite)] mb-1.5">Ваше имя</label>
                      <input
                        type="text"
                        required
                        placeholder="Анна"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-[var(--olive-pale)] rounded-xl px-4 py-3 font-body text-sm text-[var(--graphite)] bg-white focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--warm-gray)]"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-[var(--graphite)] mb-1.5">Телефон</label>
                      <input
                        type="tel"
                        required
                        placeholder="+7 (999) 000-00-00"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-[var(--olive-pale)] rounded-xl px-4 py-3 font-body text-sm text-[var(--graphite)] bg-white focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--warm-gray)]"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-[var(--graphite)] mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="anna@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-[var(--olive-pale)] rounded-xl px-4 py-3 font-body text-sm text-[var(--graphite)] bg-white focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--warm-gray)]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!selected || loading}
                      className="w-full bg-[var(--olive)] text-[var(--cream)] px-6 py-3.5 rounded-xl font-body font-medium hover:bg-[var(--olive-light)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Icon name="Loader2" size={16} className="animate-spin" />
                      ) : (
                        <Icon name="Send" size={16} />
                      )}
                      {selected ? "Отправить заявку" : "Сначала выберите тариф"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
