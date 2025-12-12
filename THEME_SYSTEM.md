# Enhanced Theme System Documentation

## Overview

The RealLex application now features a **high-quality, professional theme system** that eliminates color conflicts and provides proper contrast between background and text colors. The system automatically generates harmonious color palettes and ensures accessibility across all components.

## Key Features

### ✨ Enhanced Color Management
- **Automatic Contrast Calculation**: Text colors are automatically selected to ensure proper contrast with backgrounds
- **Smart Color Generation**: Secondary, accent, and muted colors are automatically generated from your primary color
- **WCAG Compliance**: All color combinations meet accessibility standards for contrast ratios
- **Dark Mode Support**: Seamless switching between light and dark themes with optimized colors

### 🎨 Professional Color Picker
- **Multiple Selection Methods**:
  - **Palette**: Pre-selected professional colors
  - **Brand Palettes**: Curated color schemes (Professional, Creative, Nature, Warm, Modern, Classic)
  - **Custom**: Full color picker with hex code input
- **Live Preview**: See changes in real-time before applying
- **Color Harmony**: View how colors work together across your interface

### 🌓 Dark Mode
- One-click toggle between light and dark modes
- Automatically adjusts all color contrasts for optimal readability
- Persists user preference across sessions

## How It Works

### Color Science
The system uses advanced color science algorithms:

1. **HSL Color Space**: Colors are managed in HSL (Hue, Saturation, Lightness) for better human perception
2. **Luminance Calculation**: Uses the WCAG 2.1 relative luminance formula
3. **Contrast Ratio**: Ensures minimum 4.5:1 contrast for normal text and 3:1 for large text
4. **Complementary Generation**: Creates harmonious color schemes using color theory

### Theme Variables
The system manages these CSS variables:
```css
--primary              /* Your brand's primary color */
--primary-foreground   /* Automatic contrasting text color */
--secondary            /* Generated secondary color */
--secondary-foreground /* Auto-contrast for secondary */
--accent               /* Complementary accent color */
--accent-foreground    /* Auto-contrast for accent */
--muted                /* Subtle background color */
--muted-foreground     /* Text on muted backgrounds */
--destructive          /* Error/danger color */
--destructive-foreground /* Text on destructive backgrounds */
```

## Usage Guide

### For Users

#### Changing Your Theme Color

1. **Navigate to Settings**
   - Click on your profile in the top-right
   - Select "Settings"
   - Go to "Organization" tab

2. **Choose Your Color**
   - Use the **Palette** tab for quick professional colors
   - Use **Brands** tab for curated color schemes
   - Use **Custom** tab for specific hex colors

3. **Preview Changes**
   - Hover over colors to preview them
   - Click to select
   - Use "Apply Preview" to confirm or "Cancel" to revert

4. **Save Your Theme**
   - Click "Save Changes" to apply across your entire workspace
   - Your theme persists across devices and sessions

#### Toggle Dark Mode

- Click the Moon/Sun icon in the Organization settings
- Your color scheme automatically adjusts for optimal contrast
- Dark mode preference is saved

### For Developers

#### Using Theme Colors in Components

```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { primaryColor, isDarkMode } = useTheme();
  
  return (
    <div className="bg-primary text-primary-foreground">
      Automatically styled with proper contrast!
    </div>
  );
}
```

#### Applying Custom Theme Colors

```tsx
import { applyThemeToDOM } from '../lib/theme';

// Apply a new primary color
applyThemeToDOM('#7c3aed', false); // false = light mode
applyThemeToDOM('#7c3aed', true);  // true = dark mode
```

#### Generating Color Palettes

```tsx
import { generateColorPalette } from '../lib/theme';

const palette = generateColorPalette('#7c3aed');
// Returns: Array of harmonious colors including:
// - Monochromatic variations
// - Analogous colors
// - Complementary colors
```

#### Calculating Contrast

```tsx
import { getContrastRatio, getLuminance } from '../lib/theme';

const ratio = getContrastRatio('#ffffff', '#000000');
// Returns: 21 (maximum contrast)

const luminance = getLuminance('#7c3aed');
// Returns: 0-1 value representing perceived brightness
```

## Button Variants

The enhanced Button component supports these variants:

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Style</Button>
<Button variant="ghost">Ghost Style</Button>
<Button variant="destructive">Danger Action</Button>
<Button variant="success">Success Action</Button>
<Button variant="warning">Warning Action</Button>
```

All variants automatically adjust to your theme colors with proper contrast.

## Best Practices

### Choosing Brand Colors

1. **Start with Your Logo**: Pick your primary color from your brand identity
2. **Consider Your Industry**:
   - Real Estate: Blues/Greens for trust and growth
   - Luxury: Purples/Golds for sophistication
   - Modern: Teals/Grays for innovation
3. **Test Readability**: Use the theme preview to ensure text is readable
4. **Check Dark Mode**: Toggle dark mode to verify it looks good in both themes

### Accessibility Tips

- The system automatically ensures WCAG compliance
- Avoid using color alone to convey information
- Test with colorblind simulators if available
- Ensure sufficient contrast is maintained

### Performance

- Theme changes apply instantly without page reload
- Colors are cached in localStorage for fast loading
- All theme calculations are optimized for performance

## Component Library

### ColorPicker
Full-featured color picker with multiple selection modes

```tsx
<ColorPicker
  value={color}
  onChange={setColor}
  onPreview={previewColor}
  showPalette={true}
/>
```

### ThemeDemo
Preview component showing all theme colors and variants

```tsx
<ThemeDemo className="my-custom-class" />
```

### Badge
Status indicators that respect theme colors

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="info">New</Badge>
```

## API Reference

### ThemeContext

```typescript
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
```

### Theme Utilities

```typescript
// Convert hex to HSL
hexToHSL(hex: string): string

// Calculate luminance
getLuminance(hex: string): number

// Calculate contrast ratio
getContrastRatio(color1: string, color2: string): number

// Get appropriate foreground color
getForegroundColor(backgroundColor: string, isDark?: boolean): string

// Generate complete theme
generateThemeColors(primaryHex: string, isDark?: boolean): ThemeColors

// Apply theme to DOM
applyThemeToDOM(primaryColor: string, isDark?: boolean): void

// Generate color palette
generateColorPalette(baseHex: string): string[]
```

## Troubleshooting

### Colors Look Washed Out
- Try increasing saturation in the custom color picker
- Choose from the "Professional" or "Modern" brand palettes

### Text is Hard to Read
- The system should prevent this automatically
- If issues persist, try a different base color
- Report the issue with your hex color for investigation

### Dark Mode Looks Wrong
- Reset theme and try again
- Clear browser cache and localStorage
- Check if custom CSS is overriding theme variables

### Theme Not Saving
- Ensure you click "Save Changes" in Organization settings
- Check browser console for errors
- Verify you have permission to modify organization settings

## Migration from Old Theme

If you were using the old theme system:

1. Your saved colors are automatically migrated
2. Visit Settings > Organization to review your theme
3. Save your settings to apply the enhanced system
4. All components will automatically use the new system

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (12+)
- Mobile browsers: Full support

## Future Enhancements

Planned features for future releases:
- Multiple theme presets per organization
- Gradient backgrounds
- Custom font pairing
- Theme import/export
- Advanced color harmony tools
- Seasonal themes

## Support

For issues or questions about the theme system:
- Check this documentation first
- Contact your system administrator
- Submit feedback through the in-app help center

---

**Version**: 2.0.0  
**Last Updated**: December 2025  
**Author**: RealLex Development Team