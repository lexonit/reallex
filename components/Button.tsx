import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-lg border-0",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow border-0",
    ghost: "hover:bg-accent hover:text-accent-foreground border-0 shadow-none",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow",
    destructive: "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 hover:shadow-lg border-0",
    success: "bg-green-600 text-white shadow hover:bg-green-700 hover:shadow-lg border-0",
    warning: "bg-orange-600 text-white shadow hover:bg-orange-700 hover:shadow-lg border-0",
  };

  const sizes = {
    xs: "h-7 px-2 text-xs",
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-11 px-6 text-base",
    xl: "h-12 px-8 text-base",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};