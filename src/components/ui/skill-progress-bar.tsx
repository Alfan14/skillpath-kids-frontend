import React from 'react';
import { progressStatusMap } from '@/features/dashboard/data/dashboard.constants';

interface SkillProgressBarProps {
  value: number;
  status: keyof typeof progressStatusMap;
  label: string;
}

export function SkillProgressBar({ value, status, label }: SkillProgressBarProps) {
  const statusConfig = progressStatusMap[status];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-on-surface">{label}</span>
        <span className="font-bold" style={{ color: `var(--color-${statusConfig.color})` }}>
          {value}%
        </span>
      </div>
      
      <div className="w-full h-3 bg-surface-container-high rounded-pill overflow-hidden">
        <div 
          className="h-full rounded-pill transition-all duration-500 ease-out"
          style={{ 
            width: `${value}%`,
            backgroundColor: `var(--color-${statusConfig.color})`
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-sm" aria-hidden="true">{statusConfig.icon}</span>
        <span className="text-xs font-medium text-on-surface-variant">
          {statusConfig.label}
        </span>
      </div>
    </div>
  );
}
