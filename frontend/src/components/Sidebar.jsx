import React, { useEffect, useState, useRef } from 'react';
import { Settings, History, ChevronRight, X, ChevronLeft, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { getMenuForRole } from '../config/roleAccess';

const Sidebar = ({ mode, setMode, user, onOpenSettings, onLoadChat, isOpen, onClose }) => {
    const [history, setHistory] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [renameModal, setRenameModal] = useState({ open: false, chatId: null, currentTitle: '' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, chatId: null });
    const menuRef = useRef(null);

    const getInitials = (name) => {
        return name && name.length > 0 ? name.charAt(0).toUpperCase() : "U";
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchHistory = async () => {
        if (!auth.currentUser) return;

        try {
            const q = query(
                collection(db, "chats"),
                where("userId", "==", auth.currentUser.email),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(q);
            const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setHistory(chats);
        } catch (error) {
            console.log("History Error:", error);
        }
    };

    useEffect(() => {
        if (auth.currentUser) fetchHistory();
    }, [mode, user]);

    // Handle delete chat
    const handleDeleteChat = async (chatId) => {
        try {
            await deleteDoc(doc(db, "chats", chatId));
            setHistory(history.filter(chat => chat.id !== chatId));
            setDeleteConfirm({ open: false, chatId: null });
            setActiveMenu(null);
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    // Handle rename chat
    const handleRenameChat = async () => {
        if (!renameModal.chatId || !renameModal.currentTitle.trim()) return;

        try {
            await updateDoc(doc(db, "chats", renameModal.chatId), {
                title: renameModal.currentTitle.trim()
            });
            setHistory(history.map(chat =>
                chat.id === renameModal.chatId
                    ? { ...chat, title: renameModal.currentTitle.trim() }
                    : chat
            ));
            setRenameModal({ open: false, chatId: null, currentTitle: '' });
            setActiveMenu(null);
        } catch (error) {
            console.error("Error renaming chat:", error);
        }
    };

    // Role-based menu — FIR only for Police; other tools vary by role
    const menuItems = getMenuForRole(user?.role);

    const closeMobileMenu = (e) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        onClose?.();
    };

    // Dynamic Classes based on Collapse
    // Note: do not use Framer `layout` on this aside — it fights translateX and breaks the mobile close button.
    const sidebarClasses = `
    fixed inset-y-0 left-0 z-[70] bg-white dark:bg-[#0F141C] border-r border-slate-200 dark:border-white/5 
    transition-transform duration-300 ease-out flex flex-col shadow-soft w-[min(18rem,86vw)]
    md:translate-x-0 md:static md:w-auto md:transition-[width]
    ${isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none md:pointer-events-auto md:translate-x-0'}
    ${isCollapsed ? 'md:w-20' : 'md:w-72'} 
  `;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={closeMobileMenu}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            closeMobileMenu(e);
                        }}
                        className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-md"
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            <aside className={sidebarClasses} aria-hidden={!isOpen}>

                {/* Header */}
                <div className={`p-4 md:p-5 border-b border-slate-200 dark:border-white/5 flex items-center gap-2 shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all duration-300`}>
                    {!isCollapsed && (
                        <button
                            type="button"
                            onClick={() => { onOpenSettings?.(); onClose?.(); }}
                            className="flex items-center gap-3 overflow-hidden min-w-0 flex-1 text-left rounded-xl p-1 -ml-1 active:bg-slate-100 dark:active:bg-white/5"
                            aria-label="Configure Profile"
                        >
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 bg-teal-700 text-white font-semibold text-sm">
                                {user.photo ? (
                                    <img
                                        src={user.photo}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                                    />
                                ) : null}
                                <div className={`w-full h-full flex items-center justify-center ${user.photo ? 'hidden' : 'flex'}`}>
                                    {getInitials(user.name)}
                                </div>
                            </div>
                            <div className="truncate min-w-0">
                                <h3 className="font-semibold text-ink dark:text-slate-100 truncate text-sm">{user.name}</h3>
                                <p className="text-[11px] text-teal-800 dark:text-teal-400 truncate font-medium uppercase tracking-wider">{user.role}</p>
                            </div>
                        </button>
                    )}

                    {/* Collapse Toggle (Desktop) */}
                    <button 
                        type="button"
                        onClick={() => setIsCollapsed(!isCollapsed)} 
                        className="hidden md:flex p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>

                    {/* Close (Mobile) — native button for reliable touch */}
                    <button 
                        type="button"
                        onClick={closeMobileMenu}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            closeMobileMenu(e);
                        }}
                        className="md:hidden relative z-[80] flex items-center justify-center h-11 w-11 shrink-0 rounded-xl text-ink dark:text-slate-200 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 active:scale-95 transition-transform"
                        aria-label="Close menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="p-3 space-y-2 mt-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => {
                            setMode('chat');
                            onLoadChat({ messages: [], mode: 'chat' });
                            onClose?.();
                        }}
                        className={`group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-ink hover:opacity-95 !text-white font-semibold transition-all ${isCollapsed ? 'justify-center' : ''}`}
                        title="New Chat"
                    >
                        <Plus size={20} className="shrink-0 relative z-10 text-white" />
                        {!isCollapsed && (
                            <span className="whitespace-nowrap overflow-hidden relative z-10 text-white">
                                New Chat
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.p 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0, height: 0 }}
                                className="text-[10px] text-slate-500 font-bold px-3 pt-6 pb-2 uppercase tracking-[0.2em]"
                            >
                                Menu
                            </motion.p>
                        )}
                    </AnimatePresence>
                    
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = mode === item.id;
                            return (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ x: isCollapsed ? 0 : 4 }}
                                    onClick={() => { setMode(item.id); onClose?.(); }}
                                    className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                                        isActive 
                                            ? 'bg-teal-700/10 text-ink dark:text-white font-semibold' 
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-ink dark:hover:text-slate-200'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeNavIndicator"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-teal-700 dark:bg-teal-400"
                                        />
                                    )}
                                    <span className={`relative z-10 transition-colors ${isActive ? 'text-teal-800 dark:text-teal-300' : ''}`}>
                                        {item.icon}
                                    </span>
                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span 
                                                initial={{ opacity: 0, width: 0 }} 
                                                animate={{ opacity: 1, width: 'auto' }} 
                                                exit={{ opacity: 0, width: 0 }} 
                                                className="whitespace-nowrap relative z-10"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            );
                        })}
                    </div>
                </nav>

                {/* History Section */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="flex-1 overflow-y-auto px-4 mt-2 scrollbar-hide"
                        >
                            <p className="text-[10px] text-slate-500 font-bold px-2 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                                <History size={12} /> Recent Cases
                            </p>
                            <div className="space-y-1 pb-4" ref={menuRef}>
                                {history.map((chat) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={chat.id} 
                                        className="relative group rounded-xl hover:bg-white/5 transition-colors duration-200"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => { onLoadChat(chat); onClose?.(); }}
                                            className="w-full text-left px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-ink dark:hover:text-white truncate transition-all flex items-center justify-between group-hover:pr-10"
                                        >
                                            <span className="truncate w-full font-medium">{chat.title || "Untitled Case"}</span>
                                        </button>

                                        {/* 3-Dot Menu Button with Slide Reveal */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenu(activeMenu === chat.id ? null : chat.id);
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                                        >
                                            <MoreVertical size={14} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {activeMenu === chat.id && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    className="absolute right-0 top-full mt-2 w-36 glass-panel border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setRenameModal({ open: true, chatId: chat.id, currentTitle: chat.title || '' });
                                                            setActiveMenu(null);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                                                    >
                                                        <Pencil size={14} className="text-accent-blue" />
                                                        <span>Rename</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteConfirm({ open: true, chatId: chat.id });
                                                            setActiveMenu(null);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                        <span>Delete</span>
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom Config */}
                <div className={`p-4 border-t border-slate-200 dark:border-white/5 transition-all duration-300 mt-auto shrink-0 bg-white dark:bg-[#0F141C]`}>
                    <button 
                        type="button"
                        onClick={() => { onOpenSettings(); onClose?.(); }} 
                        className={`w-full flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-ink dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 dark:hover:text-white transition-all text-sm font-semibold border border-slate-200 dark:border-transparent justify-center`}
                    >
                        <Settings size={18} className="text-slate-400" />
                        {!isCollapsed && (
                            <span className="whitespace-nowrap">
                                Configure Profile
                            </span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Rename Modal */}
            <AnimatePresence>
                {renameModal.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setRenameModal({ open: false, chatId: null, currentTitle: '' })}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.9, opacity: 0, y: 20 }} 
                            className="glass-panel border border-white/10 rounded-2xl p-7 w-full max-w-md shadow-2xl relative overflow-hidden z-10"
                        >
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none"></div>
                            <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                                <Pencil size={20} className="text-accent-gold" /> Rename Case
                            </h3>
                            <input
                                type="text"
                                value={renameModal.currentTitle}
                                onChange={(e) => setRenameModal({ ...renameModal, currentTitle: e.target.value })}
                                placeholder="Enter new case name..."
                                className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleRenameChat()}
                            />
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setRenameModal({ open: false, chatId: null, currentTitle: '' })}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRenameChat}
                                    className="flex-1 px-4 py-3 rounded-xl bg-accent-gold text-black font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setDeleteConfirm({ open: false, chatId: null })}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.9, opacity: 0, y: 20 }} 
                            className="glass-panel border border-white/10 rounded-2xl p-7 w-full max-w-md shadow-2xl relative overflow-hidden z-10"
                        >
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                                    <Trash2 className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Delete Case</h3>
                            </div>
                            <p className="text-slate-300 mb-8 leading-relaxed">Are you sure you want to delete this case? All messages and attachments will be permanently removed. This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm({ open: false, chatId: null })}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteChat(deleteConfirm.chatId)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
                                >
                                    Delete Permanently
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;