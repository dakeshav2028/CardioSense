// components/TrendChart.jsx — longitudinal risk score over time
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const color = payload.risk_score >= 80 ? '#ef4444' : payload.risk_score >= 60 ? '#f97316' : payload.risk_score >= 40 ? '#f59e0b' : '#10b981';
  return <circle cx={cx} cy={cy} r={6} fill={color} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />;
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: 'rgba(13,18,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem' }}>
      <p style={{ color: '#94a3b8', marginBottom: 4 }}>{new Date(d.timestamp).toLocaleDateString()}</p>
      <p style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>Risk: {d.risk_score}%</p>
      <p style={{ color: '#64748b' }}>{d.risk_level}</p>
    </div>
  );
};

export default function TrendChart({ userId }) {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [inputId, setInputId] = useState(userId || '');
  const [error, setError] = useState('');

  const fetchHistory = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`${API_BASE}/history/${id.trim()}`);
      setHistory(data);
      setSearched(true);
    } catch (e) {
      if (e.response?.status === 404) setError(`No history found for "${id}". Submit a prediction first.`);
      else setError('Could not load history. Is the API running?');
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  const chartData = history?.entries?.map(e => ({
    timestamp: e.timestamp,
    risk_score: e.risk_score,
    risk_level: e.risk_level,
    label: new Date(e.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>Risk Trend Over Time</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter your user ID to see how your risk has changed</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          className="form-input"
          style={{ flex: 1 }}
          placeholder="Enter your user ID (e.g., john_doe)"
          value={inputId}
          onChange={e => setInputId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchHistory(inputId)}
        />
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem', borderRadius: 8 }}
          onClick={() => fetchHistory(inputId)} disabled={loading}>
          {loading ? '...' : 'Load'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>
      )}

      {chartData?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            {history.count} assessment{history.count !== 1 ? 's' : ''} for <strong style={{ color: 'var(--text-primary)' }}>{history.user_id}</strong>
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#ef444460" strokeDasharray="4 4" label={{ value: 'Critical', position: 'insideRight', fill: '#ef4444', fontSize: 10 }} />
              <ReferenceLine y={40} stroke="#10b98160" strokeDasharray="4 4" label={{ value: 'Moderate', position: 'insideRight', fill: '#10b981', fontSize: 10 }} />
              <Line
                type="monotone" dataKey="risk_score" stroke="url(#lineGrad)"
                strokeWidth={3} dot={<CustomDot />} activeDot={{ r: 8 }}
                isAnimationActive animationDuration={1000}
              />
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {searched && !chartData?.length && !error && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data to display.</p>
      )}
    </div>
  );
}
