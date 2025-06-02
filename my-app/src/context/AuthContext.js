import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and token from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Update auth context when user logs in
  const updateUser = (user, token) => {
    setCurrentUser(user);
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  // Update auth context when user logs out
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};