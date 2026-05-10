'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '@/data/nav';
import { cn } from '@/lib/utils';

export function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-outline-variant/30 bg-surface-container-lowest h-screen fixed left-0 top-0 pt-24 pb-6 px-4 z-40">
      <nav aria-label="Desktop navigation" className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-card transition-all',
                isActive
                  ? 'bg-primary-fixed text-primary font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-semibold'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn('w-5 h-5', isActive && 'stroke-[2.5]')}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="bg-surface-container-low p-4 rounded-card border border-outline-variant/30">
          <p className="text-xs font-bold text-on-surface mb-1">Butuh Bantuan?</p>
          <p className="text-[10px] text-on-surface-variant mb-3 leading-relaxed">
            Hubungi tim support atau baca panduan orang tua.
          </p>
          <button className="text-xs font-bold text-primary hover:underline">
            Pusat Bantuan
          </button>
        </div>
      </div>
    </aside>
  );
}
