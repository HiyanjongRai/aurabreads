'use client';

import { useActionState, useState } from 'react';
import { createSellerAction, CreateSellerState } from '@/app/actions/admin';
import {
  User, Store, Mail, Lock, MapPin, Eye, EyeOff,
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, KeyRound,
} from 'lucide-react';

const initialState: CreateSellerState = {};

export function CreateSellerForm() {
  const [state, formAction, isPending] = useActionState(createSellerAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let res = '';
    for (let i = 0; i < 14; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordValue(res);
    setShowPassword(true);
  };

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Form Error Banner */}
      {state?.error && (
        <div style={{
          padding: '14px 18px',
          borderRadius: 14,
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#f87171',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{state.error}</span>
        </div>
      )}

      {/* Main Form Card */}
      <div style={{
        background: '#161622',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Store size={18} color="#d4af37" />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Store & Owner Information
          </h2>
        </div>

        {/* Grid 2 Column */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

          {/* Owner Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
              Owner Full Name <span style={{ color: '#f87171' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '11px 14px' }}>
              <User size={16} color="rgba(255,255,255,0.4)" />
              <input
                name="name"
                defaultValue={state?.fields?.name ?? ''}
                placeholder="e.g. Anjali Sharma"
                required
                style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: 14, width: '100%' }}
              />
            </div>
            {state?.fieldErrors?.name && (
              <p style={{ fontSize: 11, color: '#f87171', marginTop: 4, margin: '4px 0 0 0' }}>{state.fieldErrors.name[0]}</p>
            )}
          </div>

          {/* Business / Store Name */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
              Business / Store Name <span style={{ color: '#f87171' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '11px 14px' }}>
              <Store size={16} color="rgba(255,255,255,0.4)" />
              <input
                name="storeName"
                defaultValue={state?.fields?.storeName ?? ''}
                placeholder="e.g. Luxora Jewels & Craft"
                required
                style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: 14, width: '100%' }}
              />
            </div>
            {state?.fieldErrors?.storeName && (
              <p style={{ fontSize: 11, color: '#f87171', marginTop: 4, margin: '4px 0 0 0' }}>{state.fieldErrors.storeName[0]}</p>
            )}
          </div>

        </div>

        {/* Email Address */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
            Email Address (Login ID) <span style={{ color: '#f87171' }}>*</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '11px 14px' }}>
            <Mail size={16} color="rgba(255,255,255,0.4)" />
            <input
              type="email"
              name="email"
              defaultValue={state?.fields?.email ?? ''}
              placeholder="e.g. seller@luxora.com"
              required
              style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: 14, width: '100%' }}
            />
          </div>
          {state?.fieldErrors?.email && (
            <p style={{ fontSize: 11, color: '#f87171', marginTop: 4, margin: '4px 0 0 0' }}>{state.fieldErrors.email[0]}</p>
          )}
        </div>

        {/* Password + Generator */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
              Password <span style={{ color: '#f87171' }}>*</span>
            </label>
            <button
              type="button"
              onClick={generatePassword}
              style={{
                background: 'none',
                border: 'none',
                color: '#d4af37',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <KeyRound size={12} /> Auto-generate
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '11px 14px' }}>
            <Lock size={16} color="rgba(255,255,255,0.4)" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={passwordValue || (state?.fields?.password ?? '')}
              onChange={(e) => setPasswordValue(e.target.value)}
              placeholder="At least 8 characters"
              required
              style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: 14, width: '100%' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {state?.fieldErrors?.password && (
            <p style={{ fontSize: 11, color: '#f87171', marginTop: 4, margin: '4px 0 0 0' }}>{state.fieldErrors.password[0]}</p>
          )}
        </div>

        {/* Business Address */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
            Business Address / Location <span style={{ color: '#f87171' }}>*</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '11px 14px' }}>
            <MapPin size={16} color="rgba(255,255,255,0.4)" />
            <input
              name="address"
              defaultValue={state?.fields?.address ?? ''}
              placeholder="e.g. New Road, Kathmandu, Nepal"
              required
              style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: 14, width: '100%' }}
            />
          </div>
          {state?.fieldErrors?.address && (
            <p style={{ fontSize: 11, color: '#f87171', marginTop: 4, margin: '4px 0 0 0' }}>{state.fieldErrors.address[0]}</p>
          )}
        </div>

        {/* Auto Confirm Checkbox */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          borderRadius: 14,
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.2)',
        }}>
          <input
            type="checkbox"
            name="autoConfirm"
            id="autoConfirm"
            defaultChecked
            style={{ width: 16, height: 16, accentColor: '#d4af37', cursor: 'pointer' }}
          />
          <label htmlFor="autoConfirm" style={{ fontSize: 13, color: '#ffffff', cursor: 'pointer', fontWeight: 500 }}>
            Auto-confirm email address (Seller can log in immediately without email verification)
          </label>
        </div>

      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
        <button
          type="reset"
          disabled={isPending}
          style={{
            padding: '12px 24px',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reset Form
        </button>

        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '12px 28px',
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
            color: '#000000',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Creating Seller Account...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Create Seller Account</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
