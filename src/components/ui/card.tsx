import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ─── Base Card ────────────────────────────────────────────────────────────────

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Removes default padding — useful when the child handles its own spacing */
  noPadding?: boolean;
}

/**
 * Basic white card with the app's signature soft blue shadow.
 * Matches the Card component from the original App.tsx.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, noPadding = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-2xl border border-surface-container-highest',
        'shadow-[0_10px_30px_rgba(0,96,172,0.06)] transition-all',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

// ─── KidCard ──────────────────────────────────────────────────────────────────

export type KidCardAccent = 'primary' | 'secondary' | 'tertiary';
export type KidCardVariant = 'default' | 'featured' | 'download';

export interface KidCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: KidCardVariant;
  accent?: KidCardAccent;
  /** Floating badge label, e.g. "PALING DISARANKAN" */
  badge?: string;
  noPadding?: boolean;
}

/**
 * Card with the signature chunky 8px bottom border and optional floating badge.
 * Used on Dashboard, Tips, Files, and Results screens.
 */
export const KidCard = forwardRef<HTMLDivElement, KidCardProps>(
  (
    {
      variant = 'default',
      accent = 'primary',
      badge,
      className,
      children,
      noPadding = false,
      ...props
    },
    ref
  ) => {
    const accents: Record<KidCardAccent, string> = {
      primary:   'border-b-primary',
      secondary: 'border-b-secondary-container',
      tertiary:  'border-b-tertiary',
    };

    const variants: Record<KidCardVariant, string> = {
      default:  'bg-white border-x border-t border-surface-container-highest shadow-sm',
      featured: 'bg-white border-x-2 border-t-2 border-primary/10 shadow-md',
      download: 'bg-surface-container-low border-x border-t border-dashed border-outline-variant',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl border-b-8 transition-all duration-200',
          accents[accent],
          variants[variant],
          !noPadding && 'p-5 md:p-6',
          className
        )}
        {...props}
      >
        {badge && (
          <span className="absolute -top-3 right-5 z-10 inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wide bg-secondary-container text-on-secondary-container shadow-sm border border-secondary-fixed-dim">
            {badge}
          </span>
        )}
        <div className="flex flex-col w-full h-full">{children}</div>
      </div>
    );
  }
);
KidCard.displayName = 'KidCard';
