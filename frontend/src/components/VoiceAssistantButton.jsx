import React from 'react';
import { Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistantButton = ({ isListening, isProcessing, onClick, disabled }) => {
    const state = isProcessing ? 'processing' : isListening ? 'listening' : 'idle';

    const styles = {
        idle: 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-teal-700/40 hover:text-teal-800 dark:hover:text-teal-300',
        listening: 'bg-teal-700 text-white border-teal-600 shadow-[0_8px_24px_rgba(10,107,99,0.35)]',
        processing: 'bg-ink dark:bg-teal-800 text-white border-ink dark:border-teal-700',
    };

    const labels = {
        idle: 'Voice input',
        listening: 'Listening… tap to stop',
        processing: 'Processing…',
    };

    return (
        <div className="relative inline-flex">
            <AnimatePresence>
                {state === 'listening' && (
                    <motion.span
                        className="absolute inset-0 rounded-xl bg-teal-500/30 pointer-events-none"
                        initial={{ opacity: 0.6, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.35 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={onClick}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.04 } : {}}
                whileTap={!disabled ? { scale: 0.96 } : {}}
                title={labels[state]}
                aria-label={labels[state]}
                className={`relative h-11 w-11 rounded-xl border flex items-center justify-center transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${styles[state]}`}
            >
                {state === 'processing' ? (
                    <motion.span
                        className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                ) : (
                    <Mic size={18} strokeWidth={2.2} />
                )}
            </motion.button>
        </div>
    );
};

export default VoiceAssistantButton;
