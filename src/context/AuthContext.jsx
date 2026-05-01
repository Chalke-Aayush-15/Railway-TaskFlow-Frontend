import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ttm_token');
    const stored = localStorage.getItem('ttm_user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
        // optionally refresh: api.get('/auth/me').then(d => setUser(d.user || d)).catch(() => logout());
      } catch { logout(); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    const u = data.user || data;
    localStorage.setItem('ttm_token', data.token);
    localStorage.setItem('ttm_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const signup = async (name, email, password, role) => {
    const data = await api.post('/auth/signup', { name, email, password, role });
    const u = data.user || data;
    localStorage.setItem('ttm_token', data.token);
    localStorage.setItem('ttm_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('ttm_token');
    localStorage.removeItem('ttm_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
