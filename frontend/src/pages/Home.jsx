// pages/Home.jsx — Landing page
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: '🧠', title: 'ML-Powered Scoring', desc: 'Random Forest model trained on 1,000+ patients with 5-fold cross-validated accuracy.' },
  { icon: '🔍', title: 'SHAP Explainability', desc: 'Understand exactly which factors contributed to your risk — no black boxes.' },
  { icon: '📋', title: 'Smart Recommendations', desc: 'Personalised action plan based on your unique clinical profile.' },
  { icon: '📈', title: 'Trend Tracking', desc: 'Monitor how lifestyle changes affect your cardiovascular risk over time.' },
];

const STATS = [
  { value: '1K+', label: 'Patients Trained On' },
  { value: '80%', label: 'Model Accuracy' },
  { value: '13', label: 'Clinical Features' },
  { value: '<30s', label: 'Prediction Time' },
];

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 40px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '5rem', marginBottom: 24 }}
          >
            🫀
          </motion.div>

          <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 50, padding: '6px 18px', fontSize: '0.8rem', color: '#a78bfa', letterSpacing: '0.08em', marginBottom: 24, fontWeight: 600 }}>
            ✦ AI-POWERED CARDIOLOGY TOOL
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, marginBottom: 24, lineHeight: 1.1 }}>
            Know Your Heart<br />
            <span className="gradient-text">Risk Today</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Our machine learning model analyses 13 clinical indicators to predict your cardiovascular risk — and explains every decision.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/predict" className="btn-primary" style={{ fontSize: '1.05rem', padding: '16px 36px' }}>
              Start Free Assessment  →
            </Link>
            <a href="#features" className="btn-secondary">
              How it works
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div className="container">
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {STATS.map((s, i) => (
              <motion.div key={i} className="glass-card" style={{ padding: '28px 20px', textAlign: 'center' }}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" style={{ padding: '40px 24px 100px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>
              Built for <span className="gradient-text">precision</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Medical-grade insights with full explainability — not just a number.
            </p>
          </div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {FEATURES.map((f, i) => (
              <motion.div key={i} className="glass-card" style={{ padding: '32px' }}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>
                <div style={{ fontSize: '2rem', marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '56px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.08) 100%)', borderColor: 'rgba(124,58,237,0.2)' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Ready to check your risk?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>It takes less than 2 minutes. No sign-up required.</p>
            <Link to="/predict" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
              Get My Risk Score →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
