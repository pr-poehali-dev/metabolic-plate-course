import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const AUTH_URL = "https://functions.poehali.dev/d2999884-3e94-4dd0-887f-00c61baef73d";
const TOKEN_KEY = "auth_token";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem(TOKEN_KEY) || '';

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    fetch(`${AUTH_URL}?action=me`, { headers: { 'X-Auth-Token': token } })
      .then(r => r.json())
      .then(data => { if (data.user) setUser(data.user); else localStorage.removeItem(TOKEN_KEY); })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${AUTH_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка входа');
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${AUTH_URL}?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  };

  const logout = async () => {
    const token = getToken();
    if (token) {
      await fetch(`${AUTH_URL}?action=logout`, {
        method: 'POST',
        headers: { 'X-Auth-Token': token },
      }).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
