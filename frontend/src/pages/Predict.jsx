// pages/Predict.jsx — Multi-step animated input form
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const STEPS = ['Identity', 'Demographics', 'Clinical', 'Symptoms'];

const DEFAULTS = {
  user_id: '', age: '', sex: '', trestbps: '', chol: '',
  fbs: '', thalach: '', oldpeak: '', cp: '', restecg: '', exang: '', slope: '', ca: '', thal: '',
};

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

function Field({ label, hint, required = false, children }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}{required && <span className="required">*</span>}</label>
      {children}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}

export default function Predict() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const next = () => { setDir(1); setStep(s => Math.min(s + 1, 3)); };
  const prev = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)); };

  const submit = async () => {
    setLoading(true);
    setError('');

    if (!form.user_id || !form.age || form.sex === '') {
      setError('Please fill out your identity and demographic info (Steps 1 & 2).');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        user_id: form.user_id,
        age: +form.age,
        sex: +form.sex,
        trestbps: form.trestbps !== '' ? +form.trestbps : 120, // normal resting BP
        chol: form.chol !== '' ? +form.chol : 200,             // normal cholesterol
        fbs: form.fbs !== '' ? +form.fbs : 0,                  // assume norm fasting sugar
        thalach: form.thalach !== '' ? +form.thalach : 150,    // average max heart rate
        oldpeak: form.oldpeak !== '' ? +form.oldpeak : 0.0,    // assume no ST depression
        cp: form.cp !== '' ? +form.cp : 3,                     // assume asymptomatic typical
        restecg: form.restecg !== '' ? +form.restecg : 0,      // assume normal ECG
        exang: form.exang !== '' ? +form.exang : 0,            // assume no exercise angina
        slope: form.slope !== '' ? +form.slope : 1,            // assume flat
        ca: form.ca !== '' ? +form.ca : 0,                     // assume 0 vessels colored
        thal: form.thal !== '' ? +form.thal : 0,               // assume normal
      };
      const { data } = await axios.post(`${API_BASE}/predict`, payload);
      navigate('/results', { state: { result: data } });
    } catch (e) {
      const msg = e.response?.data?.detail;
      if (Array.isArray(msg)) setError(msg.map(m => m.msg).join(', '));
      else setError(msg || 'Failed to connect. Is the API server running?');
    } finally {
      setLoading(false);
    }
  };

  // Step content
  const stepContent = [
    // Step 0 — Identity
    <div key="s0" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Field label="Your Name / ID" hint="This will track your assessments over time. No account needed." required={true}>
        <input className="form-input" id="user_id" placeholder="e.g. john_doe" value={form.user_id}
          onChange={e => set('user_id', e.target.value)} />
      </Field>
      <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 12, padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        💡 <strong style={{ color: 'var(--text-primary)' }}>Tip:</strong> Use the same ID every time to see your risk trend over time.
      </div>
    </div>,

    // Step 1 — Demographics
    <div key="s1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <Field label="Age" hint="18–100 years" required={true}>
        <input className="form-input" id="age" type="number" placeholder="55" min={18} max={100}
          value={form.age} onChange={e => set('age', e.target.value)} />
      </Field>
      <Field label="Sex" hint="" required={true}>
        <select className="form-select" id="sex" value={form.sex} onChange={e => set('sex', e.target.value)}>
          <option value="">Select…</option>
          <option value="0">Female</option>
          <option value="1">Male</option>
          <option value="2">other</option>
        </select>
      </Field>
    </div>,

    // Step 2 — Clinical
    <div key="s2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <Field label="Resting Blood Pressure" hint="mmHg (80–220) — Leave blank if unknown">
        <input className="form-input" id="trestbps" type="number" placeholder="e.g. 130 (Optional)"
          value={form.trestbps} onChange={e => set('trestbps', e.target.value)} />
      </Field>
      <Field label="Cholesterol" hint="mg/dL (100–600) — Leave blank if unknown">
        <input className="form-input" id="chol" type="number" placeholder="e.g. 250 (Optional)"
          value={form.chol} onChange={e => set('chol', e.target.value)} />
      </Field>
      <Field label="Max Heart Rate Achieved" hint="bpm (60–220) — Leave blank if unknown">
        <input className="form-input" id="thalach" type="number" placeholder="e.g. 150 (Optional)"
          value={form.thalach} onChange={e => set('thalach', e.target.value)} />
      </Field>
      <Field label="Heart Stress Result (Oldpeak)" hint="ECG depression. Leave blank if unknown.">
        <input className="form-input" id="oldpeak" type="number" step="0.1" placeholder="e.g. 1.5 (Optional)"
          value={form.oldpeak} onChange={e => set('oldpeak', e.target.value)} />
      </Field>
      <Field label="High Fasting Blood Sugar" hint="Is your fasting blood sugar > 120 mg/dL?">
        <select className="form-select" id="fbs" value={form.fbs} onChange={e => set('fbs', e.target.value)}>
          <option value="">I don't know (Skip)</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </Field>
      <Field label="Resting Heart Scan (ECG)" hint="Results from an electrocardiogram">
        <select className="form-select" id="restecg" value={form.restecg} onChange={e => set('restecg', e.target.value)}>
          <option value="">I don't know (Skip)</option>
          <option value="0">Normal</option>
          <option value="1">Minor abnormality (ST-T wave)</option>
          <option value="2">Enlarged heart muscle (LVH)</option>
        </select>
      </Field>
    </div>,

    // Step 3 — Symptoms
    <div key="s3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <Field label="Type of Chest Pain" hint="What kind of chest pain do you usually experience?">
        <select className="form-select" id="cp" value={form.cp} onChange={e => set('cp', e.target.value)}>
          <option value="">I don't know (Skip)</option>
          <option value="0">Typical heart-related pain</option>
          <option value="1">Atypical or unusual pain</option>
          <option value="2">Non-heart related pain</option>
          <option value="3">No symptoms (Asymptomatic)</option>
        </select>
      </Field>
      <Field label="Chest Pain During Exercise" hint="Do you feel chest pain when you exercise?">
        <select className="form-select" id="exang" value={form.exang} onChange={e => set('exang', e.target.value)}>
          <option value="">I don't know (Skip)</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </Field>
      <Field label="Heart Rhythm Change (ECG Slope)" hint="How your heart rhythm changes during exercise">
        <select className="form-select" id="slope" value={form.slope} onChange={e => set('slope', e.target.value)}>
          <option value="">I don't know (Skip)</option>
          <option value="0">Improving (Upsloping)</option>
          <option value="1">Unchanged (Flat)</option>
          <option value="2">Worsening (Downsloping)</option>
        </select>
      </Field>
      <Field label="Number of Blocked Blood Vessels" hint="Major vessels highlighted in a scan (0-4)">
        <input className="form-input" id="ca" type="number" placeholder="Unknown (Optional)" min={0} max={4}
          value={form.ca} onChange={e => set('ca', e.target.value)} />
      </Field>
      <Field label="Blood Flow Defect (Thalassemia)" hint="Any known issues with blood oxygen levels?" style={{ gridColumn: 'span 2' }}>
        <select className="form-select" id="thal" value={form.thal} onChange={e => set('thal', e.target.value)}>
          <option value="">I don't know (Skip)</option>
          <option value="0">No defect (Normal)</option>
          <option value="1">Permanent defect (Fixed)</option>
          <option value="2">Temporary defect (Reversible)</option>
          <option value="3">Unknown</option>
        </select>
      </Field>
    </div>,
  ];

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="page-wrapper" style={{ padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
            Cardiovascular <span className="gradient-text">Risk Assessment</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Answer 13 clinical questions — our AI does the rest
          </p>
        </motion.div>

        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            {STEPS.map((s, i) => (
              <span key={i} style={{
                fontSize: '0.78rem', fontWeight: i === step ? 700 : 400,
                color: i <= step ? 'var(--accent-purple)' : 'var(--text-muted)', transition: 'color 0.3s'
              }}>
                {i + 1}. {s}
              </span>
            ))}
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '36px', overflow: 'hidden', minHeight: 280 }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24, color: 'var(--text-secondary)' }}>
                Step {step + 1} — {STEPS[step]}
              </h2>
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Error */}
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ color: '#f87171', fontSize: '0.85rem', marginTop: 12, textAlign: 'center' }}>
            ⚠ {error}
          </motion.p>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button className="btn-secondary" onClick={prev} disabled={step === 0}
            style={{ opacity: step === 0 ? 0.3 : 1 }}>
            ← Back
          </button>

          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={next}>
              Continue →
            </button>
          ) : (
            <button className="btn-primary" onClick={submit} disabled={loading}
              style={{ minWidth: 160, justifyContent: 'center' }}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analysing…</> : '🫀 Get My Risk Score'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
