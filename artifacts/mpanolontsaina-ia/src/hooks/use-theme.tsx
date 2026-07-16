import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

export type CustomColor = {
  h: number;
  s: number;
  l: number;
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColor: CustomColor | null;
  setCustomColor: (color: CustomColor | null) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_KEY = 'mpanolontsaina_theme';
const COLOR_KEY = 'mpanolontsaina_custom_primary';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  const [customColor, setCustomColorState] = useState<CustomColor | null>(() => {
    const stored = localStorage.getItem(COLOR_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { return null; }
    }
    return null;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (customColor) {
      const l = theme === 'dark' ? Math.min(customColor.l + 20, 90) : customColor.l;
      const hslStr = `${customColor.h} ${customColor.s}% ${l}%`;
      root.style.setProperty('--primary', hslStr);
      root.style.setProperty('--ring', hslStr);
      root.style.setProperty('--primary-border', hslStr);
      localStorage.setItem(COLOR_KEY, JSON.stringify(customColor));
    } else {
      root.style.removeProperty('--primary');
      root.style.removeProperty('--ring');
      root.style.removeProperty('--primary-border');
      localStorage.removeItem(COLOR_KEY);
    }
  }, [theme, customColor]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState, customColor, setCustomColor: setCustomColorState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

export function hexToHslParts(hex: string): CustomColor {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslPartsToHex(color: CustomColor | null): string {
  if (!color) return '#5B2C9E'; // default violet
  let { h, s, l } = color;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
