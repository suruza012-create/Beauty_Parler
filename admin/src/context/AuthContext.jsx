import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('adminUser') || 'null');
    } catch (error) {
      console.error('Unable to restore admin session:', error);
      localStorage.removeItem('adminUser');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    api.get('/auth/me')
      .then(({ data }) => {
        if (data.user?.role !== 'admin') {
          throw new Error('Admin access only');
        }
        setUser(data.user);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
      })
      .catch(error => {
        console.error('Unable to validate admin session:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setUser(null);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.user?.role !== 'admin') {
        return { success: false, message: 'Admin access only!' };
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, lang, setLang }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
