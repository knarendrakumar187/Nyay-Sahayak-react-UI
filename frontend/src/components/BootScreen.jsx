import React, { useEffect } from 'react';
import { Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const BootScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1600);
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
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Stacked layer symbol animation */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ zIndex: 3 - i }}
              initial={{ opacity: 0, y: 18 + i * 6, scale: 0.82 }}
              animate={{
                opacity: [0.35, 1, 0.55],
                y: [14 + i * 8, -4 - i * 10, 14 + i * 8],
                scale: [0.88, 1, 0.88],
              }}
              transition={{
                duration: 1.35,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.16,
              }}
            >
              <div
                className="rounded-xl border border-teal-300/40 bg-teal-700/25 backdrop-blur-sm p-3 shadow-[0_8px_28px_rgba(10,107,99,0.35)]"
                style={{ width: 56 - i * 4, height: 56 - i * 4 }}
              >
                <Layers
                  className="w-full h-full text-teal-200"
                  strokeWidth={1.6}
                />
              </div>
            </motion.div>
          ))}
        </div>

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
