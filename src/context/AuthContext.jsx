import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ LOGIN
  const login = async (email, password) => {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    console.log("✅ LOGIN RESPONSE:", res);

    // 🔥 FIX: support both formats
    const token = res.access_token || res.token;

    if (!token) {
      throw new Error('No token received from server');
    }

    // ✅ SAVE TOKEN
    localStorage.setItem('ttm_token', token);

    console.log("💾 Saved token:", token);

    // ✅ Fetch user AFTER token is saved
    const me = await api.get('/auth/me');
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
        console.error("Auto login failed:", err);
        logout();
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);