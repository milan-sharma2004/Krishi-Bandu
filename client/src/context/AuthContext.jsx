import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { getErrorMessage, getToken, setToken } from '../api/client.js';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      return null;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      return res.data.user;
    } catch {
      setToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      await refreshUser();
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [refreshUser]);

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
    }
    window.addEventListener('kb:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('kb:unauthorized', handleUnauthorized);
  }, []);

  async function login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async function register(data) {
    try {
      const res = await api.post('/auth/register', data);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  async function updateProfile(data) {
    const res = await api.put('/auth/me', data);
    setUser(res.data.user);
    return res.data.user;
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
