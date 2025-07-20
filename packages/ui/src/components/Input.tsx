import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'default',
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset placeholder:text-neutral-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6';
  
  const variantClasses = {
    default: 'ring-neutral-300 focus:ring-primary-600',
    filled: 'bg-neutral-50 ring-neutral-200 focus:ring-primary-600',
  };
  
  const errorClasses = error
    ? 'ring-red-300 focus:ring-red-500'
    : variantClasses[variant];
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium leading-6 text-neutral-900 mb-2"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={clsx(
          baseClasses,
          errorClasses,
          className
        )}
        {...props}
      />
      
      {(error || helperText) && (
        <div className="mt-2">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-neutral-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};
