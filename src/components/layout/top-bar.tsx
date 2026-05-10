"use client";
import Link from "next/link";
import { Bell, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar() {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
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
              Dashboard Perkembangan
            </p>
          </div>
        </Link>
        
        {/* Search (Desktop Only) */}
        <div className="hidden flex-1 md:flex max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="search"
              placeholder="Cari aktivitas, worksheet..."
              className="h-11 w-full rounded-pill border border-outline-variant/50 bg-surface-container-low pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <TopIconButton className="hidden md:flex">
            <Bell className="h-5 w-5 text-on-surface" />
          </TopIconButton>
          
          <Link
            href="/profile"
            className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-pill bg-primary-fixed text-primary hover:bg-primary/20 transition-all"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>

      </div>
    </header>
  );
}

function TopIconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "h-11 w-11 items-center justify-center rounded-pill border border-outline-variant/30 bg-white transition-all hover:scale-105 hover:bg-surface-container-low",
        className
      )}
      {...props}
    />
  );
}
