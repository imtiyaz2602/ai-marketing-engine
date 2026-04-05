import React, { useState } from 'react';
import ContentCard from '../components/ContentHub/ContentCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Toast from '../components/shared/Toast';
import { repurposeContent } from '../services/api';
import { useBrand } from '../context/BrandContext';

export default function RepurposePage() {
  const { brandId } = useBrand();
  const [assetName, setAssetName] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleRepurpose = async () => {
    if (!brandId) { setToast({ msg: 'Set up your brand first!', type: 'error' }); return; }
    if (!content.trim() || !assetName.trim()) { setToast({ msg: 'Fill in asset name and content', type: 'error' }); return; }
    setLoading(true); setResult(null);
    try {
      const res = await repurposeContent({ asset_name: assetName, content, brand_id: brandId });
      setResult(res.data);
    } catch { setToast({ msg: 'Repurposing failed', type: 'error' }); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', fontFamily: 'Inter,sans-serif', outline: 'none' };

  return (
    <div style={{ maxWidth: '860px' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">♻️ Content Repurposing Engine</h1>
      <p className="page-subtitle">Upload long-form content and extract maximum value across all formats.</p>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>Asset Name</label>
          <input style={inp} value={assetName} onChange={e => setAssetName(e.target.value)} placeholder="e.g. The Ultimate Guide to B2B Marketing" />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '6px' }}>Paste Your Content (blog post, podcast transcript, webinar notes)</label>
          <textarea style={{ ...inp, resize: 'vertical' }} rows={10} value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your long-form content here..." />
        </div>
        <button onClick={handleRepurpose} disabled={loading || !brandId} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
          {loading ? 'Repurposing...' : '♻️ Extract & Repurpose Content'}
        </button>
      </div>

      {loading && <LoadingSpinner message="AI is extracting insights and generating all formats..." />}

      {result && (
        <div>
          <div className="card" style={{ marginBottom: '24px', background: '#f8fafc' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>🔍 Extracted Insights</h2>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#6366f1', marginBottom: '8px' }}>Top 5 Key Insights</h3>
              {result.extracted?.top_insights?.map((ins, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#6366f1', fontWeight: '600' }}>{i + 1}.</span>
                  <p style={{ fontSize: '13px', color: '#475569' }}>{ins}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#6366f1', marginBottom: '8px' }}>💬 Most Quotable Lines</h3>
              {result.extracted?.quotable_lines?.map((q, i) => (
                <div key={i} style={{ borderLeft: '3px solid #6366f1', paddingLeft: '12px', marginBottom: '8px', fontStyle: 'italic', fontSize: '13px', color: '#475569' }}>"{q}"</div>
              ))}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#6366f1', marginBottom: '8px' }}>📝 Main Argument Summary</h3>
              <p style={{ fontSize: '13px', color: '#475569' }}>{result.extracted?.main_argument}</p>
            </div>
            {result.extracted?.coverage_map && (
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#6366f1', marginBottom: '8px' }}>🗺️ Content Coverage Map</h3>
                {result.extracted.coverage_map.map((section, i) => (
                  <div key={i} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '3px' }}>
                      <span>{section.section}</span><span>{section.usage_percent}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${section.usage_percent}%`, background: '#6366f1', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Generated Content (Based on {result.asset_name})</h2>
          {result.generated?.linkedin?.map((p, i) => (
            <ContentCard key={i} title={`LinkedIn — ${p.type}`} content={p.content} platform="LinkedIn" brandId={brandId} />
          ))}
          {result.generated?.instagram?.map((p, i) => (
            <ContentCard key={i} title={`Instagram — ${p.variant}`} content={`${p.caption}\n\n${p.hashtags?.map(h => `#${h}`).join(' ')}`} platform="Instagram" brandId={brandId} />
          ))}
          {result.generated?.twitter?.map((p, i) => (
            <ContentCard key={i} title={`Twitter — ${p.angle}`} content={p.content} platform="Twitter" brandId={brandId} />
          ))}
          {result.generated?.email && (
            <ContentCard title="Email Newsletter" content={`Subject: ${result.generated.email.subject_line}\n\n${result.generated.email.body}\n\nCTA: ${result.generated.email.cta}`} platform="Email" brandId={brandId} />
          )}
        </div>
      )}
    </div>
  );
}
