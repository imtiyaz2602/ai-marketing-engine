import React, { useState } from 'react';
import { regeneratePiece } from '../../services/api';

export default function ContentCard({ title, content, platform, brandId, onSaveToCalendar }) {
  const [text, setText] = useState(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  const [refinement, setRefinement] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!brandId) return;
    setLoading(true);
    try {
      const res = await regeneratePiece({
        brand_id: brandId,
        piece_type: title,
        original_content: text,
        refinement,
      });
      setText(res.data.content);
      setRefinement('');
    } catch (e) {
      alert('Regeneration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
      padding: '20px', marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{title}</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onSaveToCalendar && (
            <button onClick={() => onSaveToCalendar(text, platform)}
              style={{ fontSize: '12px', padding: '5px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', background: 'white', color: '#64748b' }}>
              + Calendar
            </button>
          )}
          <button onClick={handleCopy}
            style={{ fontSize: '12px', padding: '5px 12px', background: copied ? '#dcfce7' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: copied ? '#16a34a' : '#64748b' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', fontFamily: 'Inter, sans-serif', resize: 'vertical', outline: 'none', color: '#334155' }}
      />

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <input
          type="text"
          placeholder='Refine: "Make shorter", "More aggressive", "Add emoji"'
          value={refinement}
          onChange={(e) => setRefinement(e.target.value)}
          style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' }}
          onKeyDown={(e) => e.key === 'Enter' && handleRegenerate()}
        />
        <button onClick={handleRegenerate} disabled={loading}
          style={{ padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '13px', opacity: loading ? 0.7 : 1 }}>
          {loading ? '...' : '↻ Regenerate'}
        </button>
      </div>
    </div>
  );
}
