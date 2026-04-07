// components/Navbar.jsx
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavLink to="/" className="navbar-brand">
        <div className="heart-logo">🫀</div>
        CardioSense
      </NavLink>

      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/predict"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Assess Risk
        </NavLink>
        <NavLink to="/predict" className="btn-primary" style={{ padding: '8px 22px', fontSize: '0.875rem' }}>
          Start Assessment →
        </NavLink>
      </div>
    </motion.nav>
  );
}
