import React, { useEffect } from 'react';
import { X, Save, LogOut, User, MapPin, Globe, Shield, Mic, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsModal = ({ user, setUser, onClose, onLogout, theme, setTheme }) => {
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="fixed inset-0 z-[90] flex items-end md:items-stretch md:justify-end bg-black/55 md:bg-[#0a0e1a]/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0.96 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0.96 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="
          relative flex flex-col w-full bg-[#121821] text-slate-100
          rounded-t-2xl md:rounded-none
          h-[min(92dvh,100%)] md:h-full md:max-w-md
          border-t border-white/10 md:border-t-0 md:border-l
          shadow-2xl
          md:hidden
        "
      >
        <div className="mx-auto mt-3 mb-1 h-1.5 w-10 rounded-full bg-white/20 shrink-0" aria-hidden />
        <SettingsContent
          user={user}
          setUser={setUser}
          theme={theme}
          setTheme={setTheme}
          onClose={onClose}
          onLogout={onLogout}
          handleChange={handleChange}
        />
      </motion.div>

      {/* Desktop: slide from right, short tween (no spring) */}
      <motion.div
        initial={{ x: 28, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 28, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="
          relative hidden md:flex flex-col w-full max-w-md h-full
          bg-[#121821] text-slate-100 border-l border-white/10 shadow-2xl
        "
      >
        <SettingsContent
          user={user}
          setUser={setUser}
          theme={theme}
          setTheme={setTheme}
          onClose={onClose}
          onLogout={onLogout}
          handleChange={handleChange}
        />
      </motion.div>
    </motion.div>
  );
};

function SettingsContent({ user, setUser, theme, setTheme, onClose, onLogout, handleChange }) {
  return (
    <>
      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center shrink-0">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2.5">
          <span className="p-2 bg-teal-700/15 rounded-lg border border-teal-500/20">
            <User size={18} className="text-teal-300" />
          </span>
          Profile Settings
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-2.5 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close settings"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-5 py-5 space-y-5 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-teal-500/40 p-1 bg-[#0B121A]">
            {user.photo ? (
              <img
                src={user.photo}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold text-slate-300">
                {user.name?.[0] || 'U'}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 flex items-center gap-1.5">
              <Shield size={14} className="text-sky-400" /> Role
            </label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-200 outline-none appearance-none"
            >
              <option value="Citizen">Citizen</option>
              <option value="Advocate">Advocate</option>
              <option value="Police">Police Officer</option>
              <option value="Student">Law Student</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 flex items-center gap-1.5">
              <Globe size={14} className="text-cyan-400" /> Language
            </label>
            <select
              name="language"
              value="English"
              disabled
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-200 outline-none appearance-none opacity-80 cursor-not-allowed"
            >
              <option value="English">English</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 flex items-center gap-1.5">
            <MapPin size={14} className="text-red-400" /> Location (State Laws)
          </label>
          <select
            name="state"
            value={user.state}
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-200 outline-none appearance-none"
          >
            <option value="India (General)">India (General Central Laws)</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 flex items-center gap-1.5">
            <Shield size={14} className="text-violet-400" /> Detail Level
          </label>
          <select
            name="detailLevel"
            value={user.detailLevel || 'moderate'}
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-200 outline-none appearance-none"
          >
            <option value="simple">Simple - Layman terms</option>
            <option value="moderate">Moderate - Balanced detail</option>
            <option value="technical">Technical - Full legal jargon</option>
          </select>
        </div>

        <div className="space-y-3 pt-2">
          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.03]">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-slate-200 font-semibold flex items-center gap-2">
                {theme === 'dark' ? <Moon size={18} className="text-sky-400" /> : <Sun size={18} className="text-emerald-400" />}
                Theme
              </label>
              <div className="flex gap-1 p-1 bg-black/40 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${theme === 'light' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border border-white/10 rounded-xl bg-white/[0.03]">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-slate-200 font-semibold flex items-center gap-2">
                <Mic size={18} className="text-teal-400" />
                Voice Assistant
              </label>
              <button
                type="button"
                onClick={() => setUser({ ...user, voiceAssistantEnabled: !user.voiceAssistantEnabled })}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${user.voiceAssistantEnabled ? 'bg-teal-600' : 'bg-slate-700'}`}
                aria-pressed={!!user.voiceAssistantEnabled}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${user.voiceAssistantEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-white/10 flex justify-between items-center gap-3 shrink-0 bg-[#0E141C]">
        <button
          type="button"
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-semibold text-sm"
        >
          <LogOut size={16} /> Log Out
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-700 text-white font-semibold text-sm"
        >
          <Save size={18} /> Save Profile
        </button>
      </div>
    </>
  );
}

export default SettingsModal;
