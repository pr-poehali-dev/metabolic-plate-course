import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Icon from "@/components/ui/icon";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/cabinet");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span className="font-display text-2xl font-semibold text-[var(--olive)]">Худеем вместе</span>
          </a>
          <p className="font-body text-sm text-[var(--warm-gray)] mt-1">легко и вкусно</p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--olive-pale)] p-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-[var(--olive-pale)] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-body font-medium transition-all ${mode === "login" ? "bg-white text-[var(--graphite)] shadow-sm" : "text-[var(--warm-gray)]"}`}
            >
              Войти
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-body font-medium transition-all ${mode === "register" ? "bg-white text-[var(--graphite)] shadow-sm" : "text-[var(--warm-gray)]"}`}
            >
              Зарегистрироваться
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block font-body text-sm font-medium text-[var(--graphite)] mb-1.5">Ваше имя</label>
                <input
                  type="text"
                  required
                  placeholder="Анна"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[var(--olive-pale)] rounded-xl px-4 py-3 font-body text-sm text-[var(--graphite)] bg-white focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--warm-gray)]"
                />
              </div>
            )}

            <div>
              <label className="block font-body text-sm font-medium text-[var(--graphite)] mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="anna@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[var(--olive-pale)] rounded-xl px-4 py-3 font-body text-sm text-[var(--graphite)] bg-white focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--warm-gray)]"
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-[var(--graphite)] mb-1.5">Пароль</label>
              <input
                type="password"
                required
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[var(--olive-pale)] rounded-xl px-4 py-3 font-body text-sm text-[var(--graphite)] bg-white focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--warm-gray)]"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <Icon name="AlertCircle" size={16} className="text-red-500 shrink-0" />
                <p className="font-body text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--olive)] text-[var(--cream)] px-6 py-3.5 rounded-xl font-body font-medium hover:bg-[var(--olive-light)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <Icon name={mode === "login" ? "LogIn" : "UserPlus"} size={16} />
              )}
              {mode === "login" ? "Войти в кабинет" : "Создать аккаунт"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="font-body text-sm text-[var(--warm-gray)] hover:text-[var(--olive)] transition-colors">
            ← Вернуться на главную
          </a>
        </p>
      </div>
    </div>
  );
}
