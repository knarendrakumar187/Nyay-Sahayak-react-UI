import React, { useId } from 'react';
import { motion } from 'framer-motion';

/**
 * Logo-matched scales of justice.
 * Beam tilts; pans rise/fall and stay upright (professional mechanical motion).
 */
const AnimatedJusticeScales = ({ className = 'w-40 h-40', color = '#E8F5F2' }) => {
  const uid = useId().replace(/:/g, '');
  const duration = 2.8;
  const ease = 'easeInOut';
  const tilt = 9;

  return (
    <svg
      viewBox="0 0 240 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id={`glow-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0A6B63" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* —— Static stand —— */}
      <g fill={color} filter={`url(#glow-${uid})`}>
        {/* Tiered curved base */}
        <path d="M72 186c0-4 8-7 48-7s48 3 48 7c0 3-8 6-48 6s-48-3-48-6z" />
        <path d="M80 178c4-6 16-10 40-10s36 4 40 10c-6 3-18 5-40 5s-34-2-40-5z" />
        <path d="M92 170c3-4 10-6 28-6s25 2 28 6c-4 2-12 3.5-28 3.5S96 172 92 170z" />

        {/* Pillar */}
        <path d="M114 78h12v92c0 2-2.5 3.5-6 3.5s-6-1.5-6-3.5V78z" />
        {/* Fulcrum / tip above beam */}
        <path d="M120 52l8 18h-16l8-18z" />
        <circle cx="120" cy="72" r="8" />
      </g>

      {/* —— Tilting beam + hanging pans —— */}
      <motion.g
        animate={{ rotate: [-tilt, tilt, -tilt] }}
        transition={{ duration, repeat: Infinity, ease }}
        style={{ transformOrigin: '120px 72px', transformBox: 'view-box' }}
      >
        {/* Upswept curved beam (logo style) */}
        <path
          fill={color}
          d="M18 78
             C40 48, 78 40, 120 40
             C162 40, 200 48, 222 78
             C218 82, 210 78, 200 68
             C175 48, 145 46, 120 46
             C95 46, 65 48, 40 68
             C30 78, 22 82, 18 78Z"
        />
        {/* Beam tip accents */}
        <path fill={color} d="M14 76l10 2-6 8-4-10z" />
        <path fill={color} d="M226 76l-10 2 6 8 4-10z" />

        {/* Left pan: counter-rotate + bob down when left side is heavy */}
        <motion.g
          animate={{ rotate: [tilt, -tilt, tilt] }}
          transition={{ duration, repeat: Infinity, ease }}
          style={{ transformOrigin: '28px 74px', transformBox: 'view-box' }}
        >
          {/* 3 suspension lines */}
          <line x1="28" y1="74" x2="8" y2="118" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
          <line x1="28" y1="74" x2="28" y2="120" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
          <line x1="28" y1="74" x2="48" y2="118" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
          <motion.g animate={{ y: [0, 10, 0] }} transition={{ duration, repeat: Infinity, ease }}>
            <path fill={color} d="M4 118h48c1 0 2 1 2 2.5 0 14-11 26-26 26S2 134.5 2 120.5C2 119 3 118 4 118z" />
            <ellipse cx="28" cy="118" rx="24" ry="3.5" fill={color} />
          </motion.g>
        </motion.g>

        {/* Right pan: opposite bob */}
        <motion.g
          animate={{ rotate: [tilt, -tilt, tilt] }}
          transition={{ duration, repeat: Infinity, ease }}
          style={{ transformOrigin: '212px 74px', transformBox: 'view-box' }}
        >
          <line x1="212" y1="74" x2="192" y2="118" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
          <line x1="212" y1="74" x2="212" y2="120" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
          <line x1="212" y1="74" x2="232" y2="118" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
          <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration, repeat: Infinity, ease }}>
            <path fill={color} d="M188 118h48c1 0 2 1 2 2.5 0 14-11 26-26 26s-26-12-26-26.5c0-1.5 1-2.5 2-2.5z" />
            <ellipse cx="212" cy="118" rx="24" ry="3.5" fill={color} />
          </motion.g>
        </motion.g>
      </motion.g>
    </svg>
  );
};

export default AnimatedJusticeScales;
