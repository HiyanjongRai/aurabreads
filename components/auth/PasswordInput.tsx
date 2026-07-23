"use client";

import { useState } from "react";

type PasswordInputProps = {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  error?: string[];
};

export function PasswordInput({
  id,
  name,
  label,
  autoComplete,
  error,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-800">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="rounded-[6px] px-2 py-1 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50 hover:text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required
        minLength={autoComplete === "new-password" ? 8 : undefined}
        maxLength={100}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 block h-11 w-full rounded-[8px] border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-red-600">
          {error.join(" ")}
        </p>
      ) : null}
    </div>
  );
}
