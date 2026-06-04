import React, { createContext, useState, useEffect, useContext } from 'react';
import { useMediaQuery } from '@mui/material';

const ThemeContext = createContext();

const isThemeMode = (value) => value === 'light' || value === 'dark';

const getInitialMode = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedMode = window.localStorage.getItem('themeMode');
  if (isThemeMode(savedMode)) {
    return savedMode;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProviderWrapper = ({ children }) => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (!isThemeMode(savedMode)) {
      const systemMode = prefersDark ? 'dark' : 'light';
      setMode((currentMode) => (currentMode === systemMode ? currentMode : systemMode));
    }
  }, [prefersDark]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const toggleTheme = () => {
    setMode((currentMode) => {
      const newMode = currentMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
