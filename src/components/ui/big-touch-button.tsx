import React, { ButtonHTMLAttributes, forwardRef, MouseEvent, KeyboardEvent } from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';

// Define the sound file paths 
const SOUND_ASSETS = {
  click: './assets/sounds/click.mp3',
  pop: './assets/sounds/pop.mp3',
  success: './assets/sounds/success.mp3',
};

export interface BigTouchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  sound?: 'click' | 'pop' | 'success' | false;
}

export const BigTouchButton = forwardRef<HTMLButtonElement, BigTouchButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      loading = false,
      sound = false,
      className = '',
      children,
      onClick,
      onKeyDown,
      'aria-label': ariaLabel,
      disabled,
      ...props
    },
    ref
  ) => {
    // --- Validation ---
    if (!children && !ariaLabel) {
      console.warn('BigTouchButton: `aria-label` is required when rendering an icon-only button for accessibility.');
    }

    // --- Sound Logic ---
    const playSound = () => {
      if (!sound || disabled || loading) return;
      try {
        const audio = new Audio(SOUND_ASSETS[sound]);
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Catch and ignore auto-play restrictions if the user hasn't interacted with the document yet
        });
      } catch (error) {
        console.error('Failed to play sound', error);
      }
    };

    // --- Event Handlers ---
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      playSound();
      if (onClick) onClick(e);
    };

    // Native <button> handles Enter/Space for clicks automatically, 
    // but we bind the sound to keydown to perfectly sync with the visual press-down.
    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        playSound();
      }
      if (onKeyDown) onKeyDown(e);
    };

    // --- Styling Maps ---
    const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
    
    // The "Squishy-press" logic: 4px shadow at rest, 2px shadow and 2px translation on active.
    const squishyStyles = 'shadow-[0_4px_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_rgba(0,0,0,0.15)] active:translate-y-[2px] disabled:shadow-none disabled:translate-y-0';
    const ghostSquishyStyles = 'active:scale-95 disabled:scale-100'; // Ghost/Outline usually don't have deep drop shadows

    const variants = {
      primary: `bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 ${squishyStyles}`,
      secondary: `bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 ${squishyStyles}`,
      tertiary: `bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus-visible:ring-indigo-500 ${squishyStyles}`,
      outline: `border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 ${ghostSquishyStyles}`,
      ghost: `bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 ${ghostSquishyStyles}`,
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm gap-2',
      md: 'h-11 px-6 text-base gap-2',
      lg: 'h-[56px] px-8 text-lg gap-3 rounded-2xl', // AAA touch target
    };

    const isIconOnly = !children;
    const sizeClasses = isIconOnly 
      ? sizes[size].replace(/px-\d+/, 'w-' + sizes[size].match(/h-(\[?\d+p?x?\]?)/)?.[1] || 'w-auto') // Makes it perfectly square if icon-only
      : sizes[size];

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        className={`
          ${baseStyles} 
          ${variants[variant]} 
          ${sizeClasses} 
          ${disabled || loading ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'} 
          ${className}
        `}
        aria-label={ariaLabel}
        disabled={disabled || loading}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <Loader2 
            className={`animate-spin ${size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} ${!isIconOnly ? 'absolute left-4' : ''}`} 
            aria-hidden="true" 
          />
        )}

        {/* Optional Icon */}
        {!loading && Icon && (
          <Icon 
            className={`${size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} ${loading && !isIconOnly ? 'invisible' : ''}`} 
            aria-hidden="true" 
          />
        )}

        {/* Content */}
        {children && (
          <span className={`${loading ? 'invisible' : 'visible'} flex items-center`}>
            {children}
          </span>
        )}
      </button>
    );
  }
);

BigTouchButton.displayName = 'BigTouchButton';