"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, User, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Minus, Brain, BookOpen, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Sunrise, Dumbbell, Smartphone, Ghost, GraduationCap, Microscope, Palette, Binary, 
  AlertTriangle, Calendar, ShoppingCart, Coffee, FastForward, Gift, Moon, Star, Volume2, Lock,
  SkipForward, SkipBack, Apple, BarChart3, ClipboardList, Home, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- LOFI DATA ---
const LOFI_LIBRARY = [
  { id: 't1', name: 'Deep Space Focus', url: 'https://stream.zeno.fm/0r0xa792kwzuv', cost: 0, unlocked: true },
  { id: 't2', name: 'Rainy Night Desk', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cost: 100, unlocked: false },
  { id: 't3', name: 'Cyberpunk Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cost: 150, unlocked: false },
];

export default function StudyCreditsUltimateOS() {
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'exams'>('home');
  const [sc, setSc] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [name, setName] = useState("");
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [examResults, setExamResults] = useState<{subject: string, mark: number, date: string}[]>([]);
  const [dailyHistory, setDailyHistory] = useState<{date: string, sc: number}[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- FREE SAVING LOGIC ---
  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setTotalHours(Number(localStorage.getItem(`hours_${savedName}`)) || 0);
    setExamResults(JSON.parse(localStorage.getItem(`exams_${savedName}`) || '[]'));
    setDailyHistory(JSON.parse(localStorage.getItem(`history_${savedName}`) || '[]'));
    
    audioRef.current = new Audio(LOFI_LIBRARY[0].url);
    audioRef.current.loop = true;
  }, []);

  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem(`sc_${name}`, total.toString());
    
    // Save to daily history for charts
    const today = new Date().toLocaleDateString();
    const newHistory = [...dailyHistory];
    const existingIndex = newHistory.findIndex(h => h.date === today);
    if (existingIndex > -1) newHistory[existingIndex].sc += amount;
    else newHistory.push({ date: today, sc: amount });
    
    setDailyHistory(newHistory);
    localStorage.setItem(`history_${name}`, JSON.stringify(newHistory));
    confetti({ particleCount: 150, spread: 60 });
  };

  const addExamMark = (subject: string, mark: number) => {
    const newResult = { subject, mark, date: new Date().toLocaleDateString() };
    const updated = [...examResults, newResult];
    setExamResults(updated);
    localStorage.setItem(`exams_${name}`, JSON.stringify(updated));
  };

  return (
    <div className={`min-h-screen ${isGhostMode ? 'bg-black' : 'bg-[#02040a]'} text-white font-sans flex overflow-hidden`}>
      
      {/* 👻 GHOST OVERLAY */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <h1 className="text-[12rem] font-black opacity-20 animate-pulse">FOCUSING</h1>
            <button onClick={() => setIsGhostMode(false)} className="mt-10 text-white/20 hover:text-white uppercase tracking-widest text-xs">[ EXIT ]</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛰️ NAVIGATION SIDEBAR */}
      <nav className="w-20 lg:w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col gap-8 z-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Zap size={20}/></div>
          <span className="hidden lg:block font-black tracking-tighter text-xl">SCHOLAR OS</span>
        </div>
        <div className="space-y-2">
          <NavButton icon={<Home/>} label="Terminal" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavButton icon={<BarChart3/>} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <NavButton icon={<ClipboardList/>} label="Exams" active={activeTab === 'exams'} onClick={() => setActiveTab('exams')} />
        </div>
        <div className="mt-auto">
          <button onClick={() => setIsGhostMode(true)} className="w-full flex items-center gap-3 p-3 text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all">
            <Ghost size={20}/> <span className="hidden lg:block text-xs font-black uppercase">Stealth Mode</span>
          </button>
        </div>
      </nav>

      {/* 📺 MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full -z-10" />

        <AnimatePresence mode="wait">
          {/* PAGE 1: TERMINAL (The Main Hub) */}
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <header className="flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter">DAILY MISSIONS</h2>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">A/L Mastery Protocol </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-emerald-400 uppercase">Credits</p>
                      <p className="text-4xl font-mono font-black">{sc}</p>
                    </div>
                  </header>
                  
                  <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 space-y-6">
                    <TaskSection title="CORE GRIND [cite: 2]">
                       <TaskRow icon={<Clock/>} name="Deep Work Hour" sc={30} onClick={() => addSC(30)} />
                       <TaskRow icon={<Edit3/>} name="Ultra-Summary Note" sc={35} onClick={() => addSC(35)} />
                    </TaskSection>
                    <TaskSection title="SUBJECT POWER PLAYS [cite: 2]">
                       <TaskRow icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={() => addSC(30)} />
                       <TaskRow icon={<Beaker/>} name="Chemistry: The Alchemist" sc={30} onClick={() => addSC(30)} />
                    </TaskSection>
                  </div>
                </div>
                
                <aside className="lg:col-span-4 space-y-6">
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                     <h3 className="text-[10px] font-black text-indigo-400 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]"><Volume2 size={14}/> Sound Deck</h3>
                     <button onClick={() => { if(audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} 
                        className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3">
                        {isPlaying ? <Pause/> : <Play/>} {isPlaying ? "Vibing..." : "Start Lofi"}
                     </button>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {/* PAGE 2: ANALYTICS (Progress Visualization) */}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Visual Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                  <h3 className="text-xs font-black text-slate-500 uppercase mb-6">SC Earning History</h3>
                  <div className="flex items-end gap-2 h-48">
                    {dailyHistory.slice(-7).map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: `${(h.sc / 250) * 100}%` }} />
                        <span className="text-[8px] font-bold text-slate-500">{h.date.split('/')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center items-center text-center">
                   <Target size={48} className="text-emerald-400 mb-4" />
                   <h3 className="text-2xl font-black">Total Mastery</h3>
                   <p className="text-slate-500 text-sm">You have earned {sc} SC across all sessions.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* PAGE 3: EXAM REGISTRY */}
          {activeTab === 'exams' && (
            <motion.div key="exams" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Exam Registry</h2>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" onSubmit={(e:any) => {
                  e.preventDefault();
                  addExamMark(e.target.sub.value, Number(e.target.mrk.value));
                  e.target.reset();
                }}>
                  <input name="sub" placeholder="Subject" className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs" required />
                  <input name="mrk" type="number" placeholder="Mark (%)" className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs" required />
                  <button type="submit" className="bg-blue-600 rounded-xl font-black text-[10px] uppercase">Record Mark</button>
                </form>
                
                <div className="space-y-3">
                  {examResults.map((ex, i) => (
                    <div key={i} className="flex justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                      <span className="font-black text-xs uppercase text-slate-400">{ex.subject}</span>
                      <span className="font-mono font-black text-emerald-400">{ex.mark}%</span>
                      <span className="text-[10px] text-slate-600">{ex.date}</span>
                    </div>
                  )).reverse()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function NavButton({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-blue-600 shadow-lg shadow-blue-500/20 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      {icon} <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function TaskSection({ title, children }: any) {
  return (
    <div>
      <h3 className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.3em] mb-4 ml-2">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function TaskRow({ name, sc, onClick, icon }: any) {
  return (
    <motion.div whileHover={{ x: 5 }} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="text-blue-400">{icon}</div>
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-tight text-white">{name}</span>
          <span className="text-emerald-400 text-[10px] font-bold">+{sc} SC</span>
        </div>
      </div>
      <button onClick={onClick} className="bg-blue-600/20 hover:bg-blue-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all">Claim</button>
    </motion.div>
  );
}