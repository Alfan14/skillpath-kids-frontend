import type { NavItem } from '@/types';

/**
 * Bottom-nav and quick-action items.
 * `href` maps directly to Next.js App Router routes.
 * Icons are strings resolved via getIcon() in components.
 */
export const navItems: NavItem[] = [
  { id: 'dashboard',    label: 'Home',     icon: 'home',           href: '/' },
  { id: 'assessment',   label: 'Assess',   icon: 'clipboardCheck', href: '/assessment' },
  { id: 'results',      label: 'Results',  icon: 'lineChart',      href: '/results' },
  { id: 'tips',         label: 'Tips',     icon: 'lightbulb',      href: '/tips' },
  { id: 'files',        label: 'Files',    icon: 'fileText',       href: '/files' },
  { id: 'achievements', label: 'Badges',   icon: 'medal',          href: '/achievements' },
];

/** Quick-action tiles shown on the dashboard (subset of navItems, with colors) */
export const quickActions = [
  { id: 'assessment',   label: 'Assess',  icon: 'clipboardCheck', color: 'bg-primary-fixed text-primary',                  href: '/assessment' },
  { id: 'results',      label: 'Results', icon: 'lineChart',       color: 'bg-secondary-fixed text-on-secondary-fixed',     href: '/results' },
  { id: 'tips',         label: 'Tips',    icon: 'lightbulb',       color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', href: '/tips' },
  { id: 'files',        label: 'Files',   icon: 'fileText',        color: 'bg-surface-container-high text-primary',          href: '/files' },
  { id: 'achievements', label: 'Badges',  icon: 'medal',           color: 'bg-secondary-container text-secondary',           href: '/achievements' },
] as const;
