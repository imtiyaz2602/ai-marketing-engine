import React, { useState } from 'react';
import ToneSelector from '../components/BrandSetup/ToneSelector';
import { saveBrand, validateBrand } from '../services/api';
import { useBrand } from '../context/BrandContext';
import Toast from '../components/shared/Toast';

const PLATFORMS = ['LinkedIn', 'Instagram', 'Twitter', 'Email', 'Google Ads'];
const GOALS = ['Awareness', 'Lead Gen', 'Retention', 'Product Launch'];

const field = (label, children) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>{label}</label>
    {children}
  </div>
);

const inp = { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', fontFamily: 'Inter,sans-serif', outline: 'none' };

export default function BrandPage() {
  const { saveBrand: saveCtx } = useBrand();
  const [form, setForm] = useState({
    name: '', industry: '', target_audience: '', tone: [],
    keywords_include: '', keywords_avoid: '',
    campaign_name: '', campaign_goal: 'Awareness',
    duration: '4 weeks', platforms: [],
  });
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [toast, setToast] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const togglePlatform = (p) => {
    set('platforms', form.platforms.includes(p)
      ? form.platforms.filter((x) => x !== p)
      : [...form.platforms, p]);
  };

  const handleValidate = async () => {
    try {
      const payload = {
        ...form,
        keywords_include: form.keywords_include.split(',').map(s => s.trim()).filter(Boolean),
        keywords_avoid: form.keywords_avoid.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await validateBrand(payload);
      setWarnings(res.data.warnings);
    } catch { setWarnings(['Validation failed. Check your inputs.']); }
  };

  const handleSubmit = async () => {
    if (form.tone.length !== 3) { setToast({ msg: 'Please select exactly 3 tones', type: 'error' }); return; }
    if (!form.name || !form.industry || !form.target_audience) { setToast({ msg: 'Fill in all required fields', type: 'error' }); return; }
    if (form.platforms.length === 0) { setToast({ msg: 'Select at least one platform', type: 'error' }); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        keywords_include: form.keywords_include.split(',').map(s => s.trim()).filter(Boolean),
        keywords_avoid: form.keywords_avoid.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await saveBrand(payload);
      saveCtx(res.data.id, res.data);
      setToast({ msg: `✅ Brand "${form.name}" saved! ID: ${res.data.id}`, type: 'success' });
    } catch { setToast({ msg: 'Failed to save brand', type: 'error' }); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '720px' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">🏷️ Brand & Campaign Setup</h1>
      <p className="page-subtitle">Define your brand context. All AI outputs will respect this.</p>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#1e293b' }}>Brand Context</h2>
        {field('Brand Name *', <input style={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. TechNova" />)}
        {field('Industry *', <input style={inp} value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="e.g. SaaS / E-commerce / Healthcare" />)}
        {field('Target Audience *', <textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={form.target_audience} onChange={e => set('target_audience', e.target.value)} placeholder="e.g. Marketing managers aged 28-45 who struggle with content creation at scale" />)}
        {field('Brand Tone', <ToneSelector selected={form.tone} onChange={(t) => set('tone', t)} />)}
        {field('Keywords to ALWAYS include (comma separated)', <input style={inp} value={form.keywords_include} onChange={e => set('keywords_include', e.target.value)} placeholder="e.g. innovative, growth, results" />)}
        {field('Words to NEVER use (comma separated)', <input style={inp} value={form.keywords_avoid} onChange={e => set('keywords_avoid', e.target.value)} placeholder="e.g. cheap, basic, simple" />)}
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#1e293b' }}>Campaign Setup</h2>
        {field('Campaign Name', <input style={inp} value={form.campaign_name} onChange={e => set('campaign_name', e.target.value)} placeholder="e.g. Q3 Growth Campaign" />)}
        {field('Campaign Goal', (
          <select style={inp} value={form.campaign_goal} onChange={e => set('campaign_goal', e.target.value)}>
            {GOALS.map(g => <option key={g}>{g}</option>)}
          </select>
        ))}
        {field('Campaign Duration', <input style={inp} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g. 4 weeks, 3 months" />)}
        {field('Target Platforms', (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PLATFORMS.map(p => {
              const active = form.platforms.includes(p);
              return (
                <button key={p} type="button" onClick={() => togglePlatform(p)}
                  style={{ padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', border: active ? '2px solid #6366f1' : '1.5px solid #e2e8f0', background: active ? '#eef2ff' : 'white', color: active ? '#6366f1' : '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {p}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {warnings.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <p style={{ fontWeight: '600', fontSize: '13px', marginBottom: '8px', color: '#92400e' }}>AI Validation Insights:</p>
          {warnings.map((w, i) => <p key={i} style={{ fontSize: '13px', color: '#78350f', marginBottom: '4px' }}>{w}</p>)}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={handleValidate} className="btn-secondary">🔍 Validate Setup</button>
        <button onClick={handleSubmit} disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : '💾 Save Brand & Continue'}
        </button>
      </div>
    </div>
  );
}
