import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ SIGNUP  (backend route: POST /auth/signup)
  const signup = async (name, email, password, role) => {
    const res = await api.post('/auth/signup', { name, email, password, role });

    console.log('✅ SIGNUP RESPONSE:', res);

    const token = res.access_token || res.token;
    if (!token) throw new Error('No token received from server');

    localStorage.setItem('ttm_token', token);

    // TokenResponse already contains the full user object — no extra /me call needed
    const me = res.user;
    setUser(me);
    return me;
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });

    console.log('✅ LOGIN RESPONSE:', res);

    const token = res.access_token || res.token;
    if (!token) throw new Error('No token received from server');

    localStorage.setItem('ttm_token', token);

    // TokenResponse already contains the full user object — no extra /me call needed
    const me = res.user;
    setUser(me);
    return me;
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('ttm_token');
    setUser(null);
  };

  // ✅ Auto-login on refresh
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('ttm_token');
      if (!token) return;
      try {
        const me = await api.get('/auth/me');
        setUser(me);
      } catch (err) {
        console.error('Auto login failed:', err);
        logout();
      }
    };
    loadUser();
  }, []);

  // Derive isAdmin from user role
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);