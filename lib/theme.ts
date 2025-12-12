
// Enhanced color utilities for theme system
export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  ring: string;
}

// Convert hex to HSL with proper precision
export function hexToHSL(hex: string): string {
  const hsl = hexToHSLObject(hex);
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

export function hexToHSLObject(hex: string): HSLColor {
  // Remove hash if present
  hex = hex.replace(/^#/, '');

  let r = 0, g = 0, b = 0;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex[0] + hex[1], 16);
    g = parseInt(hex[2] + hex[3], 16);
    b = parseInt(hex[4] + hex[5], 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0, s = 0, l = 0;

  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
  return {
    h: h,
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Convert HSL back to hex
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Calculate luminance for contrast calculations
export function getLuminance(hex: string): number {
  const rgb = hexToRGB(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Get appropriate foreground color with good contrast
export function getForegroundColor(backgroundColor: string, isDark = false): string {
  const bgLuminance = getLuminance(backgroundColor);
  
  // Use smart contrast calculation
  if (isDark) {
    return bgLuminance > 0.5 ? '#1a1a1a' : '#ffffff';
  } else {
    return bgLuminance > 0.5 ? '#1a1a1a' : '#ffffff';
  }
}

// Convert hex to RGB object
export function hexToRGB(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace(/^#/, '');
  
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  return {
    r: parseInt(hex.substr(0, 2), 16),
    g: parseInt(hex.substr(2, 2), 16),
    b: parseInt(hex.substr(4, 2), 16)
  };
}

// Generate complementary colors based on primary
export function generateThemeColors(primaryHex: string, isDark = false): ThemeColors {
  const primary = hexToHSLObject(primaryHex);
  
  // Generate secondary color (shifted hue)
  const secondaryHue = (primary.h + 30) % 360;
  const secondary = hslToHex(secondaryHue, Math.max(primary.s - 20, 20), isDark ? 25 : 90);
  
  // Generate accent color (complementary)
  const accentHue = (primary.h + 180) % 360;
  const accent = hslToHex(accentHue, Math.max(primary.s - 10, 30), isDark ? 30 : 85);
  
  // Generate muted color (low saturation)
  const muted = hslToHex(primary.h, Math.max(primary.s - 50, 5), isDark ? 20 : 95);
  
  // Generate destructive color (red-based)
  const destructive = isDark ? '#dc2626' : '#ef4444';
  
  return {
    primary: primaryHex,
    primaryForeground: getForegroundColor(primaryHex, isDark),
    secondary: secondary,
    secondaryForeground: getForegroundColor(secondary, isDark),
    accent: accent,
    accentForeground: getForegroundColor(accent, isDark),
    muted: muted,
    mutedForeground: isDark ? '#a1a1aa' : '#6b7280',
    destructive: destructive,
    destructiveForeground: getForegroundColor(destructive, isDark),
    ring: primaryHex
  };
}

// Apply theme to DOM with all necessary variables
export function applyThemeToDOM(primaryColor: string, isDark = false): void {
  const colors = generateThemeColors(primaryColor, isDark);
  const root = document.documentElement;
  
  // Convert hex colors to HSL for CSS variables
  Object.entries(colors).forEach(([key, value]) => {
    if (key.includes('Foreground')) {
      // Handle foreground colors
      const varName = `--${key.replace('Foreground', '-foreground').replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(varName, `hsl(${hexToHSL(value)})`);
    } else {
      // Handle main colors
      const varName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(varName, `hsl(${hexToHSL(value)})`);
    }
  });
}

// Generate a palette of harmonious colors
export function generateColorPalette(baseHex: string): string[] {
  const base = hexToHSLObject(baseHex);
  const palette = [];
  
  // Monochromatic variations
  for (let i = 0; i < 3; i++) {
    const lightness = Math.max(20, Math.min(80, base.l + (i - 1) * 20));
    palette.push(hslToHex(base.h, base.s, lightness));
  }
  
  // Analogous colors
  for (let i = 1; i <= 2; i++) {
    const hue = (base.h + i * 30) % 360;
    palette.push(hslToHex(hue, base.s, base.l));
    
    const hue2 = (base.h - i * 30 + 360) % 360;
    palette.push(hslToHex(hue2, base.s, base.l));
  }
  
  // Complementary
  const compHue = (base.h + 180) % 360;
  palette.push(hslToHex(compHue, base.s, base.l));
  
  return [...new Set(palette)]; // Remove duplicates
}
