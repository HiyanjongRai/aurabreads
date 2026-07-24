'use client';

import { useState, useEffect, useCallback } from 'react';
import { useActionState } from 'react';
import { login, register, type AuthFormState } from '@/app/actions/auth';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Checkbox } from '@/components/Checkbox';
import { AlertCircle, CheckCircle2, X, Sparkles } from 'lucide-react';

const loginInitial: AuthFormState = {};
const registerInitial: AuthFormState = {};

type Tab = 'login' | 'register';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: Tab;
};

function LoginFormInner({
  onSwitchToRegister,
}: {
  onSwitchToRegister: () => void;
}) {
  const [state, formAction, pending] = useActionState(login, loginInitial);

  return (
    <form action={formAction} className="auth-modal-form" noValidate>
      {state.error ? (
        <div className="auth-alert auth-alert-error" role="alert">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{state.error}</span>
        </div>
      ) : null}

      <div className="auth-field">
        <label htmlFor="modal-login-email">Email address</label>
        <input
          id="modal-login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          defaultValue={state.fields?.email}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          className="auth-input"
        />
        {state.fieldErrors?.email ? (
          <p className="auth-field-error">{state.fieldErrors.email.join(' ')}</p>
        ) : null}
      </div>

      <PasswordInput
        id="modal-login-password"
        name="password"
        label="Password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={state.fieldErrors?.password}
      />

      <div className="auth-row">
        <Checkbox id="modal-remember" name="remember" label="Remember me" className="h-4 w-4" />
        <a href="#" className="auth-link">Forgot password?</a>
      </div>

      <button type="submit" disabled={pending} className="auth-submit-btn">
        {pending ? (
          <>
            <svg className="auth-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing in...
          </>
        ) : 'Sign in'}
      </button>

      <p className="auth-switch-text">
        New to AuraBeads?{' '}
        <button type="button" onClick={onSwitchToRegister} className="auth-switch-link">
          Create an account
        </button>
      </p>
    </form>
  );
}

function RegisterFormInner({
  onSwitchToLogin,
}: {
  onSwitchToLogin: () => void;
}) {
  const [state, formAction, pending] = useActionState(register, registerInitial);

  return (
    <form action={formAction} className="auth-modal-form" noValidate>
      {state.error ? (
        <div className="auth-alert auth-alert-error" role="alert">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{state.error}</span>
        </div>
      ) : null}

      {state.success ? (
        <div className="auth-alert auth-alert-success" role="status">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          <span>Account created! You can now sign in.</span>
        </div>
      ) : null}

      <div className="auth-fields-row">
        <div className="auth-field">
          <label htmlFor="modal-reg-name">Full name</label>
          <input
            id="modal-reg-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            required
            minLength={2}
            maxLength={100}
            defaultValue={state.fields?.name}
            className="auth-input"
          />
          {state.fieldErrors?.name ? (
            <p className="auth-field-error">{state.fieldErrors.name.join(' ')}</p>
          ) : null}
        </div>

        <div className="auth-field">
          <label htmlFor="modal-reg-email">Email address</label>
          <input
            id="modal-reg-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            defaultValue={state.fields?.email}
            className="auth-input"
          />
          {state.fieldErrors?.email ? (
            <p className="auth-field-error">{state.fieldErrors.email.join(' ')}</p>
          ) : null}
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="modal-reg-address">Address</label>
        <input
          id="modal-reg-address"
          name="address"
          type="text"
          autoComplete="street-address"
          placeholder="123 Main Street, City, State ZIP"
          required
          minLength={5}
          maxLength={255}
          defaultValue={state.fields?.address}
          className="auth-input"
        />
        {state.fieldErrors?.address ? (
          <p className="auth-field-error">{state.fieldErrors.address.join(' ')}</p>
        ) : null}
      </div>

      <div className="auth-fields-row">
        <PasswordInput
          id="modal-reg-password"
          name="password"
          label="Password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={state.fieldErrors?.password}
        />
        <PasswordInput
          id="modal-reg-confirm"
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={state.fieldErrors?.confirmPassword}
        />
      </div>

      <Checkbox
        id="modal-reg-terms"
        name="terms"
        label="I agree to the Terms & Conditions"
        description="By creating an account, you agree to our privacy policy and terms of service."
        className="h-4 w-4"
        error={state.fieldErrors?.terms ? state.fieldErrors.terms.join(' ') : undefined}
      />

      <button type="submit" disabled={pending} className="auth-submit-btn">
        {pending ? (
          <>
            <svg className="auth-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating account...
          </>
        ) : 'Create account'}
      </button>

      <p className="auth-switch-text">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="auth-switch-link">
          Sign in
        </button>
      </p>
    </form>
  );
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [animateTab, setAnimateTab] = useState(false);

  // Sync default tab when modal opens
  useEffect(() => {
    if (isOpen) setTab(defaultTab);
  }, [isOpen, defaultTab]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const switchTab = useCallback((newTab: Tab) => {
    if (newTab === tab) return;
    setAnimateTab(true);
    setTimeout(() => {
      setTab(newTab);
      setAnimateTab(false);
    }, 180);
  }, [tab]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`auth-modal-backdrop ${isOpen ? 'auth-modal-backdrop--open' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={tab === 'login' ? 'Sign in' : 'Create account'}
    >
      <div className={`auth-modal-panel ${isOpen ? 'auth-modal-panel--open' : ''}`}>
        {/* Decorative glow orbs */}
        <div className="auth-modal-orb auth-modal-orb--top" aria-hidden="true" />
        <div className="auth-modal-orb auth-modal-orb--bottom" aria-hidden="true" />

        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-brand">
            <div className="auth-modal-brand-icon" aria-hidden="true">
              <Sparkles size={14} />
            </div>
            <span>AuraBeads</span>
          </div>
          <button
            onClick={onClose}
            className="auth-modal-close"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="auth-modal-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'login'}
            className={`auth-modal-tab ${tab === 'login' ? 'auth-modal-tab--active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={tab === 'register'}
            className={`auth-modal-tab ${tab === 'register' ? 'auth-modal-tab--active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Create Account
          </button>
        </div>

        {/* Scroll area */}
        <div className="auth-modal-body">
          {/* Title area */}
          <div className="auth-modal-title-area">
            <h2 className="auth-modal-title">
              {tab === 'login' ? 'Welcome back' : 'Join AuraBeads'}
            </h2>
            <p className="auth-modal-subtitle">
              {tab === 'login'
                ? 'Sign in to access your account and orders.'
                : 'Create your account and discover timeless elegance.'}
            </p>
          </div>

          {/* Form */}
          <div className={`auth-modal-form-wrap ${animateTab ? 'auth-modal-form-wrap--exit' : 'auth-modal-form-wrap--enter'}`}>
            {tab === 'login' ? (
              <LoginFormInner onSwitchToRegister={() => switchTab('register')} />
            ) : (
              <RegisterFormInner onSwitchToLogin={() => switchTab('login')} />
            )}
          </div>
        </div>

        {/* Bottom accent */}
        <div className="auth-modal-accent" aria-hidden="true">
          <span>Secure · Elegant · Luxurious</span>
        </div>
      </div>
    </div>
  );
}
