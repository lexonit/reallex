
import React, { createContext, useContext, useState, useEffect } from 'react';
import { hexToHSL } from '../lib/theme';

interface ThemeContextType {
  companyName: string;
  setCompanyName: (name: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  saveTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyName, setCompanyName] = useState('RealLex');
  const [primaryColor, setPrimaryColor] = useState('#F3CCF3'); // Default Pastel Primary Approximation

  // Load from local storage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('companyName');
    const savedColor = localStorage.getItem('primaryColor');
    
    if (savedName) setCompanyName(savedName);
    if (savedColor) {
      setPrimaryColor(savedColor);
      applyThemeToDom(savedColor);
    }
  }, []);

  const applyThemeToDom = (color: string) => {
    const hsl = hexToHSL(color);
    // Wrap in hsl() since index.html config now expects valid color strings.
    // Note: The base theme uses OKLCH, but user overrides via this context use HSL.
    document.documentElement.style.setProperty('--primary', `hsl(${hsl})`);
    document.documentElement.style.setProperty('--ring', `hsl(${hsl})`);
  };

  const saveTheme = () => {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('primaryColor', primaryColor);
    applyThemeToDom(primaryColor);
  };

  return (
    <ThemeContext.Provider value={{ companyName, setCompanyName, primaryColor, setPrimaryColor, saveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};