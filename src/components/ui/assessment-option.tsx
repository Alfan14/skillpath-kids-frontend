import React, { KeyboardEvent, useRef } from 'react';

export type LikertValue = 'SS' | 'S' | 'TS' | 'STS';


export interface AssessmentOptionProps {
  value: LikertValue;
  selected: boolean;
  onSelect: (val: LikertValue) => void;
  variant?: 'default' | 'teacher';
  'aria-label': string;
  tabIndex?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  'data-value'?: LikertValue;
  // A forwardRef would be ideal here if the parent needs direct DOM access,
  // but we can also use a callback ref or let the parent query the DOM.
}

export const AssessmentOption = React.forwardRef<HTMLButtonElement, AssessmentOptionProps>(
  ({ value, selected, onSelect, 'aria-label': ariaLabel, tabIndex = -1, onKeyDown, 'data-value': dataValue }, ref) => {
    
    // Map values to display labels (you can adjust these or pass them as children)
    const displayLabels: Record<LikertValue, string> = {
      SS: 'SS',
      S: 'S',
      TS: 'TS',
      STS: 'STS',
    };

    // Use similar squishy-press mechanics from your BigTouchButton
    const baseStyles = 'relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl font-bold text-lg transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2';
    
    const answerStyles: Record<LikertValue, { unselected: string; selected: string }> = {
      SS: {
        unselected: 'border-2 border-[#96f89f] bg-[#96f89f] text-[#00531d] shadow-[0_4px_0_rgba(0,83,29,0.18)] hover:bg-[#83ee8e]',
        selected: 'border-2 border-[#00531d] bg-[#96f89f] text-[#00531d] shadow-[0_4px_0_rgba(0,83,29,0.22)] ring-4 ring-[#96f89f]/35',
      },
      S: {
        unselected: 'border-2 border-[#d4e3ff] bg-[#d4e3ff] text-[#004883] shadow-[0_4px_0_rgba(0,72,131,0.16)] hover:bg-[#c4d9ff]',
        selected: 'border-2 border-[#004883] bg-[#d4e3ff] text-[#004883] shadow-[0_4px_0_rgba(0,72,131,0.22)] ring-4 ring-[#d4e3ff]/60',
      },
      TS: {
        unselected: 'border-2 border-[#ffe173] bg-[#ffe173] text-[#0f1d24] shadow-[0_4px_0_rgba(15,29,36,0.14)] hover:bg-[#ffd84d]',
        selected: 'border-2 border-[#0f1d24] bg-[#ffe173] text-[#0f1d24] shadow-[0_4px_0_rgba(15,29,36,0.2)] ring-4 ring-[#ffe173]/45',
      },
      STS: {
        unselected: 'border-2 border-error/30 bg-error-container text-on-error-container shadow-[0_4px_0_rgba(147,0,10,0.14)] hover:bg-error-container/90',
        selected: 'border-2 border-error bg-error-container text-on-error-container shadow-[0_4px_0_rgba(147,0,10,0.2)] ring-4 ring-error/20',
      },
    };

    const optionStyles = selected ? answerStyles[value].selected : answerStyles[value].unselected;

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={ariaLabel}
        tabIndex={tabIndex} // -1 for unselected, 0 for selected (roving tabindex)
        data-value={dataValue}
        onClick={() => onSelect(value)}
        onKeyDown={onKeyDown}
        className={`${baseStyles} ${optionStyles}`}
      >
        {displayLabels[value]}
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
    { value: 'SS', label: 'Sangat Setuju, nilai 4' },
    { value: 'S', label: 'Setuju, nilai 3' },
    { value: 'TS', label: 'Tidak Setuju, nilai 2' },
    { value: 'STS', label: 'Sangat Tidak Setuju, nilai 1' },
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
      {/* The hidden ID links the question text to the radiogroup for screen readers.
      */}
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
          const isFocusable = isSelected || (selectedValue === null && opt.value === 'SS');

          return (
            <AssessmentOption
              key={opt.value}
              value={opt.value}
              selected={isSelected}
              onSelect={onChange}
              variant={variant}
              aria-label={opt.label}
              tabIndex={isFocusable ? 0 : -1}
              data-value={opt.value} // Used for the querySelector focus shift
            />
          );
        })}
      </div>
    </div>
  );
};
