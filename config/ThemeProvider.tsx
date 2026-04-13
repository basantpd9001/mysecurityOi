import React, { createContext, useContext, useState } from 'react';
import { AppTheme, ThemeMode } from '@/types';
import { darkTheme, lightTheme } from './theme';

interface ThemeContextType {
  theme: AppTheme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  themeMode: 'dark',
  toggleTheme: () => {},
  setThemeMode: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = 'dark' }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialMode);

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeModeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
