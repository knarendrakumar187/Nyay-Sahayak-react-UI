import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
    { id: 'Citizen', label: 'Citizen' },
    { id: 'Advocate', label: 'Advocate' },
    { id: 'Police', label: 'Police Officer' },
    { id: 'Student', label: 'Law Student' },
    { id: 'Other', label: 'Other' },
];

const AuthPage = ({ handleGoogleLogin, onSelectRole }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const saveRole = (role) => {
        sessionStorage.setItem('pending_role', role);
        onSelectRole?.(role);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Role is required only when creating an account (Sign Up)
        if (!isLogin && !formData.role) {
            setError('Please select your role to create an account.');
            return;
        }

        setLoading(true);

        try {
            if (!isLogin) {
                saveRole(formData.role);

                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match!');
                    setLoading(false);
                    return;
                }

                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }

                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );

                await updateProfile(userCredential.user, {
                    displayName: formData.name
                });
            } else {
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
            }

            navigate('/app');
        } catch (err) {
            console.error('Auth error:', err);
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered. Try logging in.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak. Use at least 6 characters.');
                    break;
                case 'auth/user-not-found':
                    setError('No account found with this email.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                case 'auth/invalid-credential':
                    setError('Invalid email or password.');
                    break;
                default:
                    setError(err.message || 'An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        // New accounts via Google on Sign Up must pick a role first.
        // Login / returning Google users skip role here; app gate asks once if missing.
        if (!isLogin && !formData.role) {
            setError('Please select your role before signing up with Google.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            if (!isLogin && formData.role) {
                saveRole(formData.role);
            }
            await handleGoogleLogin?.();
            navigate('/app');
        } catch (err) {
            setError(err?.message || 'Google sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fieldClass =
        'w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 transition-all text-ink dark:text-white placeholder-slate-400';

    return (
        <div className="min-h-screen bg-background-light dark:bg-bg-deep text-ink dark:text-slate-100 font-body flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(10,107,99,0.14),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(22,50,79,0.12),_transparent_45%)] pointer-events-none" />

            <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-300 hover:text-white transition-colors z-20"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Home</span>
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden shadow-lift">
                            <img src="/logo.png" alt="Nyay Sahayak" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="font-display text-3xl tracking-normal font-semibold text-ink dark:text-white">
                            Nyay Sahayak
                        </h1>
                    </div>
                    <p className="text-ink-mute dark:text-slate-400">
                        {isLogin ? 'Welcome back. Sign in to continue.' : 'Create your account to get started.'}
                    </p>
                </div>

                <div className="surface-card rounded-2xl p-7 md:p-8">
                    <div className="flex gap-1 mb-7 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
                        <button
                            type="button"
                            onClick={() => { setIsLogin(true); setError(''); }}
                            className={`relative flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${isLogin ? 'text-white' : 'text-ink-mute dark:text-slate-400'}`}
                        >
                            <span className="relative z-10">Login</span>
                            {isLogin && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute inset-0 bg-ink dark:bg-accent-gold rounded-lg"
                                    transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                                />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsLogin(false); setError(''); }}
                            className={`relative flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${!isLogin ? 'text-white' : 'text-ink-mute dark:text-slate-400'}`}
                        >
                            <span className="relative z-10">Sign Up</span>
                            {!isLogin && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute inset-0 bg-ink dark:bg-accent-gold rounded-lg"
                                    transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                                />
                            )}
                        </button>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-5"
                            >
                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 rounded-xl text-red-700 dark:text-red-400 text-sm">
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Role only on Sign Up — Login uses saved role; first open uses role gate */}
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div
                                key="role-picker"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-6"
                            >
                                <p className="text-xs font-bold uppercase tracking-wider text-ink-mute dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                    <Shield size={13} className="text-teal-700 dark:text-teal-400" />
                                    Select your role
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {ROLES.map((role) => {
                                        const active = formData.role === role.id;
                                        return (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData((prev) => ({ ...prev, role: role.id }));
                                                    setError('');
                                                }}
                                                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors text-left ${
                                                    active
                                                        ? 'border-teal-600 bg-teal-700 text-white shadow-sm'
                                                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-ink-mute dark:text-slate-300 hover:border-teal-600/50'
                                                }`}
                                            >
                                                {role.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold mb-6 shadow-sm disabled:opacity-60"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="text-gray-800">Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                        <span className="text-sm text-slate-400">or</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        required
                                        className={fieldClass}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email Address"
                                required
                                className={fieldClass}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                required
                                className={`${fieldClass} pr-12`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-ink dark:hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="confirm-password"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm Password"
                                        required
                                        className={fieldClass}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="action-btn w-full mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
