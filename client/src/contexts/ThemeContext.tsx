import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  isDarkMode: false,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      setIsDarkMode(systemTheme === 'dark');
      return;
    }

    root.classList.add(theme);
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    isDarkMode,
    toggleTheme: () => {
      const newTheme = isDarkMode ? 'light' : 'dark';
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

export const useThemeStyles = () => {
  const { isDarkMode } = useTheme();

  return {
    bgClass: isDarkMode
      ? "bg-gray-900"
      : "bg-gradient-to-br from-blue-50 to-indigo-100",
    cardClass: isDarkMode ? "bg-gray-800 text-white" : "bg-white",
    sidebarClass: isDarkMode
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-100",
    textClass: isDarkMode ? "text-white" : "text-gray-800",
    mutedTextClass: isDarkMode ? "text-gray-400" : "text-gray-500",
    isDarkMode,
  };
};