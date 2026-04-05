import React from 'react';

const TONES = ['Professional', 'Witty', 'Warm', 'Bold', 'Minimalist', 'Playful', 'Authoritative'];

export default function ToneSelector({ selected, onChange }) {
  const toggle = (tone) => {
    if (selected.includes(tone)) {
      onChange(selected.filter((t) => t !== tone));
    } else if (selected.length < 3) {
      onChange([...selected, tone]);
    }
  };

  return (
    <div>
      <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '8px' }}>
        Brand Tone <span style={{ color: '#94a3b8' }}>(pick exactly 3)</span>
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {TONES.map((tone) => {
          const active = selected.includes(tone);
          return (
            <button
              key={tone}
              type="button"
              onClick={() => toggle(tone)}
              style={{
                padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500',
                border: active ? '2px solid #6366f1' : '1.5px solid #e2e8f0',
                background: active ? '#eef2ff' : 'white',
                color: active ? '#6366f1' : '#64748b',
                cursor: selected.length >= 3 && !active ? 'not-allowed' : 'pointer',
                opacity: selected.length >= 3 && !active ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
            >
              {tone}
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
        {selected.length}/3 selected
      </p>
    </div>
  );
}
