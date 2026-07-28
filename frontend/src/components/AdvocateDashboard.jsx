import React, { useState } from 'react';
import { Upload, Clock, FolderOpen, AlertTriangle, FileText, Crosshair } from 'lucide-react';
import { useLegalAI } from '../hooks/useLegalAI';

const AdvocateDashboard = () => {
  const { analyzeDossier, loading } = useLegalAI();
  const [data, setData] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await analyzeDossier(file);
      if (result) setData(result);
    }
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 relative group cursor-pointer">
          <div className="absolute inset-0 bg-accent-gold blur-[30px] opacity-20 group-hover:opacity-40 transition"></div>
          <Upload className="w-10 h-10 text-accent-gold relative z-10" />
        </div>
        <h2 className="text-3xl font-bold font-legal text-white mb-2 tracking-widest">ADVOCATE'S CONSOLE</h2>
        <p className="text-sm text-slate-400 max-w-md mb-8 tracking-wide font-tech">SECURE UPLINK ESTABLISHED. UPLOAD CASE DOSSIER FOR ANALYSIS.</p>
        
        <label className="px-10 py-4 cursor-pointer action-btn rounded text-xs tracking-[0.2em] flex items-center gap-3">
          <input type="file" className="hidden" onChange={handleUpload} accept=".pdf" />
          {loading ? "SCANNING..." : "UPLOAD CASE FILE"}
        </label>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in pb-40">
      {/* Header */}
      <div className="glass-panel p-6 rounded-xl flex justify-between items-center border-l-4 border-accent-gold">
        <div>
          <h2 className="text-2xl font-bold font-legal text-white tracking-wide">{data.case_title || "CASE FILE"}</h2>
          <p className="text-xs text-accent-cyan mt-1 font-mono tracking-widest">{data.case_details}</p>
        </div>
        <button className="px-6 py-3 bg-red-600/20 border border-red-500 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition flex items-center gap-2">
          <Crosshair className="w-4 h-4" /> Deep Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Timeline */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-xs font-bold text-accent-cyan mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <Clock className="w-4 h-4" /> Chronology
          </h3>
          <div className="space-y-4">
            {data.timeline?.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="text-xs text-accent-gold font-mono w-20 pt-1">{item.date}</div>
                <div className="text-sm text-slate-200 border-l border-white/10 pl-4 pb-4 relative">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-cyan"></div>
                  <span className={item.highlight ? "text-accent-gold font-bold" : ""}>{item.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Docs */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-xs font-bold text-accent-cyan mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <FolderOpen className="w-4 h-4" /> Evidence Locker
          </h3>
          <div className="space-y-3">
            {data.documents?.map((doc, idx) => (
              <div key={idx} className={`flex justify-between items-center p-3 rounded border ${doc.status === 'Missing' ? 'bg-red-900/10 border-red-500/30' : 'bg-white/5 border-white/5'}`}>
                <span className="text-sm text-slate-300 flex items-center gap-2"><FileText className="w-3 h-3" /> {doc.name}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${doc.status === 'Missing' ? 'bg-red-500 text-black' : 'bg-green-500/20 text-green-400'}`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="glass-panel p-6 rounded-xl border border-accent-danger/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-accent-danger animate-scan"></div>
        <h3 className="text-xs font-bold text-accent-danger mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Critical Weakness Detected
        </h3>
        <ul className="space-y-3">
          {data.opposition_analysis?.map((point, idx) => (
            <li key={idx} className="bg-white/5 p-3 rounded border-l-2 border-accent-danger text-sm text-slate-300">
              <strong className="text-accent-danger block text-xs uppercase mb-1">{point.type}</strong>
              {point.point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdvocateDashboard;