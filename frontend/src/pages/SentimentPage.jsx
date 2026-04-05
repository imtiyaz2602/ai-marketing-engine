import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Toast from '../components/shared/Toast';
import { analyseSentimentCSV, analyseSentimentText } from '../services/api';

export default function SentimentPage() {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleAnalyse = async () => {
    setLoading(true); setResult(null);
    try {
      let res;
      if (mode === 'csv' && file) {
        const fd = new FormData(); fd.append('file', file);
        res = await analyseSentimentCSV(fd);
      } else {
        res = await analyseSentimentText(text);
      }
      setResult(res.data);
    } catch { setToast({ msg: 'Analysis failed. Try again.', type: 'error' }); }
    finally { setLoading(false); }
  };

  const pieData = result ? [
    { name: 'Positive', value: result.sentiment_score?.positive },
    { name: 'Neutral', value: result.sentiment_score?.neutral },
    { name: 'Negative', value: result.sentiment_score?.negative },
  ] : [];
  const PIE_COLORS = ['#22c55e', '#94a3b8', '#ef4444'];

  const wordFreqs = result?.word_frequencies
    ? Object.entries(result.word_frequencies).sort((a, b) => b[1] - a[1])
    : [];
  const maxFreq = wordFreqs[0]?.[1] || 1;

  return (
    <div style={{ maxWidth: '900px' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">📊 Audience & Sentiment Intelligence</h1>
      <p className="page-subtitle">Analyse customer reviews, survey responses, or social media comments.</p>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['text', 'csv'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '13px', background: mode === m ? '#6366f1' : '#f1f5f9', color: mode === m ? 'white' : '#64748b' }}>
              {m === 'text' ? '📝 Paste Text' : '📁 Upload CSV'}
            </button>
          ))}
        </div>

        {mode === 'text' ? (
          <textarea rows={8} value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste customer reviews, social comments, or survey responses here (one per line)..."
            style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '14px', fontFamily: 'Inter,sans-serif', outline: 'none', resize: 'vertical' }} />
        ) : (
          <div style={{ border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '32px', textAlign: 'center' }}>
            <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} id="csvInput" />
            <label htmlFor="csvInput" style={{ cursor: 'pointer', color: '#6366f1', fontWeight: '500', fontSize: '14px' }}>
              📁 Click to upload CSV file
            </label>
            {file && <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>✓ {file.name}</p>}
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>CSV should have feedback in the first column</p>
          </div>
        )}

        <button onClick={handleAnalyse} disabled={loading} className="btn-primary" style={{ marginTop: '14px', width: '100%', padding: '12px' }}>
          {loading ? 'Analysing...' : '🔍 Analyse Sentiment'}
        </button>
      </div>

      {loading && <LoadingSpinner message="AI is analysing your customer feedback..." />}

      {result && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Sentiment Score</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: PIE_COLORS[i], display: 'inline-block' }} />
                    {d.name}: {d.value}%
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>🌐 Word Cloud</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {wordFreqs.slice(0, 20).map(([word, freq]) => (
                  <span key={word} style={{ fontSize: `${Math.max(11, Math.min(22, 11 + (freq / maxFreq) * 11))}px`, color: `hsl(${Math.random() * 60 + 220}, 70%, 45%)`, fontWeight: '500' }}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#16a34a' }}>✅ Top Positive Themes</h3>
              {result.positive_themes?.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#374151' }}>{t.theme || t}</span>
                  {t.count && <span style={{ background: '#dcfce7', color: '#16a34a', padding: '1px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>{t.count}</span>}
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#dc2626' }}>⚠️ Top Negative Themes</h3>
              {result.negative_themes?.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#374151' }}>{t.theme || t}</span>
                  {t.count && <span style={{ background: '#fee2e2', color: '#dc2626', padding: '1px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>{t.count}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>🔥 High-Impact Comments</h3>
            {result.high_impact_comments?.map((c, i) => (
              <div key={i} style={{ borderLeft: '3px solid #6366f1', paddingLeft: '12px', marginBottom: '10px', fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>"{c}"</div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>🎯 Suggested Campaign Angles</h3>
            {result.campaign_angles?.map((a, i) => (
              <div key={i} style={{ background: '#eef2ff', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px', fontSize: '13px', color: '#4338ca' }}>💡 {a}</div>
            ))}
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #eef2ff, #f0fdf4)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '10px' }}>🗣️ Voice of Customer Summary</h3>
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7' }}>{result.voice_of_customer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
