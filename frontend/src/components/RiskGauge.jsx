// components/RiskGauge.jsx — Animated circular gauge for risk score
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RADIUS = 90;
const STROKE = 14;
const CIRCUMFERENCE = Math.PI * RADIUS; // half-circle arc

function getRiskColor(score) {
  if (score >= 80) return '#ef4444';
  if (score >= 60) return '#f97316';
  if (score >= 40) return '#f59e0b';
  return '#10b981';
}

function getRiskLabel(level) {
  const labels = { Low: '🟢 Low', Moderate: '🟡 Moderate', High: '🟠 High', Critical: '🔴 Critical' };
  return labels[level] || level;
}

export default function RiskGauge({ score, level }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const color = getRiskColor(score);
  const fillLength = (animatedScore / 100) * CIRCUMFERENCE;
  const cx = 110, cy = 110;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: 220, height: 130 }}>
        <svg width="220" height="130" viewBox="0 0 220 120">
          {/* Track */}
          <path
            d={`M ${cx - RADIUS},${cy} A ${RADIUS},${RADIUS} 0 0,1 ${cx + RADIUS},${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {/* Animated fill */}
          <motion.path
            d={`M ${cx - RADIUS},${cy} A ${RADIUS},${RADIUS} 0 0,1 ${cx + RADIUS},${cy}`}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE - fillLength }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
          {/* Score text */}
          <text x={cx} y={cy - 8} textAnchor="middle" fill="white"
            fontSize="32" fontWeight="800" fontFamily="Outfit, sans-serif">
            {Math.round(animatedScore)}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.5)"
            fontSize="11" fontFamily="Inter, sans-serif">
            OUT OF 100
          </text>
        </svg>

        {/* Glow behind gauge */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 40, borderRadius: '50%',
          background: color, filter: 'blur(30px)', opacity: 0.3,
        }} />
      </div>

      {/* Tick marks */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
        <span style={{ color: '#10b981' }}>0</span>
        <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
        <span style={{ color: '#f59e0b' }}>40</span>
        <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
        <span style={{ color: '#f97316' }}>60</span>
        <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
        <span style={{ color: '#ef4444' }}>80+</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <span className={`risk-badge ${level?.toLowerCase()}`}>
          {getRiskLabel(level)}
        </span>
      </div>
    </div>
  );
}
