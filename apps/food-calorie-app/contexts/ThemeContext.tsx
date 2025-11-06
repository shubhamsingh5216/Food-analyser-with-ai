import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, Platform } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'auto' | 'reading';

interface ThemeContextType {
  themeMode: ThemeMode;
  currentTheme: 'light' | 'dark' | 'reading';
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme_mode';

// Simple storage implementation (can be upgraded to AsyncStorage later)
let themeStorage: { [key: string]: string } = {};

const getStorageItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch {
      return themeStorage[key] || null;
    }
  }
  // For native, use in-memory storage (can be upgraded to AsyncStorage if installed)
  return themeStorage[key] || null;
};

const setStorageItem = async (key: string, value: string): Promise<void> => {
  themeStorage[key] = value;
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }
  // For native, themeStorage is already updated above
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getStorageItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto' || savedTheme === 'reading')) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  // Calculate current theme based on mode
  const currentTheme: 'light' | 'dark' | 'reading' = 
    themeMode === 'auto' 
      ? (systemColorScheme ?? 'light')
      : themeMode === 'reading'
      ? 'reading'
      : themeMode;

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await setStorageItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Don't render until theme is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ themeMode, currentTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

