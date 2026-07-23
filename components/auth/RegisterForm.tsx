"use client";

import { useActionState } from "react";
import { register, type AuthFormState } from "@/app/actions/auth";
import { PasswordInput } from "@/components/auth/PasswordInput";

const initialState: AuthFormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.error ? (
        <div
          className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}
      <div>
        <label htmlFor="name" className="text-sm font-medium text-slate-800">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          defaultValue={state.fields?.name}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          className="mt-2 block h-11 w-full rounded-[8px] border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
        />
        {state.fieldErrors?.name ? (
          <p id="name-error" className="mt-2 text-sm text-red-600">
            {state.fieldErrors.name.join(" ")}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="address" className="text-sm font-medium text-slate-800">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          required
          minLength={5}
          maxLength={255}
          defaultValue={state.fields?.address}
          aria-invalid={Boolean(state.fieldErrors?.address)}
          aria-describedby={
            state.fieldErrors?.address ? "address-error" : undefined
          }
          className="mt-2 block h-11 w-full rounded-[8px] border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
        />
        {state.fieldErrors?.address ? (
          <p id="address-error" className="mt-2 text-sm text-red-600">
            {state.fieldErrors.address.join(" ")}
          </p>
        ) : null}
      </div>
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
            state.fieldErrors?.email ? "register-email-error" : undefined
          }
          className="mt-2 block h-11 w-full rounded-[8px] border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
        />
        {state.fieldErrors?.email ? (
          <p id="register-email-error" className="mt-2 text-sm text-red-600">
            {state.fieldErrors.email.join(" ")}
          </p>
        ) : null}
      </div>
      <PasswordInput
        id="password"
        name="password"
        label="Password"
        autoComplete="new-password"
        error={state.fieldErrors?.password}
      />
      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-full items-center justify-center rounded-[8px] bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
