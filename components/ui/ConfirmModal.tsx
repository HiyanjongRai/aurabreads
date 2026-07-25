'use client';

import { ReactNode } from 'react';
import { AlertTriangle, Trash2, CheckCircle2, Info, X } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'info';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  // Variant Styling
  let iconBg = 'rgba(239, 68, 68, 0.12)';
  let iconColor = '#f87171';
  let btnBg = 'linear-gradient(135deg, #ef4444, #dc2626)';
  let btnColor = '#ffffff';
  let Icon = Trash2;

  if (variant === 'warning') {
    iconBg = 'rgba(245, 158, 11, 0.12)';
    iconColor = '#fbbf24';
    btnBg = 'linear-gradient(135deg, #f59e0b, #d97706)';
    btnColor = '#000000';
    Icon = AlertTriangle;
  } else if (variant === 'info') {
    iconBg = 'rgba(212, 175, 55, 0.12)';
    iconColor = '#d4af37';
    btnBg = 'linear-gradient(135deg, #d4af37, #a07c2e)';
    btnColor = '#000000';
    Icon = Info;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          background: '#161622',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 24,
          padding: '28px 26px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 16,
          animation: 'popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            width: 30,
            height: 30,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>

        {/* Icon Circle */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
          }}
        >
          <Icon size={26} color={iconColor} />
        </div>

        {/* Title & Description */}
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
            {title}
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)', marginTop: 8, lineHeight: 1.5 }}>
            {description}
          </p>
        </div>

        {/* Buttons Row */}
        <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 12,
              border: 'none',
              background: btnBg,
              color: btnColor,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Processing…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
