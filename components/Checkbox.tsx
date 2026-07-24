'use client';

import { Check } from 'lucide-react';
import { forwardRef, InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', ...props }, ref) => {
    const id = props.id || props.name;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
            <input
              ref={ref}
              type="checkbox"
              id={id}
              className={`peer h-5 w-5 appearance-none cursor-pointer rounded-md border-2 border-gray-300 bg-white transition-all duration-200 hover:border-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 checked:border-gold-600 checked:bg-gold-600 ${className}`}
              {...props}
            />
            <Check
              size={16}
              className="pointer-events-none absolute text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
              strokeWidth={3}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            {label && (
              <label
                htmlFor={id}
                className="cursor-pointer text-sm font-medium text-gray-800 hover:text-gray-900"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
