import React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, className }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-muted", className)}>
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src} alt={name} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium text-sm">
          {initials}
        </div>
      )}
    </div>
  );
};