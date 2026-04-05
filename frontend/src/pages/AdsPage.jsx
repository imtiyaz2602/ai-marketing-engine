import React, { useState } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Toast from '../components/shared/Toast';
import { generateAds, updateAdStatus } from '../services/api';
import { useBrand } from '../context/BrandContext';
import Papa from 'papaparse';

const PLATFORMS = ['LinkedIn', 'Instagram', 'Google Ads', 'Twitter', 'Facebook'];
const GOALS = ['Awareness', 'Lead Gen', 'Sales', 'Retargeting'];
const STATUS_COLORS = { Testing: '#dbeafe', Winner: '#dcfce7', Rejected: '#fee2e2' };
const STATUS_TEXT = { Testing: '#2563eb', Winner: '#16a34a', Rejected: '#dc2626' };
const TONE_COLORS = { Emotional: '#fdf4ff', Logical: '#eff6ff', Urgency: '#fff7ed', 'Social Proof': '#f0fdf4', Curiosity: '#fefce8' };

export default function AdsPage() {
  const { brandId } = useBrand();
  const [form, setForm] = useState({ product: '', audience: '', platform: 'LinkedIn', goal: 'Lead Gen' });
  const [result, setResult] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', fontFamily: 'Inter,sans-serif', outline: 'none' };

  const handleGenerate = async () => {
    if (!brandId) { setToast({ msg: 'Set up your brand first!', type: 'error' }); return; }
    setLoading(true); setResult(null);
    try {
      const res = await generateAds({ ...form, brand_id: brandId });
      setResult(res.data);
      setStatuses(res.data.variants.map(() => 'Testing'));
      setSavedIds(res.data.saved_ids || []);
    } catch { setToast({ msg: 'Generation failed', type: 'error' }); }
    finally { setLoading(false); }
  };

  const handleStatus = async (index, status) => {
    const newStatuses = [...statuses];
    newStatuses[index] = status;
    setStatuses(newStatuses);
    if (savedIds[index]) {
      await updateAdStatus(savedIds[index], status);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const rows = result.variants.map((v, i) => ({
      Headline: v.headline,
      Description: v.description,
      Tone: v.tone_label,
      Platform: form.platform,
      Status: statuses[i],
      Recommended: i === result.recommended_index ? 'Yes' : 'No',
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'ad_variants.csv'; a.click();
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">📢 AI Ad Copy & A/B Testing</h1>
      <p className="page-subtitle">Generate 5 ad variants per platform and pick your winner.</p>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>Product / Service</label>
            <input style={inp} value={form.product} onChange={e => set('product', e.target.value)} placeholder="e.g. AI Analytics Dashboard" />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>Target Audience</label>
            <input style={inp} value={form.audience} onChange={e => set('audience', e.target.value)} placeholder="e.g. B2B marketing managers" />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>Platform</label>
            <select style={inp} value={form.platform} onChange={e => set('platform', e.target.value)}>
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>Goal</label>
            <select style={inp} value={form.goal} onChange={e => set('goal', e.target.value)}>
              {GOALS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading || !brandId} className="btn-primary" style={{ marginTop: '16px', width: '100%', padding: '12px' }}>
          {loading ? 'Generating...' : '🎯 Generate 5 Ad Variants'}
        </button>
      </div>

      {loading && <LoadingSpinner message="Generating ad copy variants..." />}

      {result && (
        <div>
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a' }}>⭐ AI Recommendation: Variant {result.recommended_index + 1}</p>
            <p style={{ fontSize: '13px', color: '#166534', marginTop: '4px' }}>{result.recommendation_reason}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {result.variants?.map((v, i) => (
              <div key={i} style={{ background: TONE_COLORS[v.tone_label] || 'white', border: `2px solid ${i === result.recommended_index ? '#6366f1' : '#e2e8f0'}`, borderRadius: '12px', padding: '16px', position: 'relative' }}>
                {i === result.recommended_index && (
                  <div style={{ position: 'absolute', top: '-10px', right: '12px', background: '#6366f1', color: 'white', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '10px' }}>AI Pick ⭐</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Variant {i + 1}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: STATUS_COLORS[statuses[i]], color: STATUS_TEXT[statuses[i]], fontWeight: '600' }}>{statuses[i]}</span>
                </div>
                <div style={{ fontSize: '11px', background: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '8px', display: 'inline-block', marginBottom: '10px' }}>{v.tone_label}</div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>{v.headline}</p>
                <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px', lineHeight: '1.5' }}>{v.description}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['Testing', 'Winner', 'Rejected'].map(s => (
                    <button key={s} onClick={() => handleStatus(i, s)}
                      style={{ flex: 1, padding: '6px 4px', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', background: statuses[i] === s ? STATUS_COLORS[s] : '#f1f5f9', color: statuses[i] === s ? STATUS_TEXT[s] : '#64748b' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleExport} className="btn-secondary">📥 Export as CSV</button>
        </div>
      )}
    </div>
  );
}
