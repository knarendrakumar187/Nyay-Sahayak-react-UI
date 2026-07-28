import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageSquare, Building2, CheckCircle, ArrowRight, Zap, Shield, Scale } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, useScroll, useTransform } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
    hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.7, ease }
    }
};

const HomePage = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        return document.documentElement.classList.contains('dark');
    });
    const { scrollY } = useScroll();
    const scaleY = useTransform(scrollY, [0, 400], [1, 1.08]);
    const orbOpacity = useTransform(scrollY, [0, 300], [1, 0.35]);

    const toggleDarkMode = () => {
        const next = !darkMode;
        document.documentElement.classList.toggle('dark', next);
        document.documentElement.classList.toggle('light', !next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
        setDarkMode(next);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-bg-deep text-ink dark:text-slate-100 font-body transition-colors duration-500">
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <header className="relative min-h-[92vh] flex items-end md:items-center overflow-hidden">
                <motion.div className="absolute inset-0" style={{ opacity: orbOpacity }} aria-hidden="true">
                    <div className="absolute inset-0 bg-[linear-gradient(125deg,#07131C_0%,#0F2A3A_38%,#0A6B63_100%)]" />
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_30%_20%,rgba(94,234,212,0.35),transparent_45%),radial-gradient(ellipse_at_80%_60%,rgba(255,255,255,0.12),transparent_40%)]" />
                    <div className="absolute inset-0 opacity-[0.07]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                    <motion.div
                        className="absolute -right-20 top-[18%] w-[56vw] max-w-[680px] aspect-square rounded-full border border-white/10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute right-[6%] top-[20%] w-[38vw] max-w-[440px] aspect-square rounded-full border border-teal-200/25"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        style={{ scale: scaleY }}
                        className="absolute right-[10%] bottom-[16%] md:bottom-[20%] opacity-30 md:opacity-40 pointer-events-none origin-center"
                    >
                        <Scale className="w-44 h-44 md:w-60 md:h-60 text-white" strokeWidth={0.9} />
                    </motion.div>
                    <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background-light dark:from-bg-deep via-background-light/70 dark:via-bg-deep/70 to-transparent" />
                </motion.div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-28 pb-20 md:pb-28">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } }}
                        className="max-w-2xl"
                    >
                        <motion.p
                            variants={fadeUp}
                            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-normal tracking-normal text-white mb-5 leading-[1.05]"
                        >
                            Nyay Sahayak
                        </motion.p>
                        <motion.h1
                            variants={fadeUp}
                            className="text-xl sm:text-2xl md:text-3xl font-medium text-teal-50/95 leading-snug mb-4"
                        >
                            Legal guidance for every Indian citizen.
                        </motion.h1>
                        <motion.p
                            variants={fadeUp}
                            className="text-base md:text-lg text-slate-300/95 max-w-xl leading-relaxed mb-9"
                        >
                            Ask about the new Bharatiya Nyaya Sanhita (BNS), draft documents, and navigate government services — in the language you speak.
                        </motion.p>
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/login')}
                                className="btn-primary-hero"
                            >
                                Open Legal Assistant
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/chat')}
                                className="btn-ghost-hero"
                            >
                                <Mic className="w-4 h-4" />
                                Try voice
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </header>

            <section id="features" className="scroll-mt-24 py-24 md:py-28 relative">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.35 }}
                        variants={fadeUp}
                        className="max-w-2xl mb-14"
                    >
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-400 mb-3">Capabilities</p>
                        <h2 className="font-display text-3xl md:text-5xl font-normal text-ink dark:text-white tracking-normal mb-4">
                            Built for real legal work
                        </h2>
                        <p className="text-ink-mute dark:text-slate-400 text-lg leading-relaxed">
                            Clear answers grounded in Indian law — without the jargon wall.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                icon: <MessageSquare className="w-6 h-6" />,
                                title: 'Smart Legal Chat',
                                desc: 'Ask about rights, procedures, and remedies. Get structured answers in Hindi, English, or Hinglish.'
                            },
                            {
                                icon: <Building2 className="w-6 h-6" />,
                                title: 'Digital Seva',
                                desc: 'Guided paths for e-Courts, FIR filing, RTI, and government portals — step by step.'
                            },
                            {
                                icon: <Mic className="w-6 h-6" />,
                                title: 'Voice Assistant',
                                desc: 'Speak your question naturally. Hear responses back in the same language.'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: i * 0.1, duration: 0.6, ease }}
                                className="surface-card p-7 md:p-8 group"
                            >
                                <motion.div
                                    whileHover={{ rotate: -6, scale: 1.06 }}
                                    className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700/10 text-teal-800 dark:bg-teal-400/10 dark:text-teal-300"
                                >
                                    {item.icon}
                                </motion.div>
                                <h3 className="font-display text-2xl font-normal text-ink dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-ink-mute dark:text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                                <div className="reveal-line mt-6" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 md:py-28 bg-white/60 dark:bg-white/[0.02] border-y border-slate-200/70 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="max-w-2xl mb-16"
                    >
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-400 mb-3">How it works</p>
                        <h2 className="font-display text-3xl md:text-5xl font-normal text-ink dark:text-white tracking-normal mb-4">
                            Three steps to clarity
                        </h2>
                        <p className="text-ink-mute dark:text-slate-400 text-lg">
                            From question to next action — without waiting weeks for a consultation.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { step: '01', title: 'Ask', desc: 'Type or speak your legal question in any language you prefer.', icon: <MessageSquare className="w-5 h-5" /> },
                            { step: '02', title: 'Understand', desc: 'Receive plain-language guidance based on Indian statutes and process.', icon: <Zap className="w-5 h-5" /> },
                            { step: '03', title: 'Act', desc: 'File reports, draft notices, or open the right government service.', icon: <CheckCircle className="w-5 h-5" /> }
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12, duration: 0.55, ease }}
                                className="relative"
                            >
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
                                    className="font-display text-6xl font-normal text-teal-700/[0.12] dark:text-teal-300/15 absolute -top-5 left-0 select-none"
                                >
                                    {item.step}
                                </motion.span>
                                <div className="relative pt-12">
                                    <div className="mb-4 text-teal-800 dark:text-teal-300">{item.icon}</div>
                                    <h3 className="font-display text-3xl font-normal text-ink dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-ink-mute dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="why-us" className="scroll-mt-24 py-24 md:py-28">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={fadeUp}
                        >
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-400 mb-3">Why us</p>
                            <h2 className="font-display text-3xl md:text-5xl font-normal text-ink dark:text-white tracking-normal mb-5">
                                Why Nyay Sahayak
                            </h2>
                            <p className="text-ink-mute dark:text-slate-400 text-lg leading-relaxed mb-8">
                                Traditional legal help is costly, slow, and intimidating. This assistant is built to make justice more reachable for everyday Indians.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/login')}
                                className="action-btn inline-flex items-center gap-2"
                            >
                                Start free
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </motion.div>

                        <div className="space-y-4">
                            {[
                                { icon: <Shield className="w-5 h-5" />, title: 'Affordable clarity', desc: 'Get direction on common issues without burning savings on a first consult.' },
                                { icon: <Zap className="w-5 h-5" />, title: 'Immediate response', desc: 'Draft templates and procedural guidance in seconds, not weeks.' },
                                { icon: <Scale className="w-5 h-5" />, title: 'Plain-language law', desc: 'BNS sections, rights, and remedies explained in the language you actually use.' }
                            ].map((row, i) => (
                                <motion.div
                                    key={row.title}
                                    initial={{ opacity: 0, x: 28 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease }}
                                    whileHover={{ x: 4 }}
                                    className="flex gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm"
                                >
                                    <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-700/10 text-teal-800 dark:bg-teal-400/10 dark:text-teal-300">
                                        {row.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-ink dark:text-white mb-1">{row.title}</h3>
                                        <p className="text-sm text-ink-mute dark:text-slate-400 leading-relaxed">{row.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;
