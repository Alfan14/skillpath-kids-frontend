import {
  Home,
  ClipboardCheck,
  LineChart,
  Lightbulb,
  FileText,
  Medal,
} from 'lucide-react';
import type { NavItem } from '@/types';

/**
 * Bottom-nav and quick-action items.
 * `href` maps directly to Next.js App Router routes.
 */
export const navItems: NavItem[] = [
  { id: 'dashboard',    label: 'Home',     icon: Home,          href: '/' },
  { id: 'assessment',   label: 'Assess',   icon: ClipboardCheck, href: '/assessment' },
  { id: 'results',      label: 'Results',  icon: LineChart,      href: '/results' },
  { id: 'tips',         label: 'Tips',     icon: Lightbulb,      href: '/tips' },
  { id: 'files',        label: 'Files',    icon: FileText,       href: '/files' },
  { id: 'achievements', label: 'Badges',   icon: Medal,          href: '/achievements' },
];

/** Quick-action tiles shown on the dashboard (subset of navItems, with colors) */
export const quickActions = [
  { id: 'assessment',   label: 'Assess',  icon: ClipboardCheck, color: 'bg-primary-fixed text-primary',                  href: '/assessment' },
  { id: 'results',      label: 'Results', icon: LineChart,       color: 'bg-secondary-fixed text-on-secondary-fixed',     href: '/results' },
  { id: 'tips',         label: 'Tips',    icon: Lightbulb,       color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', href: '/tips' },
  { id: 'files',        label: 'Files',   icon: FileText,        color: 'bg-surface-container-high text-primary',          href: '/files' },
  { id: 'achievements', label: 'Badges',  icon: Medal,           color: 'bg-secondary-container text-secondary',           href: '/achievements' },
] as const;
