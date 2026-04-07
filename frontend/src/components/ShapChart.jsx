// components/ShapChart.jsx — SHAP feature importance horizontal bar chart
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

const FEATURE_LABELS = {
  age: 'Age', sex: 'Sex', cp: 'Type of Chest Pain', trestbps: 'Resting Blood Pressure',
  chol: 'Cholesterol Level', fbs: 'High Fasting Blood Sugar', restecg: 'Resting Heart Scan (ECG)',
  thalach: 'Maximum Heart Rate', exang: 'Chest Pain During Exercise', oldpeak: 'Heart Stress Result',
  slope: 'Heart Rhythm Change (ECG Slope)', ca: 'Blocked Blood Vessels', thal: 'Blood Flow Defect (Thalassemia)',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'rgba(13,18,32,0.95)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem',
    }}>
      <p style={{ color: '#94a3b8', marginBottom: 4 }}>{d.label}</p>
      <p style={{ color: d.value > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
        SHAP: {d.value > 0 ? '+' : ''}{d.value.toFixed(4)}
      </p>
      <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
        {d.value > 0 ? '↑ Increases risk' : '↓ Decreases risk'}
      </p>
    </div>
  );
};

export default function ShapChart({ features }) {
  if (!features?.length) return null;

  const data = features.map(f => ({
    label: FEATURE_LABELS[f.feature] || f.feature,
    value: f.value,
    abs: Math.abs(f.value),
  })).sort((a, b) => b.abs - a.abs).slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>
          Why this score? — Feature Impact
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ color: '#ef4444' }}>■</span> Red = increases risk &nbsp;
          <span style={{ color: '#10b981' }}>■</span> Green = decreases risk
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 5, bottom: 5 }}>
          <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" width={140} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine x={0} stroke="rgba(255,255,255,0.1)" />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={900}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.value > 0 ? '#ef4444' : '#10b981'}
                fillOpacity={0.75 + (entry.abs / data[0].abs) * 0.25} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
