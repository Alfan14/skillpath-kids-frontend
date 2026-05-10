'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '@/data/nav';
import { cn } from '@/lib/utils';
import { getIcon } from '@/lib/icon-map';

/**
 * BottomNav — mobile-only tab bar shown on dashboard pages.
 * Hidden on md+ screens where the top bar is sufficient.
 *
 * Uses Next.js usePathname() to highlight the active tab —
 * replaces the currentPage === id comparison from App.tsx.
 */
export function BottomBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden
                 bg-white/95 backdrop-blur-md
                 border-t-2 border-surface-container
                 safe-area-inset-bottom"
    >
      <ul className="flex items-center justify-around h-16 px-2" role="list">
        {navItems.map((item) => {
          const Icon = getIcon(item.icon);
          const isActive = pathname === item.href;

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5',
                  'w-14 h-12 rounded-xl transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-primary focus-visible:ring-offset-1',
                  isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-6 rounded-full transition-all',
                    isActive && 'bg-primary-fixed'
                  )}
                >
                  <Icon
                    className={cn('w-5 h-5', isActive && 'stroke-[2.5]')}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wide leading-none',
                    isActive ? 'text-primary' : 'text-on-surface-variant'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
