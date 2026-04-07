// components/RecommendationCards.jsx
import { motion } from 'framer-motion';

const PRIORITY_CONFIG = {
  High:   { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   icon: '🔴', label: 'High Priority' },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  icon: '🟡', label: 'Medium Priority' },
  Low:    { color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  icon: '🟢', label: 'Low Priority' },
};

function RecommendationCard({ rec, index }) {
  const cfg = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.Low;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        borderRadius: 16, padding: '18px 20px',
        borderLeft: `4px solid ${cfg.color}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.1rem' }}>{cfg.icon}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {rec.category}
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', color: cfg.color, background: `${cfg.color}22`, padding: '2px 10px', borderRadius: 50, fontWeight: 600 }}>
          {cfg.label}
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 10, fontStyle: 'italic' }}>
        "{rec.finding}"
      </p>

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }}>→</span>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {rec.action}
        </p>
      </div>
    </motion.div>
  );
}

export default function RecommendationCards({ recommendations }) {
  if (!recommendations?.length) return null;
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>
          Personalised Recommendations
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {recommendations.length} action item{recommendations.length !== 1 ? 's' : ''} based on your profile
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recommendations.map((rec, i) => (
          <RecommendationCard key={i} rec={rec} index={i} />
        ))}
      </div>
    </div>
  );
}
