import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('marche_token'));
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  // Restore session on mount
  useEffect(() => {
    const saved = localStorage.getItem('marche_user');
    if (saved && token) {
      setUser(JSON.parse(saved));
      api.getMyOrders().then(setOrders).catch(() => {});
    }
    setLoading(false);
  }, [token]);

  const saveSession = useCallback((tkn, usr) => {
    setToken(tkn);
    setUser(usr);
    localStorage.setItem('marche_token', tkn);
    localStorage.setItem('marche_user', JSON.stringify(usr));
  }, []);

  const sendOtp = useCallback(async (phone) => {
    await api.sendOtp(phone);
  }, []);

  const verifyOtp = useCallback(async (phone, code) => {
    const result = await api.verifyOtp(phone, code);
    saveSession(result.token, result.user);
    return result;
  }, [saveSession]);

  const completeProfile = useCallback(async (data) => {
    const result = await api.completeProfile(data);
    setUser(result.user);
    localStorage.setItem('marche_user', JSON.stringify(result.user));
    return result;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setOrders([]);
    localStorage.removeItem('marche_token');
    localStorage.removeItem('marche_user');
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.getMyOrders();
      setOrders(data);
    } catch { /* silent */ }
  }, [token]);

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      sendOtp, verifyOtp, completeProfile, logout,
      orders, fetchOrders,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
