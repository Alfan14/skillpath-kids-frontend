'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion'; 
import type { Badge } from '@/types';

import { getIcon } from '@/lib/icon-map';
import { CheckCircle2, Lock } from 'lucide-react';

export interface BadgeCardProps {
  badge: Badge;
  animateOnMount?: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ 
  badge, 
  animateOnMount = true 
}) => {
  const Icon = getIcon(badge.icon);
  
  const cardAriaLabel = `${badge.title} — ${badge.unlocked && badge.date ? badge.date : 'Belum terkunci'}`;

  // Explicitly typed as Variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' } 
    }
  };

  // Explicitly typed as Variants
  const floatingIconVariants: Variants = {
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }
    }
  };

  return (
    <motion.div
      role="article"
      aria-label={cardAriaLabel}
      aria-disabled={!badge.unlocked}
      initial={animateOnMount ? 'hidden' : 'visible'}
      animate="visible"
      variants={cardVariants}
      className={`
        relative flex flex-col items-center p-6 rounded-2xl border-2 text-center transition-all
        ${badge.unlocked 
          ? 'bg-white border-blue-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' 
          : 'bg-gray-50 border-gray-200 grayscale-[0.8] opacity-75'
        }
      `}
    >
      {/* Overlay Status Icon */}
      <div className="absolute top-3 right-3">
        {badge.unlocked ? (
          <CheckCircle2 
            className="w-6 h-6 text-green-500 bg-white rounded-full" 
            aria-label="Telah diraih"
            role="img"
          />
        ) : (
          <Lock 
            className="w-5 h-5 text-gray-400" 
            aria-label="Terkunci"
            role="img"
          />
        )}
      </div>

      {/* Floating Badge Icon */}
      <motion.div 
        variants={badge.unlocked ? floatingIconVariants : undefined}
        animate={badge.unlocked ? "animate" : undefined}
        className={`
          flex items-center justify-center w-20 h-20 mb-4 rounded-full
          ${badge.unlocked ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}
        `}
      >
        <Icon className="w-10 h-10" aria-hidden="true" />
      </motion.div>

      {/* Text Content */}
      <h3 className={`text-lg font-bold mb-1 ${badge.unlocked ? 'text-gray-900' : 'text-gray-600'}`}>
        {badge.title}
      </h3>
      
      <p className="text-sm text-gray-500 mb-3">
        {badge.description}
      </p>

      {/* Date pill */}
      {badge.unlocked && badge.date && (
        <span className="mt-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {badge.date}
        </span>
      )}
    </motion.div>
  );
};