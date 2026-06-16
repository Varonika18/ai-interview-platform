import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

const light = {
  mode: 'light',
  bg: '#f8f9fb',
  surface: '#ffffff',
  surfaceAlt: '#f3f4f6',
  border: '#e5e7eb',
  text: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  heading: '#374151',
  primaryBg: '#eef2ff',
  primaryText: '#6366f1',
  navBg: '#ffffff',
  navBorder: '#e5e7eb',
  inputBg: '#f9fafb',
  inputBorder: '#e5e7eb',
  btnSecondaryBg: '#f3f4f6',
  btnSecondaryText: '#374151',
  btnSecondaryBorder: '#e5e7eb',
  progressTrack: '#e5e7eb',
  subjectSelected: '#eef2ff',
  subjectSelectedText: '#6366f1',
  subjectSelectedBorder: '#6366f1',
};

const dark = {
  mode: 'dark',
  bg: '#0f172a',
  surface: '#1e293b',
  surfaceAlt: '#273549',
  border: '#334155',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  heading: '#e2e8f0',
  primaryBg: '#1e1b4b',
  primaryText: '#818cf8',
  navBg: '#1e293b',
  navBorder: '#334155',
  inputBg: '#0f172a',
  inputBorder: '#334155',
  btnSecondaryBg: '#273549',
  btnSecondaryText: '#e2e8f0',
  btnSecondaryBorder: '#334155',
  progressTrack: '#334155',
  subjectSelected: '#1e1b4b',
  subjectSelectedText: '#818cf8',
  subjectSelectedBorder: '#818cf8',
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, colors: mode === 'light' ? light : dark }}>
      {children}
    </ThemeContext.Provider>
  );
}
