import React, { useState } from 'react';
import { X, FileText, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DocGenModal = ({ onGenerate, onClose }) => {
  const [formData, setFormData] = useState({
    landlord: '',
    tenant: '',
    rent: '',
    address: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    if(!formData.landlord || !formData.tenant) {
      alert("Please fill in required details");
      return;
    }
    setLoading(true);
    try {
      const blob = await onGenerate(formData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rent_Agreement_${formData.tenant}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      onClose();
    } catch (e) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0e1a]/80 backdrop-blur-md p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass-panel w-full max-w-[500px] p-8 rounded-2xl border-t-4 border-t-accent-gold shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-[50px] pointer-events-none" />

          <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10 relative z-10">
            <h2 className="text-xl font-bold font-legal text-white tracking-widest flex items-center gap-3">
              <div className="p-2 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20">
                <FileText className="text-accent-cyan w-5 h-5" />
              </div>
              RENT AGREEMENT
            </h2>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-5 relative z-10">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Landlord Name</label>
              <input id="landlord" value={formData.landlord} onChange={handleChange} placeholder="e.g. Ramesh Kumar" className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 transition-all shadow-inner" />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Tenant Name</label>
              <input id="tenant" value={formData.tenant} onChange={handleChange} placeholder="e.g. Suresh Singh" className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 transition-all shadow-inner" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Monthly Rent (₹)</label>
                <input id="rent" type="number" value={formData.rent} onChange={handleChange} placeholder="15000" className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 transition-all shadow-inner" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Agreement Date</label>
                <input id="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-slate-300 outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 transition-all shadow-inner [color-scheme:dark]" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1">Property Address</label>
              <input id="address" value={formData.address} onChange={handleChange} placeholder="Full address of the property" className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 transition-all shadow-inner" />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full py-4 action-btn rounded-xl mt-8 text-sm font-bold tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5" />}
              {loading ? "GENERATING DOCUMENT..." : "GENERATE & DOWNLOAD"}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocGenModal;