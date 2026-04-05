import React from 'react';
import { NavLink } from 'react-router-dom';

const nav = [
  { path: '/brand', label: 'Brand Setup', icon: '🏷️' },
  { path: '/content', label: 'Content Hub', icon: '✍️' },
  { path: '/repurpose', label: 'Repurpose', icon: '♻️' },
  { path: '/ads', label: 'Ad Copy & A/B', icon: '📢' },
  { path: '/sentiment', label: 'Sentiment', icon: '📊' },
  { path: '/calendar', label: 'Calendar', icon: '📅' },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: '240px', position: 'fixed', top: 0, left: 0, height: '100vh',
      background: 'white', borderRight: '1px solid #e2e8f0',
      display: 'flex', flexDirection: 'column', zIndex: 100,
    }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#6366f1' }}>⚡ MarketAI</div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Marketing Intelligence Engine</div>
      </div>
      <nav style={{ padding: '12px 12px', flex: 1 }}>
        {nav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
              textDecoration: 'none', fontSize: '14px', fontWeight: '500',
              background: isActive ? '#eef2ff' : 'transparent',
              color: isActive ? '#6366f1' : '#475569',
              transition: 'all 0.15s',
            })}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#94a3b8' }}>
        Powered by Claude AI
      </div>
    </aside>
  );
}
