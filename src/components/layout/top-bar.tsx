"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  ClipboardCheck,
  FileText,
  LogOut,
  Search,
  User,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSession, logout, type User as AuthUser } from "@/lib/auth";

const notifications = [
  {
    id: "assessment",
    title: "Lanjutkan asesmen perkembangan anak.",
    description: "Isi asesmen singkat agar rekomendasi makin sesuai.",
    href: "/assessment",
    Icon: ClipboardCheck,
  },
  {
    id: "files",
    title: "Worksheet baru tersedia.",
    description: "Cek halaman Files untuk materi pendamping belajar.",
    href: "/files",
    Icon: FileText,
  },
  {
    id: "results",
    title: "Lihat hasil asesmen terbaru.",
    description: "Pantau progress anak dari halaman Results.",
    href: "/results",
    Icon: Bell,
  },
];

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.trim() || "Pengguna";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getRoleLabel(role?: AuthUser["role"]) {
  if (role === "PARENT") return "Parent";
  if (role === "STUDENT") return "Student";
  return role ?? "-";
}

export function TopBar() {
  const router = useRouter();
  const [session, setSession] = useState<AuthUser | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getSession();

    if (!user) {
      router.push("/login");
      return;
    }

    setSession(user);
  }, [router]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!actionsRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const initials = getInitials(session?.name, session?.email);

  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsNotificationOpen(false);
    logout();
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "border-b border-outline-variant/30",
        "bg-white/90 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <img src="/images/skillpathkids-logo.png" alt="skillpathkids logo" />
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-black leading-none text-primary">
              SkillPath Kids
            </p>
            <p className="mt-1 text-xs font-medium text-on-surface-variant">
              Dashboard Perkembangan
            </p>
          </div>
        </Link>

        <div className="mx-auto hidden max-w-md flex-1 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="search"
              placeholder="Cari aktivitas, worksheet..."
              className="h-11 w-full rounded-pill border border-outline-variant/50 bg-surface-container-low pl-11 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div ref={actionsRef} className="relative flex items-center gap-2 md:gap-3">
          <TopIconButton
            aria-label="Buka notifikasi"
            aria-expanded={isNotificationOpen}
            onClick={() => {
              setIsNotificationOpen((value) => !value);
              setIsProfileOpen(false);
            }}
          >
            <Bell className="h-5 w-5 text-on-surface" aria-hidden="true" />
            {notifications.length > 0 && (
              <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ffd6d6] px-1 text-[10px] font-black leading-none text-[#ba1a1a]">
                {notifications.length}
              </span>
            )}
          </TopIconButton>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-pill bg-primary-fixed text-primary transition-all hover:bg-primary/20 md:h-11 md:w-11"
            aria-label="Buka menu profil"
            aria-expanded={isProfileOpen}
            onClick={() => {
              setIsProfileOpen((value) => !value);
              setIsNotificationOpen(false);
            }}
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </button>

          {isNotificationOpen && (
            <div className="absolute right-12 top-14 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[22px] border border-[#d4e3ff] bg-white shadow-[0_18px_45px_rgba(0,72,131,0.16)] md:right-14">
              <div className="border-b border-outline-variant/20 bg-[#d4e3ff] px-4 py-3">
                <p className="text-sm font-black text-[#004883]">Notifikasi</p>
                <p className="text-xs font-semibold text-[#004883]/80">
                  Pengingat ringan untuk aktivitas hari ini.
                </p>
              </div>

              {notifications.length > 0 ? (
                <div className="max-h-80 overflow-y-auto p-2">
                  {notifications.map(({ id, title, description, href, Icon }) => (
                    <Link
                      key={id}
                      href={href}
                      className="flex gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-surface-container-low"
                      onClick={() => setIsNotificationOpen(false)}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#ffe173] text-[#0f1d24]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black text-on-surface">
                          {title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-on-surface-variant">
                          {description}
                        </span>
                      </span>
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-on-surface-variant" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-bold text-on-surface">Belum ada notifikasi baru.</p>
                </div>
              )}
            </div>
          )}

          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[22px] border border-[#d4e3ff] bg-white shadow-[0_18px_45px_rgba(0,72,131,0.16)]">
              <div className="flex items-center gap-3 border-b border-outline-variant/20 bg-[#d4e3ff] px-4 py-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-[#004883]">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[#004883]">
                    {session?.name || "Pengguna"}
                  </p>
                  <p className="truncate text-xs font-semibold text-[#004883]/80">
                    {session?.email || "-"}
                  </p>
                </div>
              </div>

              <div className="p-2">
                <div className="mb-2 flex items-center justify-between rounded-2xl bg-surface-container-low px-3 py-2">
                  <span className="text-xs font-bold text-on-surface-variant">Role</span>
                  <span className="rounded-full bg-[#96f89f] px-2.5 py-1 text-[10px] font-black text-[#00531d]">
                    {getRoleLabel(session?.role)}
                  </span>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-low"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <UserCircle className="h-5 w-5 text-[#004883]" aria-hidden="true" />
                  Lihat Profil
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-[#ba1a1a] transition-colors hover:bg-[#ffd6d6]"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                  Logout
                </button>
              </div>
            </div>
          )}
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
        "relative flex h-10 w-10 items-center justify-center rounded-pill border border-outline-variant/30 bg-white transition-all hover:scale-105 hover:bg-surface-container-low md:h-11 md:w-11",
        className
      )}
      {...props}
    />
  );
}
