import React, { useState } from 'react';
import ContentCard from '../components/ContentHub/ContentCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Toast from '../components/shared/Toast';
import { generateContent, saveContentPiece } from '../services/api';
import { useBrand } from '../context/BrandContext';

export default function ContentPage() {
  const { brandId } = useBrand();
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleGenerate = async () => {
    if (!brandId) { setToast({ msg: 'Please set up your brand first!', type: 'error' }); return; }
    if (!topic.trim()) { setToast({ msg: 'Enter a topic first', type: 'error' }); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await generateContent({ topic, brand_id: brandId });
      setResult(res.data);
    } catch { setToast({ msg: 'Generation failed. Try again.', type: 'error' }); }
    finally { setLoading(false); }
  };

  const handleSaveToCalendar = async (content, platform) => {
    try {
      await saveContentPiece({ type: platform, content, platform, brand_id: brandId });
      setToast({ msg: `Saved to Calendar!`, type: 'success' });
    } catch { setToast({ msg: 'Failed to save', type: 'error' }); }
  };

  return (
    <div style={{ maxWidth: '860px' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">✍️ AI Content Generation Hub</h1>
      <p className="page-subtitle">Enter a topic and generate content for every platform at once.</p>

      {!brandId && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', fontSize: '14px', color: '#c2410c' }}>
          ⚠️ No brand set up yet. Go to <strong>Brand Setup</strong> first.
        </div>
      )}

      <div className="card" style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '8px' }}>Campaign Topic or Brief</label>
        <textarea
          rows={3}
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g. Launching our new AI-powered analytics dashboard for marketing teams"
          style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '14px', fontFamily: 'Inter,sans-serif', outline: 'none', resize: 'vertical' }}
        />
        <button onClick={handleGenerate} disabled={loading || !brandId} className="btn-primary" style={{ marginTop: '12px', width: '100%', padding: '12px' }}>
          {loading ? 'Generating all formats...' : '⚡ Generate All Content Formats'}
        </button>
      </div>

      {loading && <LoadingSpinner message="AI is generating content for all platforms..." />}

      {result && (
        <div>
          <Section title="LinkedIn Posts">
            {result.linkedin?.map((p, i) => (
              <ContentCard key={i} title={`LinkedIn — ${p.type}`} content={p.content} platform="LinkedIn" brandId={brandId} onSaveToCalendar={handleSaveToCalendar} />
            ))}
          </Section>

          <Section title="Instagram">
            {result.instagram?.map((p, i) => (
              <ContentCard key={i} title={`Instagram — ${p.variant}`} content={`${p.caption}\n\n${p.hashtags?.map(h => `#${h}`).join(' ')}`} platform="Instagram" brandId={brandId} onSaveToCalendar={handleSaveToCalendar} />
            ))}
          </Section>

          <Section title="Twitter / X">
            {result.twitter?.map((p, i) => (
              <ContentCard key={i} title={`Twitter — ${p.angle}`} content={p.content} platform="Twitter" brandId={brandId} onSaveToCalendar={handleSaveToCalendar} />
            ))}
          </Section>

          <Section title="Video Scripts">
            {result.video_scripts?.map((s, i) => (
              <ContentCard key={i} title={`Video Script — ${s.duration}`} content={`HOOK: ${s.hook}\n\nBODY: ${s.body}\n\nCTA: ${s.cta}`} platform="Video" brandId={brandId} />
            ))}
          </Section>

          <Section title="Email Newsletter">
            {result.email && (
              <ContentCard title="Email Newsletter" content={`Subject: ${result.email.subject_line}\n\n${result.email.body}\n\nCTA: ${result.email.cta}`} platform="Email" brandId={brandId} onSaveToCalendar={handleSaveToCalendar} />
            )}
          </Section>

          <Section title="Blog Outline">
            {result.blog_outline && (
              <ContentCard title="Blog Post Outline" content={`H1: ${result.blog_outline.h1}\n\n${result.blog_outline.sections?.map(s => `H2: ${s.h2}\n• ${s.key_points?.join('\n• ')}\n(~${s.word_count} words)`).join('\n\n')}`} platform="Blog" brandId={brandId} />
            )}
          </Section>

          <Section title="Google Ads">
            {result.google_ads?.map((ad, i) => (
              <ContentCard key={i} title={`Google Ad #${i + 1}`} content={`Headline: ${ad.headline}\nDescription: ${ad.description}`} platform="Google Ads" brandId={brandId} />
            ))}
          </Section>

          <Section title="SEO Meta">
            {result.seo_meta && (
              <ContentCard title="SEO Meta Tags" content={`Title: ${result.seo_meta.title}\nDescription: ${result.seo_meta.description}`} platform="SEO" brandId={brandId} />
            )}
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '14px', paddingBottom: '8px', borderBottom: '2px solid #e2e8f0' }}>{title}</h2>
      {children}
    </div>
  );
}
