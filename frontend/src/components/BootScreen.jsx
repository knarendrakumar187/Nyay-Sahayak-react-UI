import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#07131C] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.45 } }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 50% 45%, rgba(10,107,99,0.28), transparent 55%)',
            'radial-gradient(circle at 50% 45%, rgba(18,163,148,0.22), transparent 58%)',
            'radial-gradient(circle at 50% 45%, rgba(10,107,99,0.28), transparent 55%)',
          ]
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="w-16 h-16 mb-5 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(10,107,99,0.35)]"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 16 }}
        >
          <img src="/logo.png" alt="Nyay Sahayak" className="w-full h-full object-cover" />
        </motion.div>

        <motion.h1
          className="font-display text-3xl md:text-4xl text-white tracking-tight mb-8"
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          Nyay Sahayak
        </motion.h1>

        <motion.div
          className="h-0.5 w-28 overflow-hidden rounded-full bg-white/10"
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-teal-600 via-teal-300 to-teal-500"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BootScreen;
