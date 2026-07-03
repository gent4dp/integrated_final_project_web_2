import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('kampusfix_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('kampusfix_token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    api.get('/auth/profile')
      .then((response) => {
        setUser(response.data.data);
      })
      .catch(() => {
        localStorage.removeItem('kampusfix_token');
        delete api.defaults.headers.common.Authorization;
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const payload = response.data.data;

    localStorage.setItem('kampusfix_token', payload.token);
    api.defaults.headers.common.Authorization = `Bearer ${payload.token}`;
    setToken(payload.token);
    setUser(payload.user);

    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }

    localStorage.removeItem('kampusfix_token');
    delete api.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    logout,
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
