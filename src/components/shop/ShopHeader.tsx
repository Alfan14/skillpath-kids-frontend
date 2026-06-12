'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FileText, Grid3X3, Home, Search } from 'lucide-react';

import { cn } from '@/lib/utils';

export function ShopHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const currentSearch = searchParams.get('search');
    setSearchValue(currentSearch || '');
  }, [searchParams]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

    if (searchValue.trim()) {
      currentParams.set('search', searchValue.trim());
    } else {
      currentParams.delete('search');
    }

    currentParams.delete('page');

    if (pathname !== '/worksheets') {
      router.push(`/worksheets?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push(`/worksheets?${currentParams.toString()}`);
    }
  };

  const navItems = [
    { label: 'Beranda', icon: Home, href: '/' },
    { label: 'Kategori', icon: Grid3X3, href: '/worksheets' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50',
        'border-b border-outline-variant/30',
        'bg-white/90 backdrop-blur-xl'
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffe173] text-[#0f1d24] shadow-[0_5px_0_#e8c900] md:h-12 md:w-12">
            <FileText className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-black leading-none text-[#004883]">
              SkillPath Kids
            </p>
            <p className="mt-1 text-xs font-medium text-on-surface-variant">
              Worksheets Store
            </p>
          </div>
        </Link>

        <div className="mx-auto hidden max-w-xl flex-1 md:block">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Cari worksheet atau materi..."
              className="h-11 w-full rounded-pill border border-outline-variant/50 bg-surface-container-low pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden h-14 w-14 flex-col items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-[#d4e3ff]/60 hover:text-[#004883] md:flex"
              title={item.label}
            >
              <item.icon className="mb-1 h-5 w-5" />
              <span className="text-[9px] font-bold uppercase">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-outline-variant/30 bg-surface-container-lowest p-3 md:hidden">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Cari worksheet atau materi..."
            className="h-11 w-full rounded-pill border border-outline-variant/50 bg-surface-container-low pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </form>
      </div>
    </header>
  );
}
