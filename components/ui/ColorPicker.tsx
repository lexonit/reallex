import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Check, Palette, RefreshCw } from 'lucide-react';
import { Button } from '../Button';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onPreview?: (color: string) => void;
  className?: string;
  showPalette?: boolean;
  label?: string;
}

// Predefined color palette with professional colors
const COLOR_PALETTE = [
  '#7c3aed', // Purple
  '#2563eb', // Blue
  '#16a34a', // Green
  '#dc2626', // Red
  '#f59e0b', // Orange/Yellow
  '#0891b2', // Cyan
  '#c026d3', // Magenta
  '#65a30d', // Lime
  '#ea580c', // Orange
  '#be185d', // Pink
  '#374151', // Gray
  '#000000', // Black
];

// Brand-inspired color sets
const BRAND_PALETTES = {
  'Professional': ['#2563eb', '#1d4ed8', '#3b82f6', '#60a5fa'],
  'Creative': ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'],
  'Nature': ['#16a34a', '#22c55e', '#4ade80', '#86efac'],
  'Warm': ['#ea580c', '#f97316', '#fb923c', '#fed7aa'],
  'Modern': ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9'],
  'Classic': ['#374151', '#4b5563', '#6b7280', '#9ca3af'],
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  onPreview,
  className,
  showPalette = true,
  label = "Color"
}) => {
  const [activeTab, setActiveTab] = useState<'palette' | 'brands' | 'custom'>('palette');
  const [customColor, setCustomColor] = useState(value);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
  };

  const handleColorPreview = (color: string) => {
    if (onPreview) {
      onPreview(color);
    }
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onChange(color);
    if (onPreview) {
      onPreview(color);
    }
  };

  if (!showPalette) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-lg border-2 border-border shadow-sm"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={handleCustomColorChange}
            className="sr-only"
            id="color-input"
          />
          <label 
            htmlFor="color-input"
            className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Click to change
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {label && <label className="text-sm font-medium block">{label}</label>}
      
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-lg overflow-x-auto">
        <Button
          variant={activeTab === 'palette' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('palette')}
          className="flex-1 min-w-fit"
        >
          <Palette className="h-3 w-3 sm:mr-1" />
          <span className="hidden xs:inline">Palette</span>
        </Button>
        <Button
          variant={activeTab === 'brands' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('brands')}
          className="flex-1 min-w-fit"
        >
          <span className="hidden xs:inline">Brands</span>
          <span className="inline xs:hidden">Brand</span>
        </Button>
        <Button
          variant={activeTab === 'custom' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('custom')}
          className="flex-1 min-w-fit"
        >
          Custom
        </Button>
      </div>

      {/* Current Color Display */}
      <div className="flex items-center gap-2 sm:gap-3 p-3 bg-muted/30 rounded-lg">
        <div 
          className="h-8 w-8 flex-shrink-0 rounded-md border-2 border-border shadow-sm"
          style={{ backgroundColor: value }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Current Color</div>
          <div className="text-xs text-muted-foreground font-mono truncate">{value.toUpperCase()}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleColorSelect('#7c3aed')}
          className="flex-shrink-0"
        >
          <RefreshCw className="h-3 w-3 sm:mr-1" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      </div>

      {/* Color Palette Tab */}
      {activeTab === 'palette' && (
        <div className="grid grid-cols-4 xs:grid-cols-6 gap-2">
          {COLOR_PALETTE.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorSelect(color)}
              onMouseEnter={() => handleColorPreview(color)}
              className={cn(
                "h-10 w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 hover:shadow-md",
                value === color 
                  ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" 
                  : "border-border hover:border-primary"
              )}
              style={{ backgroundColor: color }}
              title={color}
            >
              {value === color && (
                <Check className="h-4 w-4 text-white drop-shadow-md mx-auto" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Brand Palettes Tab */}
      {activeTab === 'brands' && (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {Object.entries(BRAND_PALETTES).map(([brandName, colors]) => (
            <div key={brandName} className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {brandName}
              </h4>
              <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                {colors.map((color, index) => (
                  <button
                    key={`${brandName}-${index}`}
                    onClick={() => handleColorSelect(color)}
                    onMouseEnter={() => handleColorPreview(color)}
                    className={cn(
                      "h-10 xs:h-8 rounded-md border-2 transition-all hover:scale-105 hover:shadow-sm",
                      value === color 
                        ? "border-primary ring-1 ring-primary ring-offset-1" 
                        : "border-border hover:border-primary"
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {value === color && (
                      <Check className="h-3 w-3 text-white drop-shadow-md mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Color Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Color Picker</label>
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="h-12 xs:h-10 w-full xs:w-20 rounded border-2 border-border bg-background cursor-pointer"
              />
              <div className="flex-1 space-y-1 min-w-0">
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    if (color.match(/^#[0-9a-fA-F]{6}$/)) {
                      setCustomColor(color);
                      onChange(color);
                      if (onPreview) onPreview(color);
                    } else {
                      setCustomColor(color);
                    }
                  }}
                  placeholder="#7c3aed"
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">Enter hex color code</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};