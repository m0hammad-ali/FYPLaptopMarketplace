import React from 'react';

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  className = '',
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    transition: 'all 0.15s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const sizes = {
    sm: { padding: '8px 14px', fontSize: '13px' },
    md: { padding: '10px 20px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '16px' },
  };

  const variants = {
    primary: { background: '#4f46e5', color: '#fff' },
    secondary: { background: '#f3f4f6', color: '#111827' },
    outline: { background: 'transparent', color: '#4f46e5', border: '2px solid #4f46e5' },
    success: { background: '#10b981', color: '#fff' },
    danger: { background: '#ef4444', color: '#fff' },
    whatsapp: { background: '#25D366', color: '#fff' },
    ghost: { background: 'transparent', color: '#6b7280' },
  };

  const style = { ...base, ...sizes[size], ...variants[variant] };

  return (
    <button
      type={type}
      style={style}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
