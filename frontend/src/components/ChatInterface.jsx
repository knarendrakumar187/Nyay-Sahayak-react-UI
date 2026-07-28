import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Volume2, VolumeX, User, Trash2, Copy, Check, MessageSquare, Zap, FileText, Search, Shield, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import VoiceAssistantButton from './VoiceAssistantButton';
import VoiceWaveform from './VoiceWaveform';
import API_BASE_URL from '../config/api';

const ChatInterface = ({ messages, setMessages, onSendMessage, loading, role, user, onNyayPatra, onDocGen, mode, voiceAssistantEnabled = true }) => {
  const [input, setInput] = useState('');
  const [reportHistory, setReportHistory] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Copy message to clipboard
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // Format message with markdown (convert **text** to bold)
  const formatMessage = (text) => {
    if (!text) return null;
    // Split by **bold** pattern
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove ** and wrap in bold
        return <strong key={i} className="font-semibold text-teal-800 dark:text-teal-300">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const [rightIndex, setRightIndex] = useState(0);
  const rights = [
    "Right to Information (RTI)",
    "Right to Equality",
    "Right to Education",
    "Right to Privacy",
    "Right Against Exploitation",
    "Right to Free Speech",
    "Right to Legal Aid"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % rights.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const rolePrompts = {
    Citizen: [
      "What is the punishment for hit-and-run under BNS?",
      "How do I file an FIR under the new criminal laws?",
      "What changed from IPC to Bharatiya Nyaya Sanhita?",
      "How to get free legal aid?"
    ],
    Advocate: [
      "Draft legal notice for cheque bounce",
      "Map old IPC 420 to the new BNS section",
      "Civil procedure timeline for suit filing",
      "Bail application format and procedure"
    ],
    Police: [
      "FIR filing procedure under BNSS step-by-step",
      "When is arrest warrant required under new laws?",
      "Evidence documentation guidelines",
      "Cognizable vs non-cognizable offenses in BNS"
    ],
    Student: [
      "Explain cheating / fraud under Bharatiya Nyaya Sanhita",
      "Difference between bail and anticipatory bail",
      "Key differences between IPC and BNS",
      "Landmark cases on Article 21"
    ]
  };

  const roleQuickActions = {
    Citizen: [
      { label: "Check Case Status", query: "How can I check my case status online?", icon: <Search size={16} /> },
      { label: "File Complaint", query: "What is the process to file an online complaint?", icon: <FileText size={16} /> }
    ],
    Advocate: [
      { label: "Draft Document", query: "Help me draft a legal document", icon: <FileText size={16} /> },
      { label: "Case Law Search", query: "Find recent case laws on", icon: <Search size={16} /> }
    ],
    Police: [
      { label: "FIR Template", query: "Show me FIR filing template and format", icon: <FileText size={16} /> },
      { label: "Evidence Rules", query: "What are the evidence documentation rules?", icon: <Shield size={16} /> }
    ],
    Student: [
      { label: "Explain Concept", query: "Explain this legal concept in detail:", icon: <BookOpen size={16} /> },
      { label: "Case Analysis", query: "Analyze this landmark case:", icon: <Search size={16} /> }
    ]
  };

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const bottomRef = useRef(null);

  const handleVoiceCommand = (command) => {
    console.log('Voice Command Received:', command);

    // Stop any ongoing TTS when user starts speaking
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    switch (command.type) {
      case 'stop': break;
      case 'clear':
        setMessages([]);
        setReportHistory('');
        break;
      case 'send':
      case 'query':
        if (command.text && command.text.trim()) {
          const queryText = command.text.trim();
          console.log('Processing voice query:', queryText);
          setInput(queryText);
          // Immediately send the message
          handleSend(queryText);
        }
        break;
      default:
        // For any unrecognized command, treat as query
        if (command.text && command.text.trim()) {
          handleSend(command.text.trim());
        }
        break;
    }
  };

  const voiceAssistant = useVoiceAssistant(voiceAssistantEnabled, handleVoiceCommand);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isRecording]);

  // Track when AI finishes responding to speak the response
  const [wasLoading, setWasLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      setWasLoading(true);
    }

    if (!loading && wasLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === 'ai' && lastMessage.text && !isMuted && voiceAssistantEnabled) {
        console.log('AI finished, speaking response:', lastMessage.text.substring(0, 50) + '...');
        setTimeout(() => {
          speakText(lastMessage.text, true);
        }, 500);
      }
      setWasLoading(false);
    }
  }, [loading, messages, voiceAssistantEnabled, isMuted]);

  const speakText = (text, autoPlay = false) => {
    if (!window.speechSynthesis || isMuted) {
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = (rawText) => {
      return rawText
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/#{1,6}\s*/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/---+/g, '')
        .replace(/\n\n+/g, '. ')
        .replace(/\n/g, ' ')
        .trim();
    };

    const cleanedText = cleanText(text);

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      const voices = window.speechSynthesis.getVoices();

      let selectedVoice = null;
      // App is English-only
      if (voices.length > 0) {
        selectedVoice = voices.find(v => v.lang === 'en-IN')
          || voices.find(v => v.lang === 'en-US')
          || voices.find(v => v.lang.startsWith('en'))
          || voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
      };
      setTimeout(speak, 100);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      if (!prev) window.speechSynthesis.cancel();
      return !prev;
    });
  };

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimer();
    } catch (error) {
      alert("Microphone access denied! Please allow permission.");
    }
  };

  const stopAndSendRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    stopTimer();
    setIsRecording(false);
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], "voice_note.wav", { type: "audio/wav" });

      setMessages(prev => [...prev, { sender: 'user', text: "Audio Sent (Processing...)" }]);

      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("history", reportHistory);
      try {
        const response = await fetch(`${API_BASE_URL}/voice-message`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setMessages(prev => {
          const newMsgs = [...prev];
          if (newMsgs[newMsgs.length - 1].sender === 'user') {
            newMsgs[newMsgs.length - 1].text = "" + data.user_text;
          }
          return newMsgs;
        });
        setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
        setReportHistory(prev => `${prev}\nUser: ${data.user_text}\nAI: ${data.answer}`);
        speakText(data.answer);
      } catch (error) {
        setMessages(prev => [...prev, { sender: 'ai', text: "Error processing voice note." }]);
      }
    };
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    stopTimer();
    setIsRecording(false);
  };

  const handleSend = async (textOverride) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;
    setInput('');
    // Always use parent handler so loading, streaming, and FIR flow stay in sync
    onSendMessage(textToSend);
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 hidden md:flex justify-center p-3 pointer-events-none">
        {mode === 'report' ? (
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle size={14} />
            FIR filing mode
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/95 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-ink-mute dark:text-slate-300 px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 backdrop-blur-md shadow-sm"
          >
            <Shield size={14} className="text-teal-700 dark:text-teal-400" />
            Legal Assistant
          </motion.div>
        )}
      </div>

      {/* Compact mode chip on mobile */}
      {mode === 'report' && (
        <div className="md:hidden flex justify-center px-3 pt-2 shrink-0">
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 px-3 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5">
            <AlertCircle size={12} />
            FIR filing mode
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-2 scrollbar-hide pt-3 md:pt-14 relative z-10">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="h-full flex flex-col items-center justify-start md:justify-center text-center pt-2 md:pt-0 pb-4"
          >
            {/* Hide large avatar on mobile — already in header */}
            <div className="hidden md:block w-20 h-20 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden mb-5 bg-white dark:bg-white/5">
              {user?.photo ? (
                <img src={user.photo} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={28} className="text-teal-800 dark:text-teal-300" />
                </div>
              )}
            </div>

            <h2 className="font-display text-3xl sm:text-3xl md:text-4xl font-semibold text-ink dark:text-white mb-1.5 md:mb-2 tracking-normal leading-snug">
              {greeting}, {user?.name?.split(' ')[0] || 'Citizen'}
            </h2>
            <p className="text-sm md:text-base text-ink-mute dark:text-slate-400 mb-5 md:mb-8 max-w-md px-2">
              Ask a BNS / legal question, or pick a suggestion below.
            </p>

            <div className="w-full max-w-2xl px-0.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
                {(rolePrompts[user?.role] || rolePrompts.Citizen).slice(0, 4).map((prompt, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * idx, duration: 0.35 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setInput(prompt);
                      handleSend(prompt);
                    }}
                    className="flex items-start gap-2.5 text-left p-3 md:p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.03] active:border-teal-700/50 dark:active:border-teal-400/40 transition-colors text-[13px] md:text-sm text-ink-soft dark:text-slate-300 shadow-sm"
                  >
                    <MessageSquare size={15} className="text-teal-800 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{prompt}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-4 md:mt-6 flex flex-wrap gap-2 justify-center px-1">
              {(roleQuickActions[user?.role] || roleQuickActions.Citizen).map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInput(action.query);
                    handleSend(action.query);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-700/10 active:bg-teal-700/15 border border-teal-700/20 text-teal-900 dark:text-teal-300 font-medium transition-colors text-xs md:text-sm"
                >
                  {action.icon || <Zap size={16} />}
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group relative mb-4`}
            >
              {msg.sender === 'ai' && (
                <div className="hidden md:flex w-8 h-8 rounded-xl bg-teal-700/10 items-center justify-center mr-3 mt-1 shrink-0 border border-teal-700/20 overflow-hidden">
                  <img src="/logo.png" alt="" className="w-full h-full object-cover opacity-90" />
                </div>
              )}

              {msg.sender === 'ai' && voiceAssistantEnabled && !isMuted && (
                <button
                  onClick={() => speakText(msg.text)}
                  className="absolute -left-10 top-2 p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-teal-800 dark:hover:text-teal-300 opacity-0 group-hover:opacity-100 transition-all hidden md:block"
                >
                  <Volume2 size={16} />
                </button>
              )}

              <div className={`max-w-[85%] md:max-w-[75%] p-4 md:p-5 rounded-2xl text-sm md:text-base relative leading-relaxed ${msg.sender === 'user'
                ? 'chat-bubble-user bg-ink rounded-tr-md shadow-soft border border-ink'
                : mode === 'report'
                  ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 text-red-900 dark:text-red-100 rounded-tl-md'
                  : 'chat-bubble-ai bg-white dark:bg-[#121821] border border-slate-300 dark:border-white/15 text-ink-soft dark:text-slate-200 rounded-tl-md shadow-soft'
                }`}>
                
                <div className="whitespace-pre-wrap">{formatMessage(msg.text)}</div>

                {/* Copy Button for AI messages */}
                {msg.sender === 'ai' && msg.text && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(msg.text, idx)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/20 hover:bg-accent-gold/20 text-slate-400 hover:text-accent-gold opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === idx ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="hidden md:flex w-8 h-8 rounded-xl bg-teal-700/10 items-center justify-center mr-3 mt-1 shrink-0 border border-teal-700/20 overflow-hidden">
              <img src="/logo.png" alt="" className="w-full h-full object-cover opacity-90" />
            </div>
            <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl rounded-tl-md p-4 md:p-5 flex items-center space-x-2 h-[52px] shadow-soft">
              <div className="typing-dot" />
              <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
              <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      <AnimatePresence>
        {voiceAssistantEnabled && (voiceAssistant.isListening || voiceAssistant.isProcessing) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-center py-3 z-20"
          >
            <div className="flex flex-col items-center gap-2 px-4 py-2 rounded-xl bg-teal-700/5 dark:bg-teal-400/5 border border-teal-700/15 dark:border-teal-400/15">
              <VoiceWaveform isActive={voiceAssistant.isListening} isProcessing={voiceAssistant.isProcessing} />
              <p className="text-xs text-teal-800 dark:text-teal-300 font-medium tracking-wide">
                {voiceAssistant.isProcessing ? 'Processing audio…' : voiceAssistant.transcript || 'Listening…'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-2.5 md:p-5 shrink-0 relative z-20 pb-[max(0.65rem,env(safe-area-inset-bottom))]">
        <div className="max-w-3xl mx-auto">
          <div
            className={`flex items-end gap-1.5 md:gap-2 rounded-2xl border-2 bg-white dark:bg-[#0E141C] p-1.5 pl-2.5 md:p-2 md:pl-3 shadow-soft transition-all duration-300 ${
              mode === 'report'
                ? 'border-red-300 dark:border-red-500/40 focus-within:border-red-500 focus-within:shadow-[0_0_0_4px_rgba(220,38,38,0.1)]'
                : 'border-slate-300 dark:border-white/15 focus-within:border-teal-700 dark:focus-within:border-teal-400/50 focus-within:shadow-[0_0_0_4px_rgba(10,107,99,0.12)]'
            }`}
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={mode === 'report' ? 'Describe your complaint…' : 'Ask about BNS, rights, FIR…'}
              className="flex-1 bg-transparent border-none py-2.5 md:py-3 px-1 text-sm md:text-[15px] leading-relaxed text-ink dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 resize-none max-h-32 min-h-[40px] md:min-h-[44px] scrollbar-hide"
            />

            <div className="flex items-center gap-1 md:gap-1.5 shrink-0 pb-0.5">
              {voiceAssistantEnabled && voiceAssistant.isSupported && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isMuted && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                      }
                      setIsMuted(!isMuted);
                    }}
                    className={`h-10 w-10 md:h-11 md:w-11 rounded-xl border flex items-center justify-center transition-colors ${
                      isMuted
                        ? 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30'
                        : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-ink dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                    title={isMuted ? 'Unmute AI voice' : 'Mute AI voice'}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  <VoiceAssistantButton
                    isListening={voiceAssistant.isListening}
                    isProcessing={voiceAssistant.isProcessing}
                    onClick={voiceAssistant.toggleListening}
                    disabled={loading}
                  />
                </>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: input.trim() ? 1.04 : 1 }}
                whileTap={{ scale: input.trim() ? 0.96 : 1 }}
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className={`h-10 w-10 md:h-11 md:w-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  input.trim()
                    ? mode === 'report'
                      ? 'bg-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.28)]'
                      : 'bg-ink dark:bg-teal-700 text-white shadow-[0_8px_20px_rgba(7,19,28,0.22)] dark:shadow-[0_8px_20px_rgba(10,107,99,0.35)]'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10 cursor-not-allowed'
                }`}
                title="Send"
              >
                <Send size={17} />
              </motion.button>
            </div>
          </div>

          <p className="mt-1.5 md:mt-2 text-center text-[10px] md:text-[11px] text-slate-500 dark:text-slate-500 hidden sm:block">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;