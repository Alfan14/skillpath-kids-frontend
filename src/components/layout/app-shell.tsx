import type { ReactNode } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { BottomBar } from "@/components/layout/bottom-bar";
import { SideBar } from "@/components/layout/side-bar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopBar />
      <div className="flex">
        <SideBar />
        <main
          className={cn(
            "flex-1 w-full mx-auto max-w-5xl",
            "px-4 md:px-8",
            "pt-24 pb-28 md:pb-12 md:pl-72", // md:pl-72 accounts for sidebar width (w-64 = 16rem) + margin (8)
            className,
          )}
        >
          {children}
        </main>
      </div>
      <BottomBar />
    </div>
  );
}
