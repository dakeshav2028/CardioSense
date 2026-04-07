// components/AlertBanner.jsx
import { motion } from 'framer-motion';

export default function AlertBanner({ message }) {
  if (!message) return null;
  return (
    <motion.div
      className="alert-critical"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="alert-icon">🚨</div>
      <div>
        <p style={{ fontWeight: 700, color: '#ef4444', fontSize: '1rem', marginBottom: 4 }}>
          Critical Risk Alert
        </p>
        <p style={{ color: '#fca5a5', fontSize: '0.9rem' }}>{message}</p>
      </div>
    </motion.div>
  );
}
