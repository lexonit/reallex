import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  onClose: () => void;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', title, onClose, position = 'bottom-right' }) => {
  const posClass = {
    'top-right': 'top-6 right-6',
    'bottom-right': 'bottom-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-left': 'bottom-6 left-6',
  }[position];

  const palette = {
    success: {
      container: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      dot: 'bg-green-500',
    },
    error: {
      container: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      dot: 'bg-red-500',
    },
    info: {
      container: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400',
      icon: <AlertCircle className="h-5 w-5 text-blue-600" />,
      dot: 'bg-blue-500',
    },
    warning: {
      container: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400',
      icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
      dot: 'bg-amber-500',
    },
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={cn(
        `fixed ${posClass} z-50 w-[320px] max-w-[90vw] flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border`,
        palette.container,
        "bg-background backdrop-blur-md"
      )}
    >
      <div className="mt-0.5">{palette.icon}</div>
      <div className="flex-1 min-w-0">
        {title && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">{title}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${palette.dot}`}></span>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-3">{message}</p>
      </div>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};