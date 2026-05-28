'use client';

import Link from "next/link";
import { Search, Home, Grid3X3, ClipboardList, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useWorksheetCart } from "@/features/worksheets/hooks/useWorksheetCart";
import { useState, useEffect } from "react";

export function ShopHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { cartCount, isLoaded } = useWorksheetCart();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const currentSearch = searchParams.get('search');
    if (currentSearch) {
      setSearchValue(currentSearch);
    } else {
      setSearchValue("");
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
    { label: "Beranda", icon: Home, href: "/" },
    { label: "Kategori", icon: Grid3X3, href: "/worksheets" },
    { label: "Pesanan", icon: ClipboardList, href: "#" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "border-b border-outline-variant/30",
        "bg-white/90 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
            🚀
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-black leading-none text-primary">
              SkillPath Kids
            </p>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Worksheets Store
            </p>
          </div>
        </Link>
        
        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto hidden md:block">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Cari worksheet atau buku..."
              className="h-11 w-full rounded-pill border border-outline-variant/50 bg-surface-container-low pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 md:gap-3">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="hidden md:flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors"
              title={item.label}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-[9px] font-bold uppercase">{item.label}</span>
            </Link>
          ))}
          
          <div className="w-[1px] h-8 bg-outline-variant/30 hidden md:block mx-1"></div>

          <Link
            href="#"
            className="relative flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors"
            title="Keranjang"
          >
            <ShoppingCart className="h-5 w-5 mb-1" />
            <span className="text-[9px] font-bold uppercase hidden md:block">Keranjang</span>
            {isLoaded && cartCount > 0 && (
              <span className="absolute top-1 right-2 md:right-3 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          
          <Link
            href="/profile"
            className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-pill bg-primary-fixed text-primary hover:bg-primary/20 transition-all ml-1 md:ml-2"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>

      </div>
      
      {/* Mobile Search */}
      <div className="p-3 border-t border-outline-variant/30 md:hidden bg-surface-container-lowest">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Cari worksheet atau buku..."
            className="h-11 w-full rounded-pill border border-outline-variant/50 bg-surface-container-low pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </form>
      </div>
    </header>
  );
}
