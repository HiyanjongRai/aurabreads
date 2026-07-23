"use client";

import { useActionState } from "react";
import { login, type AuthFormState } from "@/app/actions/auth";
import { PasswordInput } from "@/components/auth/PasswordInput";

const initialState: AuthFormState = {};

type LoginFormProps = {
  registered?: boolean;
};

export function LoginForm({ registered }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {registered ? (
        <div
          className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          Account created. You can sign in now.
        </div>
      ) : null}
      {state.error ? (
        <div
          className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}
      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-800">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.fields?.email}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={
            state.fieldErrors?.email ? "login-email-error" : undefined
          }
          className="mt-2 block h-11 w-full rounded-[8px] border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
        />
        {state.fieldErrors?.email ? (
          <p id="login-email-error" className="mt-2 text-sm text-red-600">
            {state.fieldErrors.email.join(" ")}
          </p>
        ) : null}
      </div>
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
      />
      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-full items-center justify-center rounded-[8px] bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
