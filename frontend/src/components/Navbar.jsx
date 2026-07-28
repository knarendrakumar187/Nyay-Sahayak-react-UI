import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (v) => {
        setScrolled(v > 24);
    });

    useEffect(() => {
        if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Why Choose Us', href: '#why-us' },
    ];

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
    };

    const scrollToSection = (href) => {
        closeMenu();
        const id = href.replace('#', '');
        // Wait until menu unmounts / overflow unlocks, then scroll
        window.setTimeout(() => {
            const el = document.getElementById(id);
            if (!el) return;
            const navOffset = 80;
            const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        }, 80);
    };

    return (
        <motion.nav
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 z-50 w-full transition-all duration-500 ${
                scrolled
                    ? 'border-b border-white/10 bg-[#07131C]/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)]'
                    : 'border-b border-transparent bg-[#07131C]/55 backdrop-blur-xl'
            }`}
        >
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
                <div className="flex justify-between items-center h-[4.25rem]">
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.06, rotate: -3 }}
                            className="w-9 h-9 rounded-lg overflow-hidden"
                        >
                            <img src="/logo.png" alt="Nyay Sahayak" className="w-full h-full object-cover" />
                        </motion.div>
                        <span className="font-display text-xl tracking-normal font-semibold text-white group-hover:text-teal-100 transition-colors">
                            Nyay Sahayak
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                type="button"
                                className="relative px-4 py-2 text-sm font-semibold text-white/90 hover:text-white transition-colors group"
                                onClick={() => scrollToSection(link.href)}
                            >
                                {link.name}
                                <span className="absolute left-4 right-4 bottom-1 h-0.5 origin-left scale-x-0 bg-teal-300 transition-transform duration-300 group-hover:scale-x-100" />
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={toggleDarkMode}
                            className="p-2.5 rounded-xl border border-white/35 bg-white/15 text-white shadow-sm hover:bg-white/25 hover:border-white/50 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={darkMode ? 'sun' : 'moon'}
                                    initial={{ opacity: 0, rotate: -40, y: 4 }}
                                    animate={{ opacity: 1, rotate: 0, y: 0 }}
                                    exit={{ opacity: 0, rotate: 40, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="block"
                                >
                                    {darkMode ? <Sun className="w-5 h-5 text-amber-300" strokeWidth={2.25} /> : <Moon className="w-5 h-5 text-white" strokeWidth={2.25} />}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/login')}
                            className="hidden sm:inline-flex items-center rounded-xl bg-white text-ink px-5 py-2.5 text-sm font-semibold hover:bg-teal-50 transition-colors"
                        >
                            Start for Free
                        </motion.button>

                        <button
                            type="button"
                            className="md:hidden p-2.5 text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden border-t border-white/10 bg-[#07131C] overflow-hidden"
                    >
                        <div className="px-5 py-4 space-y-1 flex flex-col">
                            {navLinks.map((link, i) => (
                                <motion.button
                                    key={link.name}
                                    type="button"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                    onClick={() => scrollToSection(link.href)}
                                    className="block w-full text-left px-3 py-3.5 rounded-lg text-base font-semibold text-white bg-white/5 active:bg-white/15"
                                >
                                    {link.name}
                                </motion.button>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    closeMenu();
                                    navigate('/login');
                                }}
                                className="mt-3 w-full rounded-xl bg-white text-ink px-5 py-3 font-semibold"
                            >
                                Start for Free
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
