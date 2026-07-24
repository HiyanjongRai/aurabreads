'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  error?: string[];
  placeholder?: string;
  defaultValue?: string;
};

export function PasswordInput({
  id,
  name,
  label,
  autoComplete,
  error,
  placeholder,
  defaultValue,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-gray-800">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="text-xs font-medium text-gold-600 transition duration-200 hover:text-gold-700 focus:outline-none"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required
          minLength={autoComplete === 'new-password' ? 8 : undefined}
          maxLength={100}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="block h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 shadow-luxury-sm outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          tabIndex={-1}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors cursor-pointer z-10"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
      {error ? (
        <p id={errorId} className="text-sm font-medium text-red-600">
          {error.join(' ')}
        </p>
      ) : null}
    </div>
  );
}
