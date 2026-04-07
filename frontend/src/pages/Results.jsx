// pages/Results.jsx — Full results dashboard
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RiskGauge from '../components/RiskGauge';
import ShapChart from '../components/ShapChart';
import DoctorContact from '../components/DoctorContact';
import RecommendationCards from '../components/RecommendationCards';
import AlertBanner from '../components/AlertBanner';
import TrendChart from '../components/TrendChart';

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 16 }}>
        <p style={{ color: 'var(--text-secondary)' }}>No results found. Please complete the assessment first.</p>
        <Link to="/predict" className="btn-primary">Start Assessment →</Link>
      </div>
    );
  }

  const r = state.result;

  return (
    <div className="page-wrapper" style={{ padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Results for</p>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {r.user_id}'s <span className="gradient-text">Assessment</span>
            </h1>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/predict')}>
            ← New Assessment
          </button>
        </motion.div>

        {/* Critical alert */}
        {r.alert && (
          <div style={{ marginBottom: 24 }}>
            <AlertBanner message={r.alert} />
          </div>
        )}

        {/* Top row: Gauge + SHAP */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, marginBottom: 20 }}>

          {/* Gauge card */}
          <motion.div className="glass-card" style={{ padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center' }}>
              Cardiovascular Risk Score
            </p>
            <RiskGauge score={r.risk_score} level={r.risk_level} />

            <div style={{ marginTop: 16, width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>Score</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{r.risk_score}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Level</span>
                <span className={`risk-badge ${r.risk_level?.toLowerCase()}`}>{r.risk_level}</span>
              </div>
            </div>
          </motion.div>

          {/* SHAP card / Doctor Contact */}
          <motion.div className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <DoctorContact score={r.risk_score} level={r.risk_level} />
            {r.shap_features && r.shap_features.length > 0 && (
              <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <ShapChart features={r.shap_features} />
              </div>
            )}
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div className="glass-card" style={{ padding: '28px', marginBottom: 20 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
          <RecommendationCards recommendations={r.recommendations} />
        </motion.div>

        {/* Trend chart */}
        <motion.div className="glass-card" style={{ padding: '28px' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
          <TrendChart userId={r.user_id} />
        </motion.div>

        {/* Disclaimer */}
        <p style={{ marginTop: 24, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 600, margin: '24px auto 0' }}>
          ⚠️ This tool is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional for clinical decisions.
        </p>
      </div>
    </div>
  );
}
