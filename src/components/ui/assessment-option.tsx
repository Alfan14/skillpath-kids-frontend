import React, { KeyboardEvent, useRef } from 'react';

export type LikertValue = 'SS' | 'S' | 'TS' | 'STS';


export interface AssessmentOptionProps {
  value: LikertValue;
  selected: boolean;
  onSelect: (val: LikertValue) => void;
  'aria-label': string;
  tabIndex?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  // A forwardRef would be ideal here if the parent needs direct DOM access,
  // but we can also use a callback ref or let the parent query the DOM.
}

export const AssessmentOption = React.forwardRef<HTMLButtonElement, AssessmentOptionProps>(
  ({ value, selected, onSelect, 'aria-label': ariaLabel, tabIndex = -1, onKeyDown }, ref) => {
    
    // Map values to display labels (you can adjust these or pass them as children)
    const displayLabels: Record<LikertValue, string> = {
      SS: 'SS',
      S: 'S',
      TS: 'TS',
      STS: 'STS',
    };

    // Use similar squishy-press mechanics from your BigTouchButton
    const baseStyles = 'relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl font-bold text-lg transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2';
    
    const unselectedStyles = 'bg-white border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 shadow-[0_4px_0_rgba(0,0,0,0.05)] active:shadow-[0_2px_0_rgba(0,0,0,0.05)] active:translate-y-[2px]';
    
    const selectedStyles = 'bg-blue-600 border-2 border-blue-600 text-white shadow-[0_4px_0_rgba(37,99,235,0.3)] active:shadow-[0_2px_0_rgba(37,99,235,0.3)] active:translate-y-[2px]';

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={ariaLabel}
        tabIndex={tabIndex} // -1 for unselected, 0 for selected (roving tabindex)
        onClick={() => onSelect(value)}
        onKeyDown={onKeyDown}
        className={`${baseStyles} ${selected ? selectedStyles : unselectedStyles}`}
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
}

export const AssessmentGroup: React.FC<AssessmentGroupProps> = ({
  questionId,
  questionText,
  selectedValue,
  onChange,
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