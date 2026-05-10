import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'secondary' | 'tertiary';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'secondary' | 'tertiary';
}

export function Badge({
  variant = 'neutral',
  color,
  className,
  children,
  ...props
}: BadgeProps) {
  const activeVariant = color || variant;
  
  const variants = {
    primary: 'bg-primary-fixed text-primary',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary-container text-on-tertiary-container',
    success: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    warning: 'bg-secondary-container text-on-secondary-container',
    danger: 'bg-error-container text-on-error-container',
    neutral: 'bg-surface-container-high text-on-surface-variant',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center',
        'rounded-full px-3 py-1',
        'text-[11px] font-bold',
        variants[activeVariant as keyof typeof variants] || variants.neutral,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export const BadgePill = Badge;