import React from 'react';

export default function LoadingSpinner({ message = 'Generating with AI...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{
        width: '48px', height: '48px', border: '4px solid #e2e8f0',
        borderTop: '4px solid #6366f1', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#64748b', fontSize: '14px' }}>{message}</p>
    </div>
  );
}
