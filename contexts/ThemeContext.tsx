
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { applyThemeToDOM, generateColorPalette } from '../lib/theme';

interface ThemeContextType {
  companyName: string;
  setCompanyName: (name: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  saveTheme: () => void;
  resetTheme: () => void;
  getColorPalette: () => string[];
  previewColor: (color: string) => void;
  applyPreview: () => void;
  cancelPreview: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyName, setCompanyName] = useState('RealLex');
  const [primaryColor, setPrimaryColor] = useState('#7c3aed'); // Default to a vibrant purple
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [previewColor, setPreviewColorState] = useState<string | null>(null);
  const [originalColor, setOriginalColor] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('companyName');
    const savedColor = localStorage.getItem('primaryColor');
    const savedDarkMode = localStorage.getItem('isDarkMode');
    
    if (savedName) setCompanyName(savedName);
    if (savedColor) {
      setPrimaryColor(savedColor);
    }
    if (savedDarkMode) {
      const isDark = savedDarkMode === 'true';
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
    
    // Apply initial theme
    applyThemeToDOM(savedColor || primaryColor, savedDarkMode === 'true');
  }, []);

  // Update theme when primary color or dark mode changes
  useEffect(() => {
    const colorToApply = previewColor || primaryColor;
    applyThemeToDOM(colorToApply, isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [primaryColor, isDarkMode, previewColor]);

  const saveTheme = useCallback(() => {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('isDarkMode', isDarkMode.toString());
    applyThemeToDOM(primaryColor, isDarkMode);
  }, [companyName, primaryColor, isDarkMode]);

  const resetTheme = useCallback(() => {
    const defaultColor = '#7c3aed';
    const defaultDark = false;
    
    setCompanyName('RealLex');
    setPrimaryColor(defaultColor);
    setIsDarkMode(defaultDark);
    
    localStorage.setItem('companyName', 'RealLex');
    localStorage.setItem('primaryColor', defaultColor);
    localStorage.setItem('isDarkMode', defaultDark.toString());
    
    document.documentElement.classList.toggle('dark', defaultDark);
    applyThemeToDOM(defaultColor, defaultDark);
  }, []);

  const getColorPalette = useCallback(() => {
    return generateColorPalette(primaryColor);
  }, [primaryColor]);

  const previewColorChange = useCallback((color: string) => {
    if (!originalColor) {
      setOriginalColor(primaryColor);
    }
    setPreviewColorState(color);
  }, [primaryColor, originalColor]);

  const applyPreview = useCallback(() => {
    if (previewColor) {
      setPrimaryColor(previewColor);
      setPreviewColorState(null);
      setOriginalColor(null);
    }
  }, [previewColor]);

  const cancelPreview = useCallback(() => {
    setPreviewColorState(null);
    if (originalColor) {
      applyThemeToDOM(originalColor, isDarkMode);
      setOriginalColor(null);
    }
  }, [originalColor, isDarkMode]);

  const contextValue: ThemeContextType = {
    companyName,
    setCompanyName,
    primaryColor,
    setPrimaryColor,
    isDarkMode,
    setIsDarkMode,
    saveTheme,
    resetTheme,
    getColorPalette,
    previewColor: previewColorChange,
    applyPreview,
    cancelPreview
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};