import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Github } from 'lucide-react';

const GITHUB_URL = 'https://github.com/knarendrakumar187/Nyay-Sahayak-react-UI';

const Footer = () => {
    return (
        <footer id="contact" className="relative bg-ink text-slate-300 pt-20 pb-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.18),_transparent_55%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-xl overflow-hidden">
                                <img src="/logo.png" alt="Nyay Sahayak" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-display font-semibold text-2xl text-white">
                                Nyay Sahayak
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
                            Making justice accessible, affordable, and understandable for every Indian citizen through AI-powered legal assistance.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Shield className="w-4 h-4 text-teal-400" />
                                <span>256-bit Encryption</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Lock className="w-4 h-4 text-teal-400" />
                                <span>Secure & Private</span>
                            </div>
                            <a
                                href={GITHUB_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 text-sm text-slate-400 hover:text-teal-300 transition-colors"
                            >
                                <Github className="w-4 h-4 text-teal-400" />
                                <span>View on GitHub</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-display font-semibold text-white mb-5 text-lg">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Features', href: '#features' },
                                { name: 'Why Choose Us', href: '#why-us' },
                                { name: 'Get Started', href: '/login', isLink: true },
                                { name: 'GitHub', href: GITHUB_URL, isExternal: true },
                            ].map((link) => (
                                <li key={link.name}>
                                    {link.isExternal ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-slate-400 hover:text-teal-300 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    ) : link.isLink ? (
                                        <Link to={link.href} className="text-sm text-slate-400 hover:text-teal-300 transition-colors">
                                            {link.name}
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const el = document.getElementById(link.href.replace('#', ''));
                                                if (!el) return;
                                                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                                                window.scrollTo({ top, behavior: 'smooth' });
                                            }}
                                            className="text-sm text-slate-400 hover:text-teal-300 transition-colors"
                                        >
                                            {link.name}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                    <p className="text-sm text-slate-500 text-center">
                        © {new Date().getFullYear()} Nyay Sahayak. All rights reserved. Built for India.
                    </p>
                    <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-300 transition-colors"
                    >
                        <Github className="w-3.5 h-3.5" />
                        Source code
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
