import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import api, {
  getErrorMessage,
  getToken,
  setToken,
} from '../api/client.js';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();

    if (!token) {
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

    async function restoreSession() {
      setLoading(true);

      await refreshUser();

      if (active) {
        setLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, [refreshUser]);

  useEffect(() => {
    function handleUnauthorized() {
      setToken(null);
      setUser(null);
    }

    window.addEventListener(
      'kb:unauthorized',
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        'kb:unauthorized',
        handleUnauthorized
      );
    };
  }, []);

  async function login(
  email,
  password,
  rememberMe = false
) {
  try {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    setToken(res.data.token, rememberMe);
    setUser(res.data.user);

    return res.data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

  async function register(data) {
    try {
      const res = await api.post('/auth/register', data);

      // Do not save a token or log in automatically.
      // The new account is pending admin approval.
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  function logout() {
    // setToken(null) should clear stored JWT and Axios header.
    setToken(null);
    setUser(null);
  }

  async function updateProfile(data) {
    try {
      const res = await api.put('/auth/me', data);

      setUser(res.data.user);

      return res.data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}