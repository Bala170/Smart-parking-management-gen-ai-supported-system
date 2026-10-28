import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser, adminUser } from '../data/mockData';
import { api } from '../services/apiClient';

const AuthContext = createContext(null);

const isMockMode = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK === 'true';
const isAdminPath = () => window.location.pathname.startsWith('/admin');

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => (
    isMockMode && isAdminPath() ? 'admin' : localStorage.getItem('demo_role') || 'user'
  ));
  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('demo_role') || 'user';
    return isMockMode && isAdminPath() || savedRole === 'admin' ? adminUser : currentUser;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('demo_role', role);
    setUser(role === 'admin' ? adminUser : currentUser);
  }, [role]);

  const switchRole = (newRole) => {
    setRole(newRole);
    setUser(newRole === 'admin' ? adminUser : currentUser);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await api.login(credentials);
      api.setToken(res.token);
      setIsAuthenticated(true);
      if (credentials.role === 'admin' || credentials.identifier?.includes('admin')) {
        setRole('admin');
        setUser(adminUser);
      } else {
        setRole('user');
        setUser(res.user || currentUser);
      }
      return res;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      api.setToken(res.token);
      setIsAuthenticated(true);
      setRole('user');
      setUser(res.user);
      return res;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        switchRole,
        login,
        register,
        logout,
        isAdmin: role === 'admin',
        isUser: role === 'user',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
