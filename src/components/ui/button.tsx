'use client';
import { forwardRef } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
  icon?: LucideIcon | any;
}

const variants = {
  primary: 'bg-primary text-white shadow-[0_5px_0_0_#004883] hover:translate-y-[2px]',
  secondary: 'bg-secondary-container text-on-secondary-container shadow-[0_5px_0_0_#e8c426] hover:translate-y-[2px]',
  outline: 'border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low',
  ghost: 'bg-transparent text-primary hover:bg-primary/10',
  danger: 'bg-error text-white',
};

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      asChild,
      icon: Icon,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'button';
    
    return (
      <Component
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
        <Slottable>{children}</Slottable>
      </Component>
    );
  },
);

Button.displayName = 'Button';