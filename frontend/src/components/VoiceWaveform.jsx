import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Voice Waveform Animation Component
 * Shows animated bars when voice assistant is active
 */
const VoiceWaveform = ({ isActive, isProcessing }) => {
    return (
        <AnimatePresence>
            {(isActive || isProcessing) && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center gap-1.5 h-16 px-6 relative"
                >
                    {/* Subtle glow beneath waveform */}
                    <div className={`absolute inset-0 blur-xl opacity-40 rounded-full transition-colors duration-500 ${
                        isProcessing ? 'bg-accent-blue' : 'bg-green-500'
                    }`} />

                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                height: isActive 
                                    ? [
                                        isProcessing ? "40%" : "20%", 
                                        isProcessing ? "100%" : "80%", 
                                        isProcessing ? "30%" : "30%"
                                      ] 
                                    : "10%",
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: isActive ? Infinity : 0,
                                ease: "easeInOut",
                                delay: i * 0.1,
                                repeatType: "mirror"
                            }}
                            className={`w-1.5 rounded-full z-10 transition-colors duration-500 shadow-sm ${
                                isProcessing
                                    ? 'bg-gradient-to-t from-accent-blue via-purple-400 to-accent-cyan'
                                    : 'bg-gradient-to-t from-green-500 via-emerald-400 to-teal-300'
                            }`}
                            style={{ minHeight: '8px' }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VoiceWaveform;
