import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: { bg: '#dcfce7', border: '#86efac', color: '#16a34a' },
    error: { bg: '#fee2e2', border: '#fca5a5', color: '#dc2626' },
    info: { bg: '#dbeafe', border: '#93c5fd', color: '#2563eb' },
  };
  const c = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
      padding: '12px 20px', borderRadius: '10px', fontSize: '14px',
      fontWeight: '500', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      animation: 'slideIn 0.2s ease',
    }}>
      <style>{`@keyframes slideIn { from { transform: translateY(20px); opacity:0; } to { transform: translateY(0); opacity:1; } }`}</style>
      {message}
    </div>
  );
}
