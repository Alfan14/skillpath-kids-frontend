'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { CheckCircle2, Lock, Medal } from 'lucide-react';
import type { Badge } from '@/types';
import { getIcon, iconMap } from '@/lib/icon-map';

export interface BadgeCardProps {
  badge: Badge;
  animateOnMount?: boolean;
}

function getBadgeIcon(iconName: string | null | undefined) {
  if (!iconName || !iconMap[iconName]) return Medal;
  return getIcon(iconName);
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  animateOnMount = true,
}) => {
  const Icon = getBadgeIcon(badge.icon);
  const StatusIcon = badge.unlocked ? CheckCircle2 : Lock;
  const cardAriaLabel = `${badge.title} - ${badge.unlocked ? 'Terbuka' : 'Terkunci'}`;

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.28, ease: 'easeOut' },
    },
  };

  return (
    <motion.article
      aria-label={cardAriaLabel}
      aria-disabled={!badge.unlocked}
      initial={animateOnMount ? 'hidden' : 'visible'}
      animate="visible"
      variants={cardVariants}
      className={`
        group hover-lift-soft relative flex min-h-64 flex-col items-center rounded-2xl border-2 bg-white p-5 text-center
        shadow-[0_12px_32px_rgba(0,72,131,0.08)] transition-all duration-200 motion-reduce:transition-none
        ${badge.unlocked ? 'border-[#96f89f]' : 'border-[#d4e3ff]'}
      `}
    >
      <span
        className={`
          absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold
          ${badge.unlocked ? 'bg-[#96f89f] text-[#00531d]' : 'bg-[#d4e3ff] text-[#004883]'}
        `}
      >
        <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
        {badge.unlocked ? 'Terbuka' : 'Terkunci'}
      </span>

      <motion.div
        className={`
          mb-4 mt-7 flex h-20 w-20 items-center justify-center rounded-[24px]
          transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none
          ${badge.unlocked ? 'bg-[#ffe173] text-[#0f1d24] shadow-[0_7px_0_#e8c900]' : 'bg-[#d4e3ff] text-[#004883]'}
        `}
      >
        <Icon className="h-10 w-10" aria-hidden="true" />
      </motion.div>

      <h3 className="mb-2 text-base font-black text-on-surface">
        {badge.title}
      </h3>

      <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
        {badge.description}
      </p>

      {badge.unlocked && badge.date ? (
        <span className="mt-auto inline-flex items-center rounded-full bg-[#f3e8ff] px-3 py-1 text-xs font-extrabold text-[#6b21a8]">
          {badge.date}
        </span>
      ) : (
        <span className="mt-auto inline-flex items-center rounded-full bg-[#ffe173] px-3 py-1 text-xs font-extrabold text-[#0f1d24]">
          Selesaikan aktivitas
        </span>
      )}
    </motion.article>
  );
};
