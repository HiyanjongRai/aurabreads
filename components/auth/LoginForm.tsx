'use client';

import { useActionState } from 'react';
import { login, type AuthFormState } from '@/app/actions/auth';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Checkbox } from '@/components/Checkbox';
import { Divider } from '@/components/Divider';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const initialState: AuthFormState = {};

type LoginFormProps = {
  registered?: boolean;
};

export function LoginForm({ registered }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {/* Success Message */}
      {registered ? (
        <div
          className="flex gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 animate-fade-in"
          role="status"
        >
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>Account created successfully. You can sign in now.</span>
        </div>
      ) : null}

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
            state.fieldErrors?.email ? 'login-email-error' : undefined
          }
          className="block h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-sm text-gray-900 shadow-luxury-sm outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
        />
        {state.fieldErrors?.email ? (
          <p id="login-email-error" className="text-sm font-medium text-red-600">
            {state.fieldErrors.email.join(' ')}
          </p>
        ) : null}
      </div>

      {/* Password Field */}
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={state.fieldErrors?.password}
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Checkbox
          id="remember"
          name="remember"
          label="Remember me"
          className="h-5 w-5"
        />
        <a
          href="#"
          className="text-sm font-medium text-gold-600 transition duration-200 hover:text-gold-700 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      {/* Sign In Button */}
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
          {pending ? 'Signing in...' : 'Sign in'}
        </span>
        <div className="absolute inset-0 translate-y-full bg-gold-600 transition duration-300 group-hover:translate-y-0 -z-10" />
      </button>

      {/* Divider */}
      <Divider text="or" />

      {/* Social/Alternative Login - Placeholder */}
      <button
        type="button"
        disabled
        className="h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition duration-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue with Email Link
      </button>
    </form>
  );
}
