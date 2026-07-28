import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import BootScreen from './components/BootScreen';
import SettingsModal from './components/Modals/SettingsModal';
import RoleSelectGate from './components/RoleSelectGate';
import GovServices from './components/GovServices';
import IpcBnsMapper from './components/IpcBnsMapper';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import { useLegalAI } from './hooks/useLegalAI';
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import API_BASE_URL from './config/api';
import { canAccessMode, defaultModeForRole, normalizeRole } from './config/roleAccess';

// Protected Route Wrapper
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Animated Routes Wrapper
const AnimatedRoutes = ({ isAuthenticated, authChecked, handleGoogleLogin, onSelectRole, appProps }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Route - Landing Page */}
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage />
          </motion.div>
        } />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AuthPage handleGoogleLogin={handleGoogleLogin} onSelectRole={onSelectRole} />
              </motion.div>
            )
          }
        />

        {/* Chat Route - Redirect based on auth */}
        <Route path="/chat" element={
          isAuthenticated ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />
        } />

        {/* Protected App Route */}
        <Route
          path="/app"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex h-screen bg-background-light dark:bg-bg-deep text-ink dark:text-slate-200 font-body overflow-hidden selection:bg-accent-gold/20"
              >
                <Sidebar
                  mode={appProps.mode}
                  setMode={(newMode) => {
                    appProps.setMode(newMode);
                    if (newMode !== appProps.mode) appProps.setMessages([]);
                  }}
                  user={appProps.user}
                  onOpenSettings={() => appProps.setIsSettingsOpen(true)}
                  onLoadChat={(chat) => {
                    appProps.setMessages(chat.messages || []);
                    appProps.setMode(chat.mode || 'chat');
                  }}
                  isOpen={appProps.isMobileMenuOpen}
                  onClose={() => appProps.setIsMobileMenuOpen(false)}
                />

                <main className="flex-1 relative flex flex-col h-full z-10 w-full">
                  {/* Mobile Header */}
                  <div className="md:hidden flex items-center justify-between px-3 py-2.5 bg-white/90 dark:bg-bg-panel border-b border-slate-200 dark:border-white/10 sticky top-0 z-20 backdrop-blur-md">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => appProps.setIsMobileMenuOpen(true)}
                        className="p-2.5 text-teal-800 dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors shrink-0"
                        aria-label="Open menu"
                      >
                        <Menu size={22} />
                      </button>
                      <span className="flex items-center gap-2 min-w-0">
                        <img src="/logo.png" alt="Nyay Sahayak" className="w-7 h-7 rounded-md shrink-0" />
                        <span className="font-display font-semibold text-ink dark:text-white tracking-normal text-lg truncate">
                          Nyay Sahayak
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => appProps.setIsSettingsOpen(true)}
                      className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 dark:border-white/15 shrink-0 active:scale-95 transition-transform"
                      aria-label="Configure Profile"
                    >
                      {appProps.user.photo ? (
                        <img src={appProps.user.photo} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <div className="bg-teal-700/15 w-full h-full flex items-center justify-center text-xs font-semibold text-teal-800 dark:text-teal-300">
                          {appProps.user.name[0]}
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Render Content Based on Mode */}
                  <AnimatePresence mode="wait">
                    {appProps.mode === 'digital' ? (
                      <motion.div
                        key="digital"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="flex-1 overflow-hidden"
                      >
                        <GovServices />
                      </motion.div>
                    ) : appProps.mode === 'ipc-bns' ? (
                      <motion.div
                        key="ipc-bns"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="flex-1 overflow-hidden"
                      >
                        <IpcBnsMapper />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="chat"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25 }}
                        className="flex-1 flex flex-col overflow-hidden"
                      >
                        <ChatInterface
                          messages={appProps.messages}
                          setMessages={appProps.setMessages}
                          onSendMessage={appProps.handleSendMessage}
                          loading={appProps.loading}
                          role={appProps.user.role}
                          user={appProps.user}
                          onNyayPatra={appProps.handleNyayPatra}
                          onDocGen={() => { }}
                          mode={appProps.mode}
                          voiceAssistantEnabled={appProps.user.voiceAssistantEnabled}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </main>

                {/* Role gate — first open / after sign-in until role is chosen */}
                {authChecked && isAuthenticated && !appProps.user.roleSelected && (
                  <RoleSelectGate onSelect={appProps.onSelectRole} />
                )}

                {/* Modals */}
                <AnimatePresence mode="sync">
                  {appProps.isSettingsOpen && (
                    <SettingsModal
                      key="settings-modal"
                      user={appProps.user}
                      setUser={appProps.setUser}
                      onClose={() => appProps.setIsSettingsOpen(false)}
                      onLogout={appProps.handleLogout}
                      theme={appProps.theme}
                      setTheme={appProps.setTheme}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [booted, setBooted] = useState(false);
  const [mode, setMode] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Police Report State
  const [reportHistory, setReportHistory] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);

  // Theme State - Load on app start
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Apply theme on load and when changed
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // User State — role is chosen only at sign-in / first open (not in settings)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nyay_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        language: 'English',
        state: 'India',
        // Only true after an explicit role pick (never infer from old default "Citizen")
        roleSelected: parsed.roleSelected === true,
        role: parsed.roleSelected === true ? parsed.role : '',
      };
    }
    return {
      name: "User",
      email: "",
      photo: "",
      role: "",
      roleSelected: false,
      language: "English",
      detailLevel: "Detailed",
      state: "India",
      voiceAssistantEnabled: true
    };
  });

  const { generateLegalNotice } = useLegalAI();
  const loading = reportLoading || isStreaming;

  // Keep mode valid for the selected role (FIR is Police-only)
  useEffect(() => {
    if (!user.roleSelected || !user.role) return;
    if (!canAccessMode(user.role, mode)) {
      setMode(defaultModeForRole(user.role));
      setMessages([]);
    }
  }, [user.role, user.roleSelected, mode]);

  const persistRoleForUid = (uid, role) => {
    if (!uid || !role) return;
    localStorage.setItem(`nyay_role_${uid}`, role);
  };

  const onSelectRole = (role) => {
    sessionStorage.setItem('pending_role', role);
    const uid = auth.currentUser?.uid;
    if (uid) persistRoleForUid(uid, role);
    setUser((prev) => ({
      ...prev,
      role,
      roleSelected: true,
    }));
  };

  useEffect(() => {
    const needsFix =
      user.language !== 'English' ||
      user.state !== 'India';

    if (needsFix) {
      setUser((prev) => ({
        ...prev,
        language: 'English',
        state: 'India',
      }));
      return;
    }
    localStorage.setItem('nyay_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);

        const pendingRole = sessionStorage.getItem('pending_role');
        if (pendingRole) {
          sessionStorage.removeItem('pending_role');
          persistRoleForUid(currentUser.uid, pendingRole);
        }

        const savedRole =
          pendingRole ||
          localStorage.getItem(`nyay_role_${currentUser.uid}`) ||
          '';

        setUser((prev) => ({
          ...prev,
          name: currentUser.displayName || prev.name,
          email: currentUser.email || '',
          photo: currentUser.photoURL || '',
          role: savedRole || (prev.roleSelected ? prev.role : ''),
          roleSelected: Boolean(savedRole) || prev.roleSelected === true,
        }));
      } else {
        setIsAuthenticated(false);
        setUser((prev) => ({
          ...prev,
          role: '',
          roleSelected: false,
          email: '',
          photo: '',
        }));
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed: " + error.message);
      throw error;
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsAuthenticated(false);
    setUser((prev) => ({
      ...prev,
      role: '',
      roleSelected: false,
      email: '',
      photo: '',
    }));
  };

  const handleSendMessage = async (text) => {
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);

    if (mode === 'report') {
      setReportLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/file-report-interview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_input: text,
            history: reportHistory
          }),
        });

        const data = await response.json();
        const aiText = data.answer;

        setReportHistory(prev => `${prev}\nUser: ${text}\nAI: ${aiText}`);
        const finalMsgs = [...newMessages, { sender: 'ai', text: aiText }];
        setMessages(finalMsgs);
        saveChatToFirebase(finalMsgs);

      } catch (error) {
        setMessages(prev => [...prev, { sender: 'ai', text: "Connection Error: Police Station server is down." }]);
      }
      setReportLoading(false);
    }
    else {
      setIsStreaming(true);
      setMessages(prev => [...prev, { sender: 'ai', text: "" }]);
      let fullAiResponse = "";

      try {
        // Build conversation history from all messages
        const conversationHistory = messages.map(msg =>
          `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`
        ).join('\n');

        let bodyContent = { message: text, history: conversationHistory };

        const response = await fetch(`${API_BASE_URL}/stream-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyContent),
        });

        if (!response.ok) {
          throw new Error(`API error ${response.status}`);
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value, { stream: true });
          fullAiResponse += chunkValue;

          setMessages(prev => {
            const updated = [...prev];
            const lastMsgIndex = updated.length - 1;
            if (updated[lastMsgIndex].sender === 'ai') {
              updated[lastMsgIndex] = { ...updated[lastMsgIndex], text: fullAiResponse };
            }
            return updated;
          });
        }

        saveChatToFirebase([...newMessages, { sender: 'ai', text: fullAiResponse }]);

      } catch (error) {
        console.error("Stream Error:", error);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = "Connection lost. Please try again.";
          return updated;
        });
      }
      setIsStreaming(false);
    }
  };

  const saveChatToFirebase = async (finalMsgs) => {
    if (auth.currentUser) {
      const today = new Date().toISOString().split('T')[0];
      const chatId = `chat_${auth.currentUser.uid}_${today}`;

      try {
        await setDoc(doc(db, "chats", chatId), {
          userId: auth.currentUser.email,
          title: finalMsgs[0]?.text.substring(0, 30) + "..." || "Ongoing Case",
          messages: finalMsgs,
          timestamp: serverTimestamp(),
          mode: mode
        }, { merge: true });
      } catch (e) {
        console.error("Error saving chat:", e);
      }
    }
  };

  const handleNyayPatra = async () => {
    const input = prompt("Speak/Type your complaint for Legal Notice:");
    if (!input) return;
    setMessages(prev => [...prev, { sender: 'user', text: `DRAFTING NOTICE FOR: ${input}` }]);

    try {
      const blob = await generateLegalNotice(input);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Legal_Notice.pdf";
      a.click();
      setMessages(prev => [...prev, { sender: 'ai', text: "Legal Notice Generated & Downloaded." }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Failed to generate notice." }]);
    }
  };

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;

  const appProps = {
    mode, setMode, messages, setMessages, isSettingsOpen, setIsSettingsOpen,
    isMobileMenuOpen, setIsMobileMenuOpen, user, setUser, loading,
    handleSendMessage, handleNyayPatra, handleLogout, theme, setTheme,
    onSelectRole,
  };

  return (
    <Router>
      <AnimatedRoutes
        isAuthenticated={isAuthenticated}
        authChecked={authChecked}
        handleGoogleLogin={handleGoogleLogin}
        onSelectRole={onSelectRole}
        appProps={appProps}
      />
    </Router>
  );
}

export default App;