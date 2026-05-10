'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * useNavigation — mirrors the back/forward history stack from App.tsx.
 *
 * In the original Vite app, history was managed manually with:
 *   const [history, setHistory] = useState<Page[]>(['dashboard']);
 *   const [historyIndex, setHistoryIndex] = useState(0);
 *
 * In Next.js we delegate real history to the browser, and track
 * canGoBack ourselves since window.history.length is unreliable
 * for "within-app" detection.
 */
export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [stack, setStack] = useState<string[]>([pathname]);
  const [index, setIndex] = useState(0);

  // Track every pathname change that comes from <Link> or router.push()
  useEffect(() => {
    setStack((prev) => {
      // If the new path is already the current one, do nothing
      if (prev[index] === pathname) return prev;
      // Navigating forward: trim any forward history and push
      const next = [...prev.slice(0, index + 1), pathname];
      setIndex(next.length - 1);
      return next;
    });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const canGoBack = index > 0;
  const canGoForward = index < stack.length - 1;

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    setIndex((i) => i - 1);
    router.back();
  }, [canGoBack, router]);

  const goForward = useCallback(() => {
    if (!canGoForward) return;
    setIndex((i) => i + 1);
    router.forward();
  }, [canGoForward, router]);

  return { canGoBack, canGoForward, goBack, goForward, currentPath: pathname };
}
