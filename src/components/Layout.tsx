import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const navLinks = [
  { to: "/", label: "Главная" },
  { to: "/about", label: "О курсе" },
  { to: "/modules", label: "Модули" },
  { to: "/lessons", label: "Уроки" },
  { to: "/faq", label: "FAQ" },
  { to: "/contacts", label: "Контакты" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)]">
      <header className="sticky top-0 z-50 bg-[var(--cream)] border-b border-[var(--olive-pale)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-semibold text-[var(--olive)]">Худеем вместе</span>
            <span className="text-[var(--graphite)] font-body text-sm hidden sm:block">легко и вкусно</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link font-body text-sm text-[var(--graphite)] hover:text-[var(--olive)] transition-colors ${location.pathname === link.to ? "active text-[var(--olive)]" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/cabinet"
              className="hidden md:flex items-center gap-1.5 bg-[var(--olive)] text-[var(--cream)] px-4 py-2 rounded-lg text-sm font-body hover:bg-[var(--olive-light)] transition-colors"
            >
              <Icon name="User" size={15} />
              Личный кабинет
            </Link>
            <button
              className="md:hidden p-2 text-[var(--graphite)]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[var(--olive-pale)] bg-[var(--cream)] px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`font-body text-sm text-[var(--graphite)] hover:text-[var(--olive)] py-1 ${location.pathname === link.to ? "text-[var(--olive)] font-medium" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/cabinet"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 bg-[var(--olive)] text-[var(--cream)] px-4 py-2 rounded-lg text-sm font-body w-fit mt-1"
            >
              <Icon name="User" size={15} />
              Личный кабинет
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[var(--graphite)] text-[var(--cream)] py-10 mt-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="font-display text-xl font-semibold mb-2">Худеем вместе</p>
              <p className="text-sm text-[var(--olive-pale)] font-body leading-relaxed">
                Онлайн-курс по принципу метаболической тарелки на дефиците калорий — без голода и срывов.
              </p>
            </div>
            <div>
              <p className="font-body font-medium mb-3 text-sm uppercase tracking-wider text-[var(--olive-pale)]">Навигация</p>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="text-sm font-body text-[var(--cream)] opacity-70 hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body font-medium mb-3 text-sm uppercase tracking-wider text-[var(--olive-pale)]">Контакты</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:hello@example.com" className="text-sm font-body text-[var(--cream)] opacity-70 hover:opacity-100 flex items-center gap-2 transition-opacity">
                  <Icon name="Mail" size={14} />
                  hello@example.com
                </a>
                <a href="https://t.me/" className="text-sm font-body text-[var(--cream)] opacity-70 hover:opacity-100 flex items-center gap-2 transition-opacity">
                  <Icon name="Send" size={14} />
                  Telegram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-xs font-body text-[var(--cream)] opacity-40">© 2026 Худеем вместе, легко и вкусно. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
