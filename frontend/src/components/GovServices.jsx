import React, { useState } from 'react';
import { ExternalLink, Shield, Globe, ShoppingBag, Users, FileText, Video, Truck, AlertTriangle, Lock, Briefcase, PhoneCall, Building, Plane, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GovServices = () => {
  const [filter, setFilter] = useState('all');

  const services = [
    {
      title: "Cyber Crime Portal",
      desc: "Report online financial fraud, hacking, and social media harassment anonymously.",
      url: "https://cybercrime.gov.in",
      icon: <Shield size={28} className="text-red-600" />,
      category: "complaint"
    },
    {
      title: "RBI Sachet (Bank Fraud)",
      desc: "Report illegal money collection schemes and financial frauds directly to RBI.",
      url: "https://sachet.rbi.org.in",
      icon: <Landmark size={28} className="text-red-500" />,
      category: "complaint"
    },
    {
      title: "National Consumer Helpline",
      desc: "File complaints against companies for bad products, refund issues, or unfair trade.",
      url: "https://consumerhelpline.gov.in",
      icon: <ShoppingBag size={28} className="text-orange-600" />,
      category: "complaint"
    },
    {
      title: "CPGRAMS (PG Portal)",
      desc: "File complaints against ANY Central Govt Ministry/Department if work is stalled.",
      url: "https://pgportal.gov.in",
      icon: <AlertTriangle size={28} className="text-amber-600" />,
      category: "complaint"
    },
    {
      title: "RERA (Property Issue)",
      desc: "File complaint against builders for delay in possession or false promises.",
      url: "https://rera.example.in",
      icon: <Building size={28} className="text-amber-700" />,
      category: "complaint"
    },
    {
      title: "e-Courts Services",
      desc: "Check Case Status, Court Orders, Judgments, and Hearing Dates for any court.",
      url: "https://services.ecourts.gov.in",
      icon: <FileText size={28} className="text-teal-700" />,
      category: "service"
    },
    {
      title: "e-Challan Parivahan",
      desc: "Check and pay pending traffic fines/challans online without visiting court.",
      url: "https://echallan.parivahan.gov.in",
      icon: <Truck size={28} className="text-slate-700" />,
      category: "service"
    },
    {
      title: "DigiLocker",
      desc: "Legally valid digital storage for Driving License, Marksheets, and PAN Card.",
      url: "https://www.digilocker.gov.in",
      icon: <Lock size={28} className="text-teal-800" />,
      category: "service"
    },
    {
      title: "Passport Seva",
      desc: "Apply for new Passport, renewal, or check application status online.",
      url: "https://www.passportindia.gov.in",
      icon: <Plane size={28} className="text-cyan-700" />,
      category: "service"
    },
    {
      title: "RTI Online",
      desc: "File 'Right to Information' application to demand answers from Govt departments.",
      url: "https://rtionline.gov.in",
      icon: <FileText size={28} className="text-slate-600" />,
      category: "service"
    },
    {
      title: "IP India (Patents)",
      desc: "File patents, trademarks, and designs. Protect your intellectual property.",
      url: "https://ipindia.gov.in",
      icon: <Briefcase size={28} className="text-teal-700" />,
      category: "service"
    },
    {
      title: "NALSA Legal Aid",
      desc: "Free legal aid for eligible citizens. Find your nearest Legal Services Authority.",
      url: "https://nalsa.gov.in",
      icon: <Users size={28} className="text-teal-800" />,
      category: "legal"
    },
    {
      title: "e-Vidhan",
      desc: "Track bills, debates, and legislative work across Indian assemblies.",
      url: "https://neva.gov.in",
      icon: <Video size={28} className="text-slate-700" />,
      category: "legal"
    },
    {
      title: "Childline 1098",
      desc: "Emergency report for child abuse or lost children. Direct POCSO help.",
      url: "https://www.childlineindia.org.in",
      icon: <PhoneCall size={28} className="text-orange-600" />,
      category: "legal"
    }
  ];

  const filteredServices = filter === 'all'
    ? services
    : services.filter(s => s.category === filter);

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 scrollbar-hide bg-background-light dark:bg-bg-deep">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-ink dark:text-white mb-2 tracking-normal flex items-center gap-2.5 md:gap-3 leading-snug">
          <Globe className="text-teal-800 dark:text-teal-300 w-7 h-7 md:w-8 md:h-8 shrink-0" />
          Digital Legal Seva
        </h1>
        <p className="text-ink-mute dark:text-slate-400 text-base md:text-lg max-w-2xl">
          Official government portals for complaints, citizen services, and legal aid.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'all', label: 'All Portals', icon: <Globe size={16} /> },
          { id: 'complaint', label: 'File Complaint', icon: <AlertTriangle size={16} /> },
          { id: 'service', label: 'Citizen Services', icon: <FileText size={16} /> },
          { id: 'legal', label: 'Legal Aid', icon: <Users size={16} /> }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === btn.id
                ? 'bg-ink text-white dark:bg-accent-gold'
                : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-ink-mute dark:text-slate-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            {btn.icon} {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service) => (
            <motion.div
              key={service.title}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="surface-card p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  {service.icon}
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                  service.category === 'complaint' ? 'text-red-700 bg-red-50 dark:bg-red-500/10 dark:text-red-300' :
                  service.category === 'service' ? 'text-teal-800 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-300' :
                  'text-slate-700 bg-slate-100 dark:bg-white/10 dark:text-slate-300'
                }`}>
                  {service.category === 'complaint' ? 'Report' : service.category === 'service' ? 'Service' : 'Help'}
                </span>
              </div>

              <h3 className="font-body text-base md:text-lg font-semibold text-ink dark:text-white mb-2 tracking-normal leading-snug">{service.title}</h3>
              <p className="text-ink-mute dark:text-slate-400 text-sm mb-6 flex-1 leading-relaxed">{service.desc}</p>

              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold"
              >
                Visit Portal <ExternalLink size={16} />
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GovServices;
