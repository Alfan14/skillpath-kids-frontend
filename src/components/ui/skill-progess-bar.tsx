import React from 'react';
import { motion } from 'framer-motion';

export type SkillStatus = 'Bagus' | 'Cukup' | 'Perlu Latihan';

export interface SkillProgressBarProps {
  value: number;
  label: string;
  status: SkillStatus;
  animated?: boolean;
}

export const SkillProgressBar: React.FC<SkillProgressBarProps> = ({
  value,
  label,
  status,
  animated = true,
}) => {
  // Ensure the value strictly stays between 0 and 100 for a11y and visual safety
  const clampedValue = Math.min(100, Math.max(0, value));

  // Visual mapping for the progress bar and status badge
  const statusConfig: Record<SkillStatus, { bar: string; text: string; bg: string }> = {
    'Bagus': { bar: 'bg-green-500', text: 'text-green-800', bg: 'bg-green-100' },
    'Cukup': { bar: 'bg-yellow-400', text: 'text-yellow-900', bg: 'bg-yellow-100' },
    'Perlu Latihan': { bar: 'bg-red-500', text: 'text-red-800', bg: 'bg-red-100' },
  };

  const currentStyle = statusConfig[status];

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Header: Label and Status Badge */}
      <div className="flex justify-between items-end">
        <span className="font-semibold text-gray-800 text-sm md:text-base">
          {label}
        </span>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${currentStyle.bg} ${currentStyle.text}`}
          aria-hidden="true" // Hidden from screen readers since the status is implied by the value or can be added to aria-label
        >
          {status}
        </span>
      </div>

      {/* Progress Bar Track */}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} - ${status}`} // Combines label and status for maximum context
        className="w-full h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden"
      >
        {/* Progress Bar Fill */}
        <motion.div
          className={`h-full rounded-full ${currentStyle.bar}`}
          // If animated is false, we start at the clampedValue immediately.
          initial={animated ? { width: 0 } : { width: `${clampedValue}%` }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ 
            duration: animated ? 0.8 : 0, 
            ease: "easeOut",
            // Add a slight delay so it fires smoothly after the page/modal fully mounts
            delay: animated ? 0.1 : 0 
          }}
        />
      </div>
    </div>
  );
};