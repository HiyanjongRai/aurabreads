'use client';

import { useActionState } from 'react';
import { register, type AuthFormState } from '@/app/actions/auth';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Checkbox } from '@/components/Checkbox';
import { Divider } from '@/components/Divider';
import { AlertCircle } from 'lucide-react';

const initialState: AuthFormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {/* Error Message */}
      {state.error ? (
        <div
          className="flex gap-3 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in"
          role="alert"
        >
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{state.error}</span>
        </div>
      ) : null}

      {/* Full Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-800">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Smith"
          required
          minLength={2}
          maxLength={100}
          defaultValue={state.fields?.name}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={
            state.fieldErrors?.name ? 'name-error' : undefined
          }
          className="block h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-luxury-sm outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
        />
        {state.fieldErrors?.name ? (
          <p id="name-error" className="text-sm font-medium text-red-600">
            {state.fieldErrors.name.join(' ')}
          </p>
        ) : null}
      </div>

      {/* Address Field */}
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium text-gray-800">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          placeholder="123 Main Street, City, State ZIP"
          required
          minLength={5}
          maxLength={255}
          defaultValue={state.fields?.address}
          aria-invalid={Boolean(state.fieldErrors?.address)}
          aria-describedby={
            state.fieldErrors?.address ? 'address-error' : undefined
          }
          className="block h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-luxury-sm outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
        />
        {state.fieldErrors?.address ? (
          <p id="address-error" className="text-sm font-medium text-red-600">
            {state.fieldErrors.address.join(' ')}
          </p>
        ) : null}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-800">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          defaultValue={state.fields?.email}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={
            state.fieldErrors?.email ? 'register-email-error' : undefined
          }
          className="block h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-luxury-sm outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
        />
        {state.fieldErrors?.email ? (
          <p id="register-email-error" className="text-sm font-medium text-red-600">
            {state.fieldErrors.email.join(' ')}
          </p>
        ) : null}
      </div>

      {/* Password Field */}
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={state.fieldErrors?.password}
      />

      {/* Confirm Password Field */}
      <PasswordInput
        id="confirm-password"
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={state.fieldErrors?.confirmPassword}
      />

      {/* Terms & Conditions */}
      <Checkbox
        id="terms"
        name="terms"
        label="I agree to the Terms & Conditions"
        description="By creating an account, you agree to our privacy policy and terms of service."
        className="h-5 w-5"
        error={state.fieldErrors?.terms ? state.fieldErrors.terms.join(' ') : undefined}
      />

      {/* Create Account Button */}
      <button
        type="submit"
        disabled={pending}
        className="group relative h-12 w-full overflow-hidden rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-luxury transition duration-300 hover:shadow-luxury-lg hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-luxury disabled:hover:bg-gray-900"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {pending && (
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {pending ? 'Creating account...' : 'Create account'}
        </span>
        <div className="absolute inset-0 translate-y-full bg-gold-600 transition duration-300 group-hover:translate-y-0 -z-10" />
      </button>

      {/* Divider */}
      <Divider text="or" />

      {/* Alternative Signup - Placeholder */}
      <button
        type="button"
        disabled
        className="h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition duration-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sign up with Email Link
      </button>
    </form>
  );
}
