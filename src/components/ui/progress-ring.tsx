'use client';

import { cn } from '@/lib/utils';

export interface ProgressRingProps {
  /** 0–100 */
  value: number;
  /** Outer diameter in px. Default 128 */
  size?: number;
  /** Stroke width. Default 12 */
  strokeWidth?: number;
  /** Tailwind text color class for the center label. Default "text-secondary" */
  valueColor?: string;
  /** Optional label below the percentage */
  sublabel?: string;
  className?: string;
}

/**
 * Circular progress ring used on the Results screen "Kategori Keseluruhan" card.
 * Pure SVG — no canvas, no external library.
 */
export function ProgressRing({
  value,
  size = 128,
  strokeWidth = 12,
  valueColor = 'text-secondary',
  sublabel,
  className,
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          className="text-surface-container-high"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          className="text-secondary-container transition-all duration-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-black text-2xl leading-none', valueColor)}>
          {clamped}%
        </span>
        {sublabel && (
          <span className="text-xs text-on-surface-variant font-bold mt-1">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
