import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes safely, resolving conflicts.
 * Usage: cn('px-4 py-2', isActive && 'bg-primary', className)
 *
 * Requires: npm install clsx tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Clamp a number between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Convert a 0–100 score to a SkillStatus label.
 */
export function scoreToStatus(score: number): 'Bagus' | 'Cukup' | 'Perlu Latihan' {
  if (score >= 75) return 'Bagus';
  if (score >= 50) return 'Cukup';
  return 'Perlu Latihan';
}

/**
 * Format a Date object to Indonesian locale string.
 * e.g. new Date() → "7 Mei 2026"
 */
export function formatDateID(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
