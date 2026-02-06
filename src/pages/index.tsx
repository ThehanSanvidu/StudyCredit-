"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, User, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Minus, Brain, BookOpen, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Sunrise, Dumbbell, Smartphone, Ghost, GraduationCap, Microscope, Palette, Binary, 
  AlertTriangle, Calendar, ShoppingCart, Coffee, FastForward, Gift, Moon, Star, Volume2, Lock,
  SkipForward, SkipBack, Apple, BarChart3, ClipboardList, Home, Monitor, HelpCircle, Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- FULL 10 TRACK LOFI LIBRARY ---
const LOFI_LIBRARY = [
  { id: 't1', name: 'Deep Space Focus', url: 'https://stream.zeno.fm/0r0xa792kwzuv', cost: 0, unlocked: true },
  { id: 't2', name: 'Rainy Night Desk', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cost: 100, unlocked: false },
  { id: 't3', name: 'Cyberpunk Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cost: 150, unlocked: false },
  { id: 't4', name: 'Zen Garden', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cost: 200, unlocked: false },
  { id: 't5', name: 'Midnight Library', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cost: 250, unlocked: false },
  { id: 't6', name: 'Autumn Leaves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cost: 300, unlocked: false },
  { id: 't7', name: 'Neon Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', cost: 350, unlocked: false },
  { id: 't8', name: 'Coffee Shop Vibes', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', cost: 400, unlocked: false },
  { id: 't9', name: 'Vintage Radio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', cost: 450, unlocked: false },
  { id: 't10', name: 'Nebula Drift', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', cost: 500, unlocked: false },
];

const SUBJECTS = ["Physics", "Chemistry", "General English", "Applied Maths", "Pure Maths", "General Knowledge"];

export default function ScholarOS() {
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'exams' | 'store'>('home');
  const [sc, setSc] = useState(0);
  const [name, setName] = useState("");
  const [isGhostMode, setIsGhostMode] = useState(false);
  
  // Timer/Stopwatch State
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(1500);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Lofi State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [unlockedTracks, setUnlockedTracks] = useState(['t1']);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stats for Charts & Exams
  const [dailyHistory, setDailyHistory] = useState<{date: string, sc: number}[]>([]);
  const [examResults, setExamResults] = useState<{subject: string, mark: number, date: string}[]>([]);

  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setUnlockedTracks(JSON.parse(localStorage.getItem(`tracks_${savedName}`) || '["t1"]'));
    setDailyHistory(JSON.parse(localStorage.getItem(`history_${savedName}`) || '[]'));
    setExamResults(JSON.parse(localStorage.getItem(`exams_${savedName}`) || '[]'));

    audioRef.current = new Audio(LOFI_LIBRARY[0].url);
    audioRef.current.onended = () => handleNextTrack();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        if (timerMode === 'pomodoro') {
          if (timeLeft > 0) setTimeLeft(t => t - 1);
          else { setIsActive(false); addSC(50); confetti(); }
        } else {
          setStopwatchTime(s => s + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timerMode, timeLeft, stopwatchTime]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = LOFI_LIBRARY[currentTrackIdx].url;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentTrackIdx]);

  const handleNextTrack = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % LOFI_LIBRARY.length);
  };

  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem(`sc_${name}`, total.toString());
    const today = new Date().toLocaleDateString();
    const newHist = [...dailyHistory];
    const idx = newHist.findIndex(h => h.date === today);
    idx > -1 ? newHist[idx].sc += amount : newHist.push({ date: today, sc: amount });
    setDailyHistory(newHist);
    localStorage.setItem(`history_${name}`, JSON.stringify(newHist));
    confetti();
  };

  const addExamMark = (subject: string, mark: number) => {
    const newResult = { subject, mark, date: new Date().toLocaleDateString() };
    const updated = [...examResults, newResult];
    setExamResults(updated);
    localStorage.setItem(`exams_${name}`, JSON.stringify(updated));
  };

  const buyItem = (cost: number, id: string, isTrack = false) => {
    if (sc >= cost) {
      setSc(s => s - cost);
      if (isTrack) {
        const newTracks = [...unlockedTracks, id];
        setUnlockedTracks(newTracks);
        localStorage.setItem(`tracks_${name}`, JSON.stringify(newTracks));
      }
      alert("Reward Unlocked! 🎁");
    } else {
      alert("Not enough SC! ❌");
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen ${isGhostMode ? 'bg-black' : 'bg-[#02040a]'} text-white font-sans flex overflow-hidden relative`}>
      
      {/* 🧊 LIQUID GLASS BUBBLES */}
      {!isGhostMode && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} 
              animate={{ x: [0, 400, 0], y: [0, 300, 0] }} 
              transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-80 h-80 rounded-full bg-blue-500/5 blur-[120px]" 
            />
          ))}
        </div>
      )}

      {/* 👻 GHOST MODE + TIMER/STOPWATCH */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <div className="flex gap-6 mb-12 opacity-30 text-[10px] font-black tracking-widest">
              <button onClick={() => setTimerMode('pomodoro')} className={timerMode==='pomodoro' ? 'text-white underline' : ''}>TIMER</button>
              <button onClick={() => setTimerMode('stopwatch')} className={timerMode==='stopwatch' ? 'text-white underline' : ''}>STOPWATCH</button>
            </div>
            <h1 className="text-[14rem] font-mono font-black tracking-tighter leading-none">
              {formatTime(timerMode === 'pomodoro' ? timeLeft : stopwatchTime)}
            </h1>
            <div className="flex gap-4 mt-12">
              <button onClick={() => setIsActive(!isActive)} className="px-12 py-4 bg-white text-black font-black uppercase text-xs rounded-full shadow-2xl shadow-white/20">{isActive ? 'Pause' : 'Start'}</button>
              <button onClick={() => setIsGhostMode(false)} className="px-8 py-4 text-white/20 hover:text-white uppercase text-[10px] font-black tracking-widest">[ Terminate Ghost ]</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛰️ SIDEBAR */}
      <nav className="w-20 lg:w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col gap-6 z-50 backdrop-blur-3xl">
        <div className="flex items-center gap-3 mb-10">
          <Zap className="text-blue-500" /> <span className="hidden lg:block font-black text-xl tracking-tighter">SCHOLAR OS</span>
        </div>
        <NavBtn icon={<Home/>} label="Terminal" active={activeTab==='home'} onClick={()=>setActiveTab('home')}/>
        <NavBtn icon={<BarChart3/>} label="Analytics" active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')}/>
        <NavBtn icon={<ClipboardList/>} label="Exams" active={activeTab==='exams'} onClick={()=>setActiveTab('exams')}/>
        <NavBtn icon={<ShoppingCart/>} label="Store" active={activeTab==='store'} onClick={()=>setActiveTab('store')}/>
        <div className="mt-auto">
          <button onClick={()=>setIsGhostMode(true)} className="w-full p-4 flex items-center gap-3 text-purple-400 hover:bg-purple-500/10 rounded-2xl transition-all">
            <Ghost size={20}/> <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">Ghost Protocol</span>
          </button>
        </div>
      </nav>

      {/* 📺 MAIN AREA */}
      <main className="flex-1 p-10 overflow-y-auto relative z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* TERMINAL PAGE */}
          {activeTab === 'home' && (
            <motion.div key="h" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                <header className="flex justify-between items-end border-b border-white/10 pb-8">
                  <div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase">Mission Terminal</h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">A/L Level - {name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-mono font-black text-emerald-400">{sc}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SC Balance</p>
                  </div>
                </header>

                <div className="space-y-12 pb-20">
                  <TaskGroup title="1. Core Grind">
                    <TaskItem icon={<Clock/>} name="Deep Work Hour" sc={30} onClick={()=>addSC(30)} /> [cite: 2]
                    <TaskItem icon={<RotateCcw/>} name="Pomodoro Streak" sc={50} onClick={()=>addSC(50)} /> [cite: 2]
                    <TaskItem icon={<GraduationCap/>} name="Syllabus Progress" sc={40} onClick={()=>addSC(40)} /> [cite: 2]
                    <TaskItem icon={<Edit3/>} name="Ultra-Summary (1-Page)" sc={35} onClick={()=>addSC(35)} /> [cite: 2]
                    <TaskItem icon={<Layout/>} name="The Clean Slate" sc={15} onClick={()=>addSC(15)} /> [cite: 2]
                    <TaskItem icon={<Calendar/>} name="End-of-Day Review" sc={20} onClick={()=>addSC(20)} /> [cite: 2]
                  </TaskGroup>

                  <TaskGroup title="2. Subject Specific">
                    <TaskItem icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={()=>addSC(30)} /> [cite: 2]
                    <TaskItem icon={<Calculator/>} name="Maths: Part B Complex Q" sc={25} onClick={()=>addSC(25)} /> [cite: 2]
                    <TaskItem icon={<Wand2/>} name="Physics: The Architect (Derivation)" sc={30} onClick={()=>addSC(30)} /> [cite: 2]
                    <TaskItem icon={<Palette/>} name="Physics: Visualizer (Diagram)" sc={15} onClick={()=>addSC(15)} /> [cite: 2]
                    <TaskItem icon={<Beaker/>} name="Chemistry: The Alchemist (Synthesis)" sc={30} onClick={()=>addSC(30)} /> [cite: 2]
                    <TaskItem icon={<Microscope/>} name="Chemistry: Color Guru (Tests)" sc={25} onClick={()=>addSC(25)} /> [cite: 3]
                    <TaskItem icon={<FlaskConical/>} name="The Balancer (Redox)" sc={20} onClick={()=>addSC(20)} /> [cite: 3]
                    <TaskItem icon={<Plus/>} name="Stoichiometry Master" sc={20} onClick={()=>addSC(20)} /> [cite: 3]
                  </TaskGroup>

                  <TaskGroup title="3. Heroic Feats">
                    <TaskItem icon={<Sword/>} name="The Full Mock (3hr)" sc={150} onClick={()=>addSC(150)} gold /> [cite: 3]
                    <TaskItem icon={<Target/>} name="The Weakness Slayer" sc={80} onClick={()=>addSC(80)} /> [cite: 3]
                    <TaskItem icon={<AlertTriangle/>} name="The Error Log" sc={60} onClick={()=>addSC(60)} /> [cite: 3]
                    <TaskItem icon={<Trophy/>} name="Perfect Week Bonus" sc={250} onClick={()=>addSC(250)} gold /> [cite: 3]
                    <TaskItem icon={<FastForward/>} name="Inter-Subject Linkage" sc={70} onClick={()=>addSC(70)} /> [cite: 3]
                  </TaskGroup>
                </div>
              </div>

              <aside className="lg:col-span-4">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 sticky top-10 backdrop-blur-3xl">
                  <h3 className="text-xs font-black text-indigo-400 mb-6 uppercase tracking-[0.3em] flex items-center gap-2"><Music size={16}/> Lofi Deck</h3>
                  <div className="text-center mb-8">
                    <p className="text-[10px] font-black text-white/40 mb-3 uppercase tracking-tighter">{LOFI_LIBRARY[currentTrackIdx].name}</p>
                    <div className="flex items-center justify-center gap-8">
                      <button onClick={() => setCurrentTrackIdx(p => (p === 0 ? LOFI_LIBRARY.length-1 : p-1))}><SkipBack size={20}/></button>
                      <button onClick={() => { setIsPlaying(!isPlaying); isPlaying ? audioRef.current?.pause() : audioRef.current?.play(); }} 
                        className="p-6 bg-indigo-600 rounded-full shadow-2xl shadow-indigo-500/40">{isPlaying ? <Pause fill="white"/> : <Play fill="white"/>}</button>
                      <button onClick={handleNextTrack}><SkipForward size={20}/></button>
                    </div>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {/* EXAMS PAGE */}
          {activeTab === 'exams' && (
            <motion.div key="e" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-4xl mx-auto space-y-10">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Exam Registry</h2>
              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" onSubmit={(e:any) => {
                  e.preventDefault();
                  addExamMark(e.target.sub.value, Number(e.target.mrk.value));
                  e.target.reset();
                }}>
                  <select name="sub" className="bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-black uppercase tracking-widest focus:ring-2 ring-blue-500" required>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input name="mrk" type="number" placeholder="Mark (%)" className="bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-black focus:ring-2 ring-blue-500" required />
                  <button type="submit" className="bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">Record Result</button>
                </form>
                
                <div className="space-y-4">
                  {examResults.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center p-6 bg-black/20 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="font-black text-xs uppercase text-slate-400 tracking-widest">{ex.subject}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-2xl text-emerald-400">{ex.mark}%</span>
                        <p className="text-[8px] text-slate-600 font-bold mt-1 uppercase tracking-widest">{ex.date}</p>
                      </div>
                    </div>
                  )).reverse()}
                </div>
              </div>
            </motion.div>
          )}

          {/* STORE PAGE */}
          {activeTab === 'store' && (
            <motion.div key="s" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-5xl mx-auto space-y-10 pb-20">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Reward Store</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <StoreCard title="LOFI UNLOCKS">
                  {LOFI_LIBRARY.map(t => (
                    <StoreItem key={t.id} name={t.name} cost={t.cost} unlocked={unlockedTracks.includes(t.id)} onClick={()=>buyItem(t.cost, t.id, true)} />
                  ))}
                </StoreCard>
                <StoreCard title="REAL WORLD PERKS">
                  <StoreItem name="Coffee/Tea Break" cost={50} onClick={()=>buyItem(50, 'cb')} />
                  <StoreItem name="Gaming Unlock (1hr)" cost={250} onClick={()=>buyItem(250, 'gu')} />
                  <StoreItem name="Cheat Meal Reward" cost={500} onClick={()=>buyItem(500, 'cm')} />
                  <StoreItem name="Nap/Early Finish" cost={150} onClick={()=>buyItem(150, 'en')} />
                </StoreCard>
              </div>
            </motion.div>
          )}

          {/* ANALYTICS PAGE */}
          {activeTab === 'analytics' && (
            <motion.div key="a" initial={{opacity:0}} animate={{opacity:1}} className="space-y-12">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Mastery Analysis</h2>
              <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 h-80 flex items-end gap-6 shadow-2xl">
                {dailyHistory.slice(-10).map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-6">
                    <motion.div initial={{height:0}} animate={{height: `${(h.sc/350)*100}%`}} className="w-full bg-blue-500/80 rounded-t-2xl shadow-lg shadow-blue-500/10" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">{h.date.split('/')[0]}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function NavBtn({icon, label, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`w-full p-4 flex items-center gap-5 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      {icon} <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function TaskGroup({title, children}: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] ml-6">{title}</h3>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function TaskItem({name, sc, icon, onClick, gold}: any) {
  return (
    <div className={`p-6 rounded-[2rem] border transition-all hover:translate-x-2 flex items-center justify-between ${gold ? 'bg-yellow-500/10 border-yellow-500/20 shadow-lg shadow-yellow-500/5' : 'bg-white/5 border-white/10'}`}>
      <div className="flex items-center gap-5">
        <div className={gold ? 'text-yellow-500' : 'text-blue-500'}>{icon}</div>
        <div>
          <p className="text-xs font-black uppercase text-white tracking-tight">{name}</p>
          <p className="text-emerald-400 text-[10px] font-bold tracking-widest">+{sc} SC</p>
        </div>
      </div>
      <button onClick={onClick} className="px-6 py-2.5 bg-blue-600/20 hover:bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Claim</button>
    </div>
  );
}

function StoreCard({title, children}: any) {
  return (
    <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-md">
      <h4 className="text-[11px] font-black text-slate-500 mb-8 uppercase tracking-[0.3em]">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function StoreItem({name, cost, unlocked, onClick}: any) {
  return (
    <div onClick={unlocked ? undefined : onClick} className="flex justify-between items-center p-5 bg-black/30 rounded-2xl border border-white/5 cursor-pointer hover:border-blue-500/30 transition-all">
      <span className="text-[10px] font-black uppercase text-white/70 tracking-tight">{name}</span>
      <span className="text-[10px] font-black text-emerald-400 tracking-widest">{unlocked ? 'ACTIVE' : `-${cost} SC`}</span>
    </div>
  );
}