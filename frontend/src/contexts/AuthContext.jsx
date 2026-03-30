import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedCredentials, setSavedCredentials] = useState([]);

  // Axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load saved credentials from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedCredentials');
    if (saved) {
      setSavedCredentials(JSON.parse(saved));
    }
  }, []);

  const saveCredentialsToStorage = (creds) => {
    localStorage.setItem('savedCredentials', JSON.stringify(creds));
    setSavedCredentials(creds);
  };

const addSavedCredential = (email, password) => {
    const current = savedCredentials || [];
    const exists = current.find(c => c.email === email);
    let newCreds;
    if (exists) {
      newCreds = current.map(c => c.email === email ? {email, password} : c);
    } else {
      newCreds = [{email, password}, ...current].slice(0, 5);
    }
    saveCredentialsToStorage(newCreds);
  };

  const getSavedCredentials = () => {
    return savedCredentials;
  };

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/login', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    // Auto-save credentials after successful login
    addSavedCredential(email, password);
    // Decode token for user if needed (add jwt-decode later)
    return response.data;
  };

  const register = async (email, password) => {
    const response = await axios.post('http://localhost:5000/register', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => !!token;

  useEffect(() => {
    if (token) {
      // Verify token if needed
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated, loading, savedCredentials, getSavedCredentials, addSavedCredential }}>
      {children}
    </AuthContext.Provider>
  );
};

