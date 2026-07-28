import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedJusticeScales from './AnimatedJusticeScales';

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
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
            'radial-gradient(circle at 50% 42%, rgba(10,107,99,0.32), transparent 55%)',
            'radial-gradient(circle at 50% 42%, rgba(18,163,148,0.22), transparent 58%)',
            'radial-gradient(circle at 50% 42%, rgba(10,107,99,0.32), transparent 55%)',
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, scale: 0.78, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16 }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full blur-2xl bg-teal-400/20"
            animate={{ opacity: [0.18, 0.42, 0.18], scale: [0.88, 1.1, 0.88] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <AnimatedJusticeScales className="relative w-40 h-40 md:w-48 md:h-48" color="#E7F7F3" />
        </motion.div>

        <motion.h1
          className="font-display text-3xl md:text-4xl text-white tracking-normal font-semibold mb-8"
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          Nyay Sahayak
        </motion.h1>

        <motion.div
          className="h-0.5 w-28 overflow-hidden rounded-full bg-white/10"
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-teal-600 via-teal-300 to-teal-500"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BootScreen;
