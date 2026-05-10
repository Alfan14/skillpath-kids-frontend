'use client';

import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  /** Height class, e.g. "h-6". Defaults to "h-4" */
  heightClass?: string;
  /** Tailwind bg class for the fill. Defaults to "bg-secondary-container" */
  fillClass?: string;
  /** Show an animated shimmer while value is 0 */
  indeterminate?: boolean;
  className?: string;
  /** aria-label for screen readers */
  label?: string;
}

/**
 * Generic progress bar.
 * For the skill-specific bar with status badge, use SkillProgressBar instead.
 *
 * CSS transition handles the animation — no framer-motion needed here,
 * keeping this component safe for Server Components if needed.
 */
export function ProgressBar({
  value,
  heightClass = 'h-4',
  fillClass = 'bg-secondary-container',
  indeterminate = false,
  className,
  label,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        'w-full rounded-full overflow-hidden bg-surface-container',
        'border border-surface-container-highest shadow-inner',
        heightClass,
        className
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500 ease-out',
          indeterminate
            ? 'animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent w-full'
            : fillClass
        )}
        style={indeterminate ? undefined : { width: `${clamped}%` }}
      />
    </div>
  );
}
