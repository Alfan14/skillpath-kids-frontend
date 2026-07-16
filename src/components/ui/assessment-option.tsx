import React, { KeyboardEvent, useRef } from 'react';
import Image from 'next/image';
import { AlertTriangle, Clock3, CheckCircle2, Star } from 'lucide-react';

export type LikertValue = 'BB' | 'MB' | 'BSH' | 'BSB';

const OPTION_IMAGE_PATHS: Record<LikertValue, string> = {
  BB: '/images/BB-Icon-Belum-Berkembang.png',
  MB: '/images/MB-Icon-Mulai-Berkembang.png',
  BSH: '/images/BSH-Icon-Berkembang-Sesuai-Harapan.png',
  BSB: '/images/BSB-Icon-Berkembang-Sangat-Baik.png',
};

export interface AssessmentOptionProps {
  value: LikertValue;
  selected: boolean;
  onSelect: (val: LikertValue) => void;
  variant?: 'default' | 'teacher';
  'aria-label': string;
  tabIndex?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  'data-value'?: LikertValue;
}

export const AssessmentOption = React.forwardRef<HTMLButtonElement, AssessmentOptionProps>(
  ({ value, selected, onSelect, 'aria-label': ariaLabel, tabIndex = -1, onKeyDown, 'data-value': dataValue }, ref) => {
    const imagePath = OPTION_IMAGE_PATHS[value];
    
    // Map values to display labels
    const displayLabels: Record<LikertValue, string> = {
      BB: 'BB',
      MB: 'MB',
      BSH: 'BSH',
      BSB: 'BSB',
    };

    const baseStyles = 'press-soft relative flex flex-col items-center justify-center gap-1 w-[72px] h-[72px] md:w-20 md:h-20 rounded-2xl font-bold text-xs transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2';
    
    const answerStyles: Record<LikertValue, { unselected: string; selected: string }> = {
      BB: {
        unselected: 'border-2 border-[#ffd6d6] bg-[#ffd6d6] text-[#ba1a1a] shadow-[0_4px_0_rgba(186,26,26,0.18)] hover:bg-[#ffc4c4]',
        selected: 'border-2 border-[#ba1a1a] bg-[#ffd6d6] text-[#ba1a1a] shadow-[0_4px_0_rgba(186,26,26,0.22)] ring-4 ring-[#ffd6d6]/45',
      },
      MB: {
        unselected: 'border-2 border-[#ffe173] bg-[#ffe173] text-[#0f1d24] shadow-[0_4px_0_rgba(15,29,36,0.14)] hover:bg-[#ffd84d]',
        selected: 'border-2 border-[#0f1d24] bg-[#ffe173] text-[#0f1d24] shadow-[0_4px_0_rgba(15,29,36,0.2)] ring-4 ring-[#ffe173]/45',
      },
      BSH: {
        unselected: 'border-2 border-[#96f89f] bg-[#96f89f] text-[#00531d] shadow-[0_4px_0_rgba(0,83,29,0.18)] hover:bg-[#83ee8e]',
        selected: 'border-2 border-[#00531d] bg-[#96f89f] text-[#00531d] shadow-[0_4px_0_rgba(0,83,29,0.22)] ring-4 ring-[#96f89f]/35',
      },
      BSB: {
        unselected: 'border-2 border-[#d4e3ff] bg-[#d4e3ff] text-[#004883] shadow-[0_4px_0_rgba(0,72,131,0.16)] hover:bg-[#c4d9ff]',
        selected: 'border-2 border-[#004883] bg-[#d4e3ff] text-[#004883] shadow-[0_4px_0_rgba(0,72,131,0.22)] ring-4 ring-[#d4e3ff]/60',
      },
    };

    const optionStyles = selected
      ? `${answerStyles[value].selected} scale-[1.01]`
      : answerStyles[value].unselected;

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        data-value={dataValue}
        onClick={() => onSelect(value)}
        onKeyDown={onKeyDown}
        className={`${baseStyles} ${optionStyles}`}
      >
        <Image src={imagePath} alt={value} width={28} height={28} className="drop-shadow-sm" priority />
        <span className="text-[11px] font-black leading-none">{displayLabels[value]}</span>
      </button>
    );
  }
);

AssessmentOption.displayName = 'AssessmentOption';

// --- Assessment Group (Parent Coordinator) ---

interface AssessmentGroupProps {
  questionId: string;
  questionText: string;
  selectedValue: LikertValue | null;
  onChange: (val: LikertValue) => void;
  variant?: 'default' | 'teacher';
}

export const AssessmentGroup: React.FC<AssessmentGroupProps> = ({
  questionId,
  questionText,
  selectedValue,
  onChange,
  variant = 'default',
}) => {
  const options: { value: LikertValue; label: string }[] = [
    { value: 'BB', label: 'Belum Berkembang, nilai 1' },
    { value: 'MB', label: 'Mulai Berkembang, nilai 2' },
    { value: 'BSH', label: 'Berkembang Sesuai Harapan, nilai 3' },
    { value: 'BSB', label: 'Berkembang Sangat Baik, nilai 4' },
  ];

  const groupRef = useRef<HTMLDivElement>(null);

  // Handle W3C standard arrow key navigation for radiogroups
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      return;
    }

    e.preventDefault();

    const currentIndex = options.findIndex((opt) => opt.value === selectedValue);
    let nextIndex = 0;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = currentIndex === options.length - 1 ? 0 : currentIndex + 1;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
    }

    const nextValue = options[nextIndex].value;
    onChange(nextValue);

    // Shift focus to the newly selected radio button
    const nextButton = groupRef.current?.querySelector(
      `button[data-value="${nextValue}"]`
    ) as HTMLButtonElement;
    
    if (nextButton) {
      nextButton.focus();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* The hidden ID links the question text to the radiogroup for screen readers. */}
      <h3 id={`question-${questionId}`} className="text-xl font-semibold text-gray-900">
        {questionText}
      </h3>

      <div
        ref={groupRef}
        role="radiogroup"
        aria-labelledby={`question-${questionId}`}
        className="flex gap-3"
        onKeyDown={handleKeyDown}
      >
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          
          // Roving tabIndex logic: 
          // If nothing is selected, the first item is focusable (0).
          // Otherwise, ONLY the selected item is focusable (0), others are (-1).
          const isFocusable = isSelected || (selectedValue === null && opt.value === 'BB');

          return (
            <AssessmentOption
              key={opt.value}
              value={opt.value}
              selected={isSelected}
              onSelect={onChange}
              variant={variant}
              aria-label={opt.label}
              tabIndex={isFocusable ? 0 : -1}
              data-value={opt.value}
            />
          );
        })}
      </div>
    </div>
  );
};
