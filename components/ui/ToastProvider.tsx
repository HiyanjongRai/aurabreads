'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastMessage = {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
};

type ToastContextType = {
  showToast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message?: string, type: ToastType = 'success', duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, title, message, type, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => showToast(title, message, 'success'), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast(title, message, 'error'), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast(title, message, 'warning'), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast(title, message, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 380,
          width: 'calc(100vw - 48px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => {
          let bg = 'linear-gradient(135deg, #161622 0%, #1a1a2e 100%)';
          let border = '1px solid rgba(16, 185, 129, 0.4)';
          let iconBg = 'rgba(16, 185, 129, 0.15)';
          let iconColor = '#34d399';
          let Icon = CheckCircle2;

          if (t.type === 'error') {
            border = '1px solid rgba(239, 68, 68, 0.4)';
            iconBg = 'rgba(239, 68, 68, 0.15)';
            iconColor = '#f87171';
            Icon = AlertCircle;
          } else if (t.type === 'warning') {
            border = '1px solid rgba(245, 158, 11, 0.4)';
            iconBg = 'rgba(245, 158, 11, 0.15)';
            iconColor = '#fbbf24';
            Icon = AlertTriangle;
          } else if (t.type === 'info') {
            border = '1px solid rgba(212, 175, 55, 0.4)';
            iconBg = 'rgba(212, 175, 55, 0.15)';
            iconColor = '#d4af37';
            Icon = Info;
          }

          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                background: bg,
                border,
                borderRadius: 16,
                padding: '14px 16px',
                color: '#ffffff',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                position: 'relative',
                overflow: 'hidden',
                animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={iconColor} />
              </div>

              {/* Message Content */}
              <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
                  {t.title}
                </p>
                {t.message && (
                  <p style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginTop: 4, margin: '4px 0 0', lineHeight: 1.4 }}>
                    {t.message}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  padding: 2,
                  borderRadius: 4,
                  display: 'flex',
                }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
