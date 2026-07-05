import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../api/client';
import type { Role, User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; role: Role; phone?: string; location?: string }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kb_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('kb_token');
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('kb_token', res.data.token);
    setUser(res.data.user);
    return res.data.user as User;
  }

  async function register(data: { name: string; email: string; password: string; role: Role; phone?: string; location?: string }) {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('kb_token', res.data.token);
    setUser(res.data.user);
    return res.data.user as User;
  }

  function logout() {
    localStorage.removeItem('kb_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
