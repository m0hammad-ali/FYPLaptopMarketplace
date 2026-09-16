import React from 'react';

export default function Card({ children, padding = 'md', hover = false, style = {} }) {
  const paddings = {
    sm: '12px',
    md: '20px',
    lg: '28px',
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: paddings[padding],
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        transition: hover ? 'box-shadow 0.15s, transform 0.15s' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
