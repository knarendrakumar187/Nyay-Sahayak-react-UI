import React from 'react';
import { X, Save, LogOut, User, MapPin, Globe, Shield, Mic, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsModal = ({ user, setUser, onClose, onLogout, theme, setTheme }) => {

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0a0e1a]/80 backdrop-blur-md z-[90] flex justify-end"
        onClick={onClose}
      >
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-bg-panel backdrop-blur-xl border-l border-white/10 w-full max-w-md h-full max-h-[100dvh] shadow-2xl flex flex-col relative overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
              <div className="p-2 bg-accent-gold/10 rounded-lg border border-accent-gold/20">
                <User size={20} className="text-accent-gold" />
              </div>
              Profile Settings
            </h2>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-hide relative z-10">
            
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-accent-gold rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="w-24 h-24 rounded-full border-2 border-accent-gold/50 p-1 relative bg-bg-deep">
                  {user.photo ? (
                    <img src={user.photo} alt="Profile" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-slate-300">
                      {user.name[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-200 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 outline-none transition-all shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 flex items-center gap-1.5">
                    <Shield size={14} className="text-accent-blue" /> Role
                  </label>
                  <select
                    name="role"
                    value={user.role}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-200 focus:border-accent-gold outline-none shadow-inner appearance-none"
                  >
                    <option value="Citizen">Citizen</option>
                    <option value="Advocate">Advocate</option>
                    <option value="Police">Police Officer</option>
                    <option value="Student">Law Student</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 flex items-center gap-1.5">
                    <Globe size={14} className="text-accent-cyan" /> Language
                  </label>
                  <select
                    name="language"
                    value="English"
                    disabled
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-200 outline-none shadow-inner appearance-none opacity-80 cursor-not-allowed"
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
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-200 focus:border-accent-gold outline-none shadow-inner appearance-none"
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
                  <Shield size={14} className="text-purple-400" /> Detail Level
                </label>
                <select
                  name="detailLevel"
                  value={user.detailLevel || 'moderate'}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-200 focus:border-accent-gold outline-none shadow-inner appearance-none"
                >
                  <option value="simple">Simple - Layman terms</option>
                  <option value="moderate">Moderate - Balanced detail</option>
                  <option value="technical">Technical - Full legal jargon</option>
                </select>
                <p className="text-xs text-slate-500 mt-2 ml-1">Controls how complex AI explanations are</p>
              </div>

              <div className="h-px bg-white/10 w-full my-6" />

              {/* Toggles & Preferences */}
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-accent-blue/5 to-purple-600/5 border border-white/5 hover:border-accent-blue/30 transition-colors rounded-xl group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <label className="text-sm text-slate-200 font-bold flex items-center gap-2">
                      {theme === 'dark' ? <Moon size={18} className="text-accent-blue" /> : <Sun size={18} className="text-emerald-400" />}
                      Theme Preference
                    </label>
                    <div className="flex gap-1 p-1 bg-black/40 rounded-lg border border-white/10">
                      <button
                        onClick={() => setTheme('light')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${theme === 'light' ? 'bg-emerald-400 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${theme === 'dark' ? 'bg-accent-blue text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed relative z-10">
                    Choose your preferred color scheme.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-accent-gold/5 to-emerald-600/5 border border-white/5 hover:border-accent-gold/30 transition-colors rounded-xl group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <label className="text-sm text-slate-200 font-bold flex items-center gap-2">
                      <Mic size={18} className="text-accent-gold" />
                      Voice Assistant
                    </label>
                    <button
                      onClick={() => setUser({ ...user, voiceAssistantEnabled: !user.voiceAssistantEnabled })}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 ${user.voiceAssistantEnabled ? 'bg-accent-gold' : 'bg-slate-700'}`}
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ${user.voiceAssistantEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed relative z-10">
                    Enable hands-free control. Say <span className="text-accent-gold font-bold">"Hey Sahayak"</span> to activate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/10 bg-black/20 flex justify-between items-center gap-4 relative z-10 backdrop-blur-md">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all font-bold text-sm"
            >
              <LogOut size={16} /> Log Out
            </button>

            <button
              onClick={onClose}
              className="action-btn flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(245,197,66,0.3)]"
            >
              <Save size={18} /> Save Profile
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;