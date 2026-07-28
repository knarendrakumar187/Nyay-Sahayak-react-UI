import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';

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
                        </div>
                    </div>

                    <div>
                        <h4 className="font-display font-semibold text-white mb-5 text-lg">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Features', href: '#features' },
                                { name: 'Why Choose Us', href: '#how-it-works' },
                                { name: 'Get Started', href: '/login', isLink: true },
                            ].map((link) => (
                                <li key={link.name}>
                                    {link.isLink ? (
                                        <Link to={link.href} className="text-sm text-slate-400 hover:text-teal-300 transition-colors">
                                            {link.name}
                                        </Link>
                                    ) : (
                                        <a href={link.href} className="text-sm text-slate-400 hover:text-teal-300 transition-colors">
                                            {link.name}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8">
                    <p className="text-sm text-slate-500 text-center">
                        © {new Date().getFullYear()} Nyay Sahayak. All rights reserved. Built for India.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
