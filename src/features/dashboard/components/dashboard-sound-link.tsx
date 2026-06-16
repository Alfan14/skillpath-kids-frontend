'use client';

import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useUiSound } from '@/hooks/use-ui-sound';

interface DashboardSoundLinkProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | 'href'> {
  children: ReactNode;
  sound?: 'tap' | 'success';
}

export function DashboardSoundLink({
  children,
  onClick,
  sound = 'tap',
  ...props
}: DashboardSoundLinkProps) {
  const { playTap, playSuccess } = useUiSound();

  return (
    <Link
      {...props}
      onClick={(event) => {
        if (sound === 'success') {
          playSuccess();
        } else {
          playTap();
        }
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
