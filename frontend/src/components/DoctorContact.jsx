import { motion } from 'framer-motion';

export default function DoctorContact({ score, level }) {
  let title = "";
  let message = "";
  let icon = "";
  let color = "";

  const l = (level || '').toUpperCase();

  if (l === 'CRITICAL' || l === 'HIGH') {
    title = "Seek Medical Attention";
    message = l === 'CRITICAL' 
      ? "Your risk profile is critical. We strongly recommend contacting a healthcare provider or visiting an emergency room immediately."
      : "Your risk profile is high. Please schedule an appointment with a cardiologist or your primary care physician as soon as possible.";
    icon = "🚨";
    color = "#ef4444"; // red
  } else if (l === 'MODERATE') {
    title = "Consult Your Doctor";
    message = "Your risk profile is moderate. It's a good idea to discuss these results with your doctor during your next routine checkup to explore preventative measures.";
    icon = "🩺";
    color = "#f59e0b"; // yellow
  } else {
    title = "Continue Healthy Habits";
    message = "Your risk profile is low. There is no immediate need to contact a doctor regarding these specific metrics. Keep up your healthy lifestyle!";
    icon = "👍";
    color = "#10b981"; // green
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>
          Should I contact a doctor?
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Based on your cardiovascular risk level
        </p>
      </div>

      <div style={{ 
        background: `rgba(${color === '#ef4444' ? '239,68,68' : color === '#f59e0b' ? '245,158,11' : '16,185,129'}, 0.06)`, 
        border: `1px solid rgba(${color === '#ef4444' ? '239,68,68' : color === '#f59e0b' ? '245,158,11' : '16,185,129'}, 0.15)`, 
        borderRadius: 12, padding: '24px 20px', flex: 1, display: 'flex', gap: '16px', alignItems: 'flex-start' 
      }}>
        <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{icon}</div>
        <div>
          <h4 style={{ color: color, fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>{title}</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
