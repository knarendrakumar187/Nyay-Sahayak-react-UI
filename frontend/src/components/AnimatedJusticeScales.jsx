import React from 'react';
import { motion } from 'framer-motion';

/**
 * Scales of justice with a tilting beam and pans that rise/fall.
 * Pans counter-rotate so they stay upright.
 */
const AnimatedJusticeScales = ({ className = 'w-40 h-40', color = '#E8F5F2' }) => {
  const duration = 2.5;
  const ease = 'easeInOut';
  const tilt = 8;

  return (
    <svg
      viewBox="0 0 200 168"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0A6B63" floodOpacity="0.45" />
        </filter>
      </defs>

      <g fill={color} filter="url(#softGlow)">
        {/* Base */}
        <ellipse cx="100" cy="158" rx="22" ry="5" opacity="0.9" />
        <path d="M82 152h36c2 0 3.5 1.4 3.5 3.2S120 158.5 118 158.5H82c-2 0-3.5-1.5-3.5-3.3S80 152 82 152z" />

        {/* Pillar */}
        <rect x="95.5" y="62" width="9" height="90" rx="2.5" />
        <circle cx="100" cy="58" r="7" />
        <path d="M100 46l5 10h-10l5-10z" />
      </g>

      {/* Tilting beam + pans */}
      <motion.g
        animate={{ rotate: [-tilt, tilt, -tilt] }}
        transition={{ duration, repeat: Infinity, ease }}
        style={{ transformOrigin: '100px 58px', transformBox: 'view-box' }}
      >
        {/* Beam */}
        <path
          d="M24 60c20-12 48-16 76-16s56 4 76 16c1 .5 1 2 0 2.5-20 12-48 16-76 16s-56-4-76-16c-1-.5-1-2 0-2.5z"
          fill={color}
        />
        <rect x="20" y="56" width="10" height="10" rx="2.5" fill={color} />
        <rect x="170" y="56" width="10" height="10" rx="2.5" fill={color} />

        {/* Left strings + pan */}
        <motion.g
          animate={{ rotate: [tilt, -tilt, tilt] }}
          transition={{ duration, repeat: Infinity, ease }}
          style={{ transformOrigin: '25px 61px', transformBox: 'view-box' }}
        >
          <line x1="25" y1="61" x2="8" y2="98" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="25" y1="61" x2="42" y2="98" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          <motion.g animate={{ y: [0, 8, 0] }} transition={{ duration, repeat: Infinity, ease }}>
            <path d="M2 98h46c0 15-10 28-23 28S2 113 2 98z" fill={color} />
            <rect x="4" y="95" width="42" height="5" rx="2" fill={color} />
          </motion.g>
        </motion.g>

        {/* Right strings + pan */}
        <motion.g
          animate={{ rotate: [tilt, -tilt, tilt] }}
          transition={{ duration, repeat: Infinity, ease }}
          style={{ transformOrigin: '175px 61px', transformBox: 'view-box' }}
        >
          <line x1="175" y1="61" x2="158" y2="98" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="175" y1="61" x2="192" y2="98" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration, repeat: Infinity, ease }}>
            <path d="M152 98h46c0 15-10 28-23 28s-23-13-23-28z" fill={color} />
            <rect x="154" y="95" width="42" height="5" rx="2" fill={color} />
          </motion.g>
        </motion.g>
      </motion.g>
    </svg>
  );
};

export default AnimatedJusticeScales;
