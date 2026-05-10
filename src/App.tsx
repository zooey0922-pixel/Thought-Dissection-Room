/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  History, 
  Send, 
  TrendingUp, 
  Award, 
  Crown, 
  X,
  Microscope,
  Stethoscope,
  MessageCircle,
  ChevronRight,
  LogOut,
  Volume2,
  Pause,
  Play
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from './lib/utils';
import { 
  DissectionRecord, 
  UserProfile, 
  VIRUS_LIST 
} from './types';
import { getAIReframe, getAngelResponse } from './services/gemini';

// --- Components ---

const HandDrawnMedal = ({ locked = false }: { locked?: boolean }) => {
  const opacity = locked ? "opacity-20 grayscale" : "opacity-100";
  
  return (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", opacity)}>
      {/* Ribbon Loop */}
      <path 
        d="M50 15 C35 15 30 35 45 50 L55 50 C70 35 65 15 50 15" 
        fill="none" 
        stroke="#A5D8FF" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      {/* Ribbon Tails */}
      <path d="M42 55 L30 85 L40 80 L50 85" fill="#A5D8FF" />
      <path d="M58 55 L70 85 L60 80 L50 85" fill="#A5D8FF" />
      
      {/* Main Heart */}
      <path 
        d="M50 70 C35 70 25 55 25 45 C25 35 35 30 45 35 C47 35 49 36 50 37 C51 36 53 35 55 35 C65 30 75 35 75 45 C75 55 65 70 50 70" 
        fill="#FF6B6B" 
      />
      
      {/* Stars & Sparkles */}
      {!locked && (
        <>
          <path d="M80 20 L82 25 L87 26 L82 27 L80 32 L78 27 L73 26 L78 25 Z" fill="#FFD43B" />
          <circle cx="20" cy="40" r="2" fill="#FFD43B" />
          <circle cx="85" cy="55" r="1.5" fill="#FFD43B" />
          <circle cx="30" cy="25" r="1.5" fill="#FAA2C1" />
          <circle cx="75" cy="65" r="1" fill="#FAA2C1" />
        </>
      )}
      
      {locked && (
        <text x="50" y="55" textAnchor="middle" fontSize="20" className="opacity-100">🔒</text>
      )}
    </svg>
  );
};

const GuardianAngel = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-sm">
      {/* Halo */}
      <ellipse cx="50" cy="20" rx="20" ry="5" fill="none" stroke="#FFD43B" strokeWidth="2" />
      {/* Wings */}
      <path d="M30 45 Q10 30 25 60 L40 55 Z" fill="#E9ECEF" />
      <path d="M70 45 Q90 30 75 60 L60 55 Z" fill="#E9ECEF" />
      {/* Body */}
      <path d="M50 35 L35 75 L65 75 Z" fill="#A5D8FF" />
      {/* Head */}
      <circle cx="50" cy="40" r="12" fill="#FFE3E3" />
      {/* Eyes */}
      <circle cx="46" cy="38" r="1.5" fill="#333" />
      <circle cx="54" cy="38" r="1.5" fill="#333" />
      {/* Glow */}
      <circle cx="50" cy="45" r="30" fill="url(#angelGlow)" opacity="0.3" />
      <defs>
        <radialGradient id="angelGlow">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#A5D8FF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const Disclaimer = () => (
  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-[11px] text-amber-800 leading-relaxed max-w-lg mx-auto">
    <p className="font-bold mb-1">【法律免責聲明與提醒】</p>
    本應用程式所提供之內容（包含 AI 生成之建議、分析及對話）僅供自我察覺與情緒引導參考之用，
    <span className="font-bold">非屬專業心理諮商、心理治療或醫療診斷</span>。
    本程式之開發者不具備相關醫事執照。若您感到嚴重的身心不適或有自傷念頭，
    請務必尋求合格專業人士（如精神科醫師、臨床/諮商心理師）之協助。
  </div>
);

const LoginScreen = ({ onLogin }: { onLogin: (name: string) => void }) => {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full panel p-8 text-center flex flex-col gap-6"
      >
        <div>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tighter mb-1 uppercase">THOUGHT ANATOMY LAB</h1>
          <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">找回事實，讓心靈重獲自由</p>
        </div>
        
        <div className="space-y-4">
          <div className="text-left">
            <label className="micro-label text-slate-500">解剖員姓名</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="輸入姓名啟動協定..."
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral focus:border-primary outline-none transition-all text-base"
              onKeyPress={(e) => e.key === 'Enter' && name && onLogin(name)}
            />
          </div>
          <button 
            onClick={() => name && onLogin(name)}
            disabled={!name}
            className="btn-primary-hd w-full uppercase tracking-widest h-12"
          >
            啟動解剖儀器
          </button>
        </div>

        <Disclaimer />
      </motion.div>
    </div>
  );
};

const VIPModal = ({ isOpen, onClose, onActivate }: { isOpen: boolean, onClose: () => void, onActivate: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md panel p-8 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-neutral rounded transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-ink uppercase tracking-tight">解鎖 Pro 專家模式</h2>
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">讓 AI 成為你最深度的心理後盾</p>
              <div className="inline-block px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-primary font-bold text-sm">終身版特價 $150</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                { icon: Sparkles, text: "AI 重構處方：針對你的想像自動生成正向視角" },
                { icon: Stethoscope, text: "小天使深度進化：更專業的心理輔導與邏輯引導" },
                { icon: History, text: "歷史數據同步：解鎖無限次練習紀錄存檔" }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 p-1 bg-success/10 rounded">
                    <item.icon className="w-3.5 h-3.5 text-success" />
                  </div>
                  <span className="text-slate-600 text-xs font-medium leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>

            <button onClick={onActivate} className="btn-primary-hd w-full flex flex-col items-center justify-center py-3 uppercase tracking-widest text-sm">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span>立即支付 $150 升級</span>
              </div>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const RecordDetailModal = ({ record, onClose }: { record: DissectionRecord | null, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {record && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg panel p-0 overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="panel-header shrink-0">
              <div className="panel-title">
                <History className="w-4 h-4 text-primary" />
                解剖紀錄詳情 - {record.date}
              </div>
              <button onClick={onClose} className="p-1 hover:bg-neutral rounded transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <label className="micro-label">原始煩惱</label>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-line">
                  {record.rawInput}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-secondary">
                  <span className="text-[10px] uppercase font-bold text-secondary block mb-1">客觀事實</span>
                  <div className="text-[13px] font-semibold text-slate-700 leading-snug">
                    {record.facts.join('、') || "無事實紀錄"}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-red-50 border-l-4 border-danger">
                  <span className="text-[10px] uppercase font-bold text-danger block mb-1">大腦詮釋</span>
                  <div className="text-[13px] font-semibold text-slate-700 leading-snug">
                    {record.thoughts.join('、') || "無詮釋紀錄"}
                  </div>
                </div>
              </div>

              {record.reframe && (
                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                  <span className="text-[10px] uppercase font-bold text-primary block mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI 重構處方箋
                  </span>
                  <p className="text-[12px] text-slate-600 leading-relaxed italic">
                    {record.reframe}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-line">
                <span className="text-xs font-bold text-slate-400 uppercase">當時痛苦指數</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={cn(
                        "w-8 h-8 rounded flex items-center justify-center text-xs font-bold border",
                        record.painLevel === lvl 
                          ? "bg-primary border-primary text-white" 
                          : "bg-white border-line text-slate-200"
                      )}
                    >
                      {lvl}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-panel-header border-t border-line text-center">
              <button onClick={onClose} className="btn-secondary-hd px-8 py-2 text-xs uppercase tracking-widest">
                關閉視窗
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DissectionRecord | null>(null);
  const [rawInput, setRawInput] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<{ facts: string[], thoughts: string[], reframe?: string } | null>(null);
  const [painLevel, setPainLevel] = useState(3);
  const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();
    setIsPaused(false);
    setIsSpeaking(false);
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const startSpeaking = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find a gentle female voice (common names in different OS)
      const femaleVoice = voices.find(v => 
        (v.lang.includes('zh') && (
          v.name.includes('Female') || 
          v.name.includes('Yating') || 
          v.name.includes('Google 國語') || 
          v.name.includes('XiaoXiao') || 
          v.name.includes('Mei-Jia') ||
          v.name.includes('HiuGaai')
        ))
      ) || voices.find(v => v.lang.includes('zh'));

      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.lang = 'zh-TW';
      utterance.rate = 1.0;
      utterance.pitch = 1.1; // Gentle higher pitch

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    // Chrome and some browsers load voices asynchronously
    if (window.speechSynthesis.getVoices().length > 0) {
      startSpeaking();
    } else {
      window.speechSynthesis.onvoiceschanged = startSpeaking;
    }
  };

  const toggleVoice = () => {
    if (!window.speechSynthesis) return;
    if (window.speechSynthesis.speaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      // Re-read last AI message if not speaking
      const lastAiMsg = [...chatMessages].reverse().find(m => m.role === 'ai');
      if (lastAiMsg) speak(lastAiMsg.text);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('thought_dissection_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to load user data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('thought_dissection_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleLogin = (name: string) => {
    const newUser: UserProfile = {
      name,
      isPro: false,
      medals: 0,
      history: []
    };
    setUser(newUser);
    setChatMessages([{ 
      role: 'ai', 
      text: `親愛的 ${name}，我是你的專屬小天使。不管發生什麼事，我都會在這裡陪著你。你可以把煩惱告訴我，或者使用左側的解剖儀器來拆解它們。` 
    }]);
  };

  const handleLogout = () => {
    localStorage.removeItem('thought_dissection_user');
    setUser(null);
    setChatMessages([]);
    setCurrentAnalysis(null);
    setRawInput('');
  };

  const deepAnalyze = async () => {
    if (!rawInput.trim()) return;
    setIsAnalyzing(true);

    const sentences = rawInput.split(/[，。？！,?!]/);
    const facts: string[] = [];
    const thoughts: string[] = [];

    sentences.forEach(s => {
      const trimmed = s.trim();
      if (trimmed.length < 2) return;
      
      const hasVirus = VIRUS_LIST.some(v => trimmed.includes(v));
      if (hasVirus) {
        const splitIdx = trimmed.search(/一定|覺得|肯定|會不會|是不是|總是|每次/);
        if (splitIdx > 2) {
          facts.push(trimmed.substring(0, splitIdx));
          thoughts.push(trimmed.substring(splitIdx));
        } else {
          thoughts.push(trimmed);
        }
      } else {
        facts.push(trimmed);
      }
    });

    let reframe;
    if (user?.isPro) {
      reframe = await getAIReframe(facts, thoughts);
    }

    setCurrentAnalysis({ facts, thoughts, reframe });
    setIsAnalyzing(false);
  };

  const saveData = () => {
    if (!currentAnalysis || !user) return;

    const newRecord: DissectionRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      rawInput,
      facts: currentAnalysis.facts,
      thoughts: currentAnalysis.thoughts,
      painLevel,
      reframe: currentAnalysis.reframe
    };

    const newHistory = [newRecord, ...user.history];
    let newMedals = user.medals;

    if (newHistory.length >= 7) {
      const last7 = newHistory.slice(0, 7);
      const sum = last7.reduce((acc, curr) => acc + curr.painLevel, 0);
      if (sum < 10) {
        newMedals += 1;
      }
    }

    setUser({ ...user, history: newHistory, medals: newMedals });
    alert("紀錄已存檔！繼續保持平靜的心。");
  };

  const sendChat = async () => {
    if (!chatInput.trim() || !user || isChatting) return;

    const msg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsChatting(true);

    const response = await getAngelResponse(msg, user.isPro, user.name);
    setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsChatting(false);
    speak(response);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <VIPModal 
        isOpen={isVipModalOpen} 
        onClose={() => setIsVipModalOpen(false)} 
        onActivate={() => {
          setUser({ ...user, isPro: true });
          setIsVipModalOpen(false);
        }}
      />

      <RecordDetailModal 
        record={selectedRecord} 
        onClose={() => setSelectedRecord(null)} 
      />

      {/* Header */}
      <header className="flex justify-between items-center h-[60px] border-b-2 border-primary pb-2 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-primary tracking-tighter uppercase">THOUGHT ANATOMY LAB</h1>
          <span className="status-badge">Operator: {user.name}</span>
          <button 
            onClick={handleLogout}
            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
            title="登出系統"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
        <div className="text-[12px] text-slate-400 font-bold uppercase tracking-wider hidden md:block">
          System Online • Level 4 Diagnostics
        </div>
      </header>

      {/* Pro Banner */}
      {!user.isPro && (
        <motion.div 
          whileHover={{ scale: 1.005 }}
          onClick={() => setIsVipModalOpen(true)}
          className="bg-ink text-primary px-4 py-2 rounded-lg flex items-center justify-between cursor-pointer shadow-md"
        >
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Pro 會員特權：解鎖「重構處方箋」與「深度心理諮商語氣」</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      )}

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_340px_240px] gap-4 flex-1 min-h-0">
        {/* Column 1: Diagnosis */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Microscope className="w-4 h-4 text-primary" />
              想法分析儀
            </div>
            <div className="text-[10px] text-success font-bold flex items-center gap-1 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              系統就緒
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
            <div className="flex flex-col flex-1 min-h-0">
              <label className="micro-label">輸入診斷語句</label>
              <textarea 
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="在這裡述說你的煩惱，我會幫你拆解事實與想像。"
                className="diag-field flex-1"
              />
            </div>
            <button 
              onClick={deepAnalyze}
              disabled={isAnalyzing || !rawInput.trim()}
              className="btn-primary-hd uppercase tracking-widest text-sm"
            >
              {isAnalyzing ? "正在解剖中..." : "執行深度解剖 (Deep Analysis)"}
            </button>
          </div>

          <AnimatePresence>
            {currentAnalysis && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg border-t border-line"
              >
                <div className="grid grid-cols-2 gap-3 p-4">
                  <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-secondary">
                    <span className="text-[10px] uppercase font-bold text-secondary block mb-1">客觀事實採樣</span>
                    <div className="text-[13px] font-semibold text-slate-700 leading-snug">
                      {currentAnalysis.facts.join('、') || "（請嘗試更客觀地描述動作...）"}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 border-l-4 border-danger">
                    <span className="text-[10px] uppercase font-bold text-danger block mb-1">大腦增生詮釋</span>
                    <div className="text-[13px] font-semibold text-slate-700 leading-snug">
                      {currentAnalysis.thoughts.join('、') || "（未偵測到詮釋）"}
                    </div>
                  </div>
                </div>

                {user.isPro && currentAnalysis.reframe && (
                  <div className="px-4 pb-4">
                    <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <span className="text-[10px] uppercase font-bold text-primary block mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Pro AI 重構處方箋
                      </span>
                      <p className="text-[12px] text-slate-600 leading-relaxed italic">
                        {currentAnalysis.reframe}
                      </p>
                    </div>
                  </div>
                )}

                <div className="px-4 pb-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="micro-label mb-0">當前痛苦指數</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setPainLevel(lvl)}
                          className={cn(
                            "w-8 h-8 rounded text-xs font-bold transition-all border",
                            painLevel === lvl 
                              ? "bg-primary border-primary text-white" 
                              : "bg-white border-line text-slate-400 hover:border-primary/30"
                          )}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={saveData} className="btn-secondary-hd uppercase tracking-widest text-xs py-2">紀錄數據並存檔</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Column 2: Chat */}
        <div className="panel">
          <div className="panel-header py-2">
            <div className="panel-title">
              <GuardianAngel />
              <div>
                <div className="text-[13px] font-bold text-secondary flex items-center gap-2">
                  守護小天使
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={toggleVoice}
                      className="p-1 hover:bg-secondary/10 rounded-full transition-colors flex items-center justify-center p-1.5"
                      title={isSpeaking ? (isPaused ? "播放" : "暫停") : "播放最後訊息"}
                    >
                      {isSpeaking ? (
                        isPaused ? <Play className="w-3 h-3 text-secondary fill-secondary" /> : <Pause className="w-3 h-3 text-secondary fill-secondary" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-secondary" />
                      )}
                    </button>
                    {isSpeaking && (
                      <button 
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          setIsSpeaking(false);
                          setIsPaused(false);
                        }}
                        className="p-1 hover:bg-danger/10 rounded-full transition-colors text-danger"
                        title="停止播放"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={msg.role === 'ai' ? "chat-bubble-ai" : "chat-bubble-user"}
              >
                {msg.text}
              </div>
            ))}
            {isChatting && (
              <div className="chat-bubble-ai animate-pulse italic">小天使正在組織重點...</div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t border-line flex flex-col gap-2 bg-panel-header">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChat()}
                placeholder="說說你的感覺..."
                className="flex-1 px-4 py-2 rounded-full border border-line outline-none text-[13px] bg-white shadow-inner focus:border-secondary transition-colors"
              />
              <button 
                onClick={sendChat}
                disabled={isChatting || !chatInput.trim()}
                className="w-10 h-10 flex items-center justify-center bg-secondary text-white rounded-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-30 disabled:grayscale"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-slate-400 text-center italic">※ 回覆由 AI 自動生成，僅供參考</p>
          </div>
        </div>

        {/* Column 3: Stats */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              數據監測
            </div>
          </div>
          <div className="p-4 flex flex-col gap-6 overflow-y-auto">
            <div>
              <label className="micro-label">痛苦指數趨勢</label>
              <div className="h-32 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={user.history.slice(0, 7).reverse()}>
                    <XAxis dataKey="date" hide />
                    <YAxis domain={[1, 5]} hide />
                    <Tooltip 
                      contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="painLevel" 
                      stroke="#FF9F43" 
                      strokeWidth={2} 
                      dot={{ r: 3, fill: '#FF9F43' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <label className="micro-label">最近解剖紀錄</label>
              <div className="flex flex-col gap-1 mt-1">
                {user.history.slice(0, 5).map((record) => (
                  <button 
                    key={record.id} 
                    onClick={() => setSelectedRecord(record)}
                    className="py-2 border-b border-line border-dashed text-[11px] leading-snug text-left hover:bg-slate-50 transition-colors w-full group"
                  >
                    <b className="text-primary mr-1 group-hover:underline">{record.date.split('/')[1]}/{record.date.split('/')[2]}</b>
                    <span className="text-slate-600 line-clamp-1">{record.rawInput}</span>
                  </button>
                ))}
                {user.history.length === 0 && (
                  <p className="text-slate-400 text-[10px] py-2">尚無紀錄</p>
                )}
              </div>
            </div>

            <div>
              <label className="micro-label">愛心勳章 ({user.medals}/8)</label>
            <div className="grid grid-cols-4 gap-2 mt-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={i < user.medals ? "medal-hd p-1" : "medal-hd-locked p-1"}>
                    <HandDrawnMedal locked={i >= user.medals} />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-3 text-center leading-tight">
                連續穩定 3 天獲得
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="mt-4 pb-2">
        <Disclaimer />
      </footer>
    </div>
  );
}
