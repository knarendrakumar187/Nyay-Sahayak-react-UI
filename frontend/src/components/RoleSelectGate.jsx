import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = [
  { id: 'Citizen', label: 'Citizen', desc: 'Legal help, IPC↔BNS mapping, and citizen services' },
  { id: 'Advocate', label: 'Advocate', desc: 'Drafts, case help, and legal research' },
  { id: 'Police', label: 'Police Officer', desc: 'FIR guidance and procedure support' },
  { id: 'Student', label: 'Law Student', desc: 'Learn BNS concepts and case law' },
  { id: 'Other', label: 'Other', desc: 'Full access — chat, FIR, quiz, mapping, and services' },
];

const RoleSelectGate = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#07131C]/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#121821] border border-slate-200 dark:border-white/10 shadow-2xl p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-gate-title"
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span className="p-2 rounded-lg bg-teal-700/10 border border-teal-700/20">
            <Shield size={18} className="text-teal-800 dark:text-teal-300" />
          </span>
          <h2 id="role-gate-title" className="text-xl font-semibold text-ink dark:text-white">
            Choose your role
          </h2>
        </div>
        <p className="text-sm text-ink-mute dark:text-slate-400 mb-5">
          Choose a role to personalize your tools. You can change this anytime in Profile Settings.
        </p>
        <div className="space-y-2">
          {ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelect(role.id)}
              className="w-full text-left rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3.5 hover:border-teal-600 hover:bg-teal-700/10 dark:hover:border-teal-400/50 transition-colors"
            >
              <p className="font-semibold text-ink dark:text-white">{role.label}</p>
              <p className="text-xs text-ink-mute dark:text-slate-400 mt-0.5">{role.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelectGate;
