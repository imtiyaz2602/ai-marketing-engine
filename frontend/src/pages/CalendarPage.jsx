import React, { useState, useEffect } from 'react';
import { getCalendar, updateCalendarItem, deleteCalendarItem, suggestSchedule } from '../services/api';
import Toast from '../components/shared/Toast';
import { useBrand } from '../context/BrandContext';

const PLATFORMS = ['All', 'LinkedIn', 'Instagram', 'Twitter', 'Email', 'Google Ads', 'Video', 'Blog'];
const STATUSES = ['Draft', 'Ready', 'Scheduled', 'Published'];
const STATUS_COLORS = { Draft: '#f1f5f9', Ready: '#dcfce7', Scheduled: '#dbeafe', Published: '#ede9fe' };
const STATUS_TEXT = { Draft: '#64748b', Ready: '#16a34a', Scheduled: '#2563eb', Published: '#7c3aed' };
const PLATFORM_ICONS = { LinkedIn: '💼', Instagram: '📸', Twitter: '🐦', Email: '📧', 'Google Ads': '🔍', Video: '🎬', Blog: '📝', SEO: '🔎' };

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarPage() {
  const { brandData } = useBrand();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [dragItem, setDragItem] = useState(null);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const res = await getCalendar(); setItems(res.data); } catch {}
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const filtered = filter === 'All' ? items : items.filter(i => i.platform === filter);

  const itemsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filtered.filter(i => i.scheduled_date === dateStr);
  };

  const handleDrop = async (day, e) => {
    e.preventDefault();
    if (!dragItem) return;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    try {
      await updateCalendarItem(dragItem.id, { scheduled_date: dateStr, status: 'Scheduled' });
      setToast({ msg: `Scheduled for ${dateStr}`, type: 'success' });
      fetchItems();
    } catch { setToast({ msg: 'Failed to schedule', type: 'error' }); }
    setDragItem(null);
  };

  const handleStatusChange = async (id, status) => {
    await updateCalendarItem(id, { status });
    fetchItems();
  };

  const handleDelete = async (id) => {
    await deleteCalendarItem(id);
    fetchItems();
    setToast({ msg: 'Deleted', type: 'info' });
  };

  const handleSuggestSchedule = async () => {
    const platforms = brandData?.platforms || ['LinkedIn', 'Instagram', 'Twitter'];
    const res = await suggestSchedule({ platforms, duration: brandData?.duration || '4 weeks' });
    setSchedule(res.data.schedule || []);
  };

  const unscheduled = filtered.filter(i => !i.scheduled_date);

  const gapWeeks = () => {
    const gaps = [];
    for (let week = 1; week <= 4; week++) {
      const startDay = (week - 1) * 7 + 1;
      const endDay = Math.min(week * 7, daysInMonth);
      const hasContent = Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i)
        .some(d => itemsForDate(d).length > 0);
      if (!hasContent) gaps.push(week);
    }
    return gaps;
  };

  return (
    <div style={{ maxWidth: '1100px' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="page-title">📅 Campaign Content Calendar</h1>
      <p className="page-subtitle">Drag content onto dates. Track status and identify gaps.</p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setFilter(p)}
              style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', border: 'none', cursor: 'pointer', background: filter === p ? '#6366f1' : '#f1f5f9', color: filter === p ? 'white' : '#64748b' }}>
              {p}
            </button>
          ))}
        </div>
        <button onClick={handleSuggestSchedule} className="btn-secondary" style={{ fontSize: '13px', padding: '6px 14px' }}>
          🤖 AI Schedule Suggestions
        </button>
      </div>

      {gapWeeks().length > 0 && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#c2410c' }}>
          ⚠️ Content gaps detected in Week{gapWeeks().length > 1 ? 's' : ''} {gapWeeks().join(', ')} — nothing scheduled!
        </div>
      )}

      {schedule.length > 0 && (
        <div className="card" style={{ marginBottom: '20px', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#16a34a' }}>🤖 AI Posting Schedule Suggestions</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {schedule.map((s, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
                <strong>{s.platform}</strong> — {s.day} @ {s.time}<br />
                <span style={{ fontSize: '12px', color: '#64748b' }}>{s.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); }}
              style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>‹</button>
            <h2 style={{ fontSize: '16px', fontWeight: '600' }}>{MONTHS[currentMonth]} {currentYear}</h2>
            <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); }}
              style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>›</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
            {DAYS.map(d => (
              <div key={d} style={{ background: '#f8fafc', padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} style={{ background: 'white', minHeight: '90px' }} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dayItems = itemsForDate(day);
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              return (
                <div key={day}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleDrop(day, e)}
                  style={{ background: 'white', minHeight: '90px', padding: '6px', borderTop: isToday ? '2px solid #6366f1' : 'none', transition: 'background 0.15s' }}>
                  <span style={{ fontSize: '12px', fontWeight: isToday ? '700' : '400', color: isToday ? '#6366f1' : '#94a3b8' }}>{day}</span>
                  {dayItems.map(item => (
                    <div key={item.id}
                      draggable
                      onDragStart={() => setDragItem(item)}
                      style={{ background: STATUS_COLORS[item.status] || '#f1f5f9', borderRadius: '4px', padding: '3px 6px', marginTop: '3px', fontSize: '11px', cursor: 'grab', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>{PLATFORM_ICONS[item.platform] || '📄'}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: STATUS_TEXT[item.status] }}>
                        {item.content?.substring(0, 20)}...
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#475569' }}>Unscheduled Content ({unscheduled.length})</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>Drag items onto calendar dates</p>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {unscheduled.length === 0 && (
              <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '20px' }}>All content scheduled! ✅</p>
            )}
            {unscheduled.map(item => (
              <div key={item.id} draggable onDragStart={() => setDragItem(item)}
                style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginBottom: '8px', cursor: 'grab' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{PLATFORM_ICONS[item.platform]} {item.platform}</span>
                  <select value={item.status} onChange={e => handleStatusChange(item.id, e.target.value)}
                    style={{ fontSize: '11px', border: 'none', background: STATUS_COLORS[item.status], color: STATUS_TEXT[item.status], borderRadius: '6px', padding: '2px 4px', cursor: 'pointer', fontWeight: '600' }}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <p style={{ fontSize: '12px', color: '#374151', marginBottom: '6px', lineHeight: '1.4' }}>{item.content?.substring(0, 60)}...</p>
                <button onClick={() => handleDelete(item.id)}
                  style={{ fontSize: '11px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>🗑 Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
