import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

export default function Contacts() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Layout>
      <section className="bg-[var(--olive-pale)] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--graphite)] mb-4">
            Контакты
          </h1>
          <p className="font-body text-lg text-[var(--warm-gray)] max-w-2xl leading-relaxed">
            Свяжитесь с нами — мы ответим на любые вопросы о курсе
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--graphite)] mb-6">
                Способы связи
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[var(--olive-pale)] rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="Mail" size={19} className="text-[var(--olive)]" />
                  </div>
                  <div>
                    <p className="font-body font-medium text-[var(--graphite)] text-sm mb-0.5">Электронная почта</p>
                    <a href="mailto:hello@example.com" className="font-body text-[var(--olive)] hover:underline text-sm">
                      hello@example.com
                    </a>
                    <p className="font-body text-xs text-[var(--warm-gray)] mt-0.5">Отвечаем в течение рабочего дня</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[var(--olive-pale)] rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="Send" size={19} className="text-[var(--olive)]" />
                  </div>
                  <div>
                    <p className="font-body font-medium text-[var(--graphite)] text-sm mb-0.5">Telegram</p>
                    <a href="https://t.me/" className="font-body text-[var(--olive)] hover:underline text-sm">
                      @hudeem_vmeste
                    </a>
                    <p className="font-body text-xs text-[var(--warm-gray)] mt-0.5">Чат поддержки для участников</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[var(--olive-pale)] rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="Clock" size={19} className="text-[var(--olive)]" />
                  </div>
                  <div>
                    <p className="font-body font-medium text-[var(--graphite)] text-sm mb-0.5">Время работы</p>
                    <p className="font-body text-sm text-[var(--warm-gray)]">Пн–Пт, 9:00–18:00 (МСК)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              {sent ? (
                <div className="bg-[var(--olive-pale)] rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-14 h-14 bg-[var(--olive)] rounded-2xl flex items-center justify-center mb-4">
                    <Icon name="Check" size={26} className="text-[var(--cream)]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[var(--graphite)] mb-2">Сообщение отправлено!</h3>
                  <p className="font-body text-sm text-[var(--warm-gray)]">Мы ответим вам в ближайшее время.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block font-body text-sm font-medium text-[var(--graphite)] mb-1.5">
                      Ваше имя
                    </label>
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
                    <label className="block font-body text-sm font-medium text-[var(--graphite)] mb-1.5">
                      Электронная почта
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="anna@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-[var(--olive-pale)] rounded-xl px-4 py-3 font-body text-sm text-[var(--graphite)] bg-white focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--warm-gray)]"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-[var(--graphite)] mb-1.5">
                      Сообщение
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Ваш вопрос или сообщение..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-[var(--olive-pale)] rounded-xl px-4 py-3 font-body text-sm text-[var(--graphite)] bg-white focus:outline-none focus:border-[var(--olive)] transition-colors resize-none placeholder:text-[var(--warm-gray)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[var(--olive)] text-[var(--cream)] px-6 py-3.5 rounded-xl font-body font-medium hover:bg-[var(--olive-light)] transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="Send" size={16} />
                    Отправить сообщение
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
