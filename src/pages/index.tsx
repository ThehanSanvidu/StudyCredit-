"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, User, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Minus, Brain, BookOpen, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Sunrise, Dumbbell, Smartphone, Ghost, GraduationCap, Microscope, Palette, Binary, 
  AlertTriangle, Calendar, ShoppingCart, Coffee, FastForward, Gift, Moon, Star, Volume2, Lock,
  SkipForward, SkipBack, Apple, BarChart3, ClipboardList, Home, Monitor
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

export default function ScholarOS() {
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'exams' | 'store'>('home');
  const [sc, setSc] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
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

  // Stats for Charts
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
    audioRef.current.loop = false; // Set to false to handle manual looping logic
    audioRef.current.onended = () => handleNextTrack();
  }, []);

  // Timer/Stopwatch Logic
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
  }, [isActive, timerMode, timeLeft]);

  // Audio Logic
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
    if (idx > -1) newHist[idx].sc += amount;
    else newHist.push({ date: today, sc: amount });
    setDailyHistory(newHist);
    localStorage.setItem(`history_${name}`, JSON.stringify(newHist));
    confetti();
  };

  const buyItem = (cost: number, id: string, isTrack = false) => {
    if (sc >= cost) {
      setSc(s => s - cost);
      if (isTrack) {
        const newTracks = [...unlockedTracks, id];
        setUnlockedTracks(newTracks);
        localStorage.setItem(`tracks_${name}`, JSON.stringify(newTracks));
      }
      alert("Purchase Successful! 🎁");
    } else {
      alert("Insufficient SC! ❌");
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen ${isGhostMode ? 'bg-black' : 'bg-[#02040a]'} text-white font-sans flex overflow-hidden relative`}>
      
      {/* 🧊 LIQUID GLASS BACKGROUND BUBBLES */}
      {!isGhostMode && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#02040a] to-[#1a0b2e]" />
          {[...Array(10)].map((_, i) => (
            <motion.div key={i} 
              animate={{ 
                x: [Math.random()*100, Math.random()*800, Math.random()*100], 
                y: [Math.random()*100, Math.random()*500, Math.random()*100] 
              }} 
              transition={{ duration: 20 + i * 2, repeat: Infinity, ease: "linear" }}
              className="absolute w-64 h-64 rounded-full bg-blue-500/5 blur-[100px]" 
            />
          ))}
        </div>
      )}

      {/* 👻 GHOST MODE OVERLAY (TIMER + STOPWATCH) */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <div className="flex gap-8 mb-10 opacity-30">
              <button onClick={() => setTimerMode('pomodoro')} className={timerMode==='pomodoro' ? 'text-white font-black' : ''}>TIMER</button>
              <button onClick={() => setTimerMode('stopwatch')} className={timerMode==='stopwatch' ? 'text-white font-black' : ''}>STOPWATCH</button>
            </div>
            <h1 className="text-[15rem] font-mono font-black tracking-tighter leading-none">
              {formatTime(timerMode === 'pomodoro' ? timeLeft : stopwatchTime)}
            </h1>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsActive(!isActive)} className="px-10 py-4 bg-white text-black font-black uppercase text-xs rounded-full">{isActive ? 'Pause' : 'Start'}</button>
              <button onClick={() => setIsGhostMode(false)} className="px-10 py-4 border border-white/20 text-white/40 font-black uppercase text-xs rounded-full hover:text-white transition-all">[ Exit Protocol ]</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛰️ SIDEBAR NAVIGATION */}
      <nav className="w-20 lg:w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col gap-6 z-50 backdrop-blur-3xl">
        <div className="flex items-center gap-3 mb-10">
          <Zap className="text-blue-500" /> <span className="hidden lg:block font-black text-xl tracking-tighter">SCHOLAR OS</span>
        </div>
        <NavBtn icon={<Home/>} label="Terminal" active={activeTab==='home'} onClick={()=>setActiveTab('home')}/>
        <NavBtn icon={<BarChart3/>} label="Analytics" active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')}/>
        <NavBtn icon={<ClipboardList/>} label="Exams" active={activeTab==='exams'} onClick={()=>setActiveTab('exams')}/>
        <NavBtn icon={<ShoppingCart/>} label="Store" active={activeTab==='store'} onClick={()=>setActiveTab('store')}/>
        <div className="mt-auto space-y-2">
          <button onClick={()=>setIsGhostMode(true)} className="w-full p-4 flex items-center gap-3 text-purple-400 hover:bg-purple-500/10 rounded-2xl transition-all">
            <Ghost size={20}/> <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">Ghost Mode</span>
          </button>
        </div>
      </nav>

      {/* 📺 MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          
          {/* HOME: TERMINAL & LOFI */}
          {activeTab === 'home' && (
            <motion.div key="h" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                <header className="flex justify-between items-end">
                  <div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase">Mission Terminal</h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">A/L Level Grind</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-mono font-black text-emerald-400">{sc}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Credits Available</p>
                  </div>
                </header>

                <div className="space-y-8 pb-20">
                  <TaskGroup title="1. Core Grind">
                    <TaskItem icon={<Clock/>} name="Deep Work Hour" sc={30} onClick={()=>addSC(30)} />
                    <TaskItem icon={<RotateCcw/>} name="Pomodoro Streak" sc={50} onClick={()=>addSC(50)} />
                    <TaskItem icon={<GraduationCap/>} name="Syllabus Progress" sc={40} onClick={()=>addSC(40)} />
                    <TaskItem icon={<Edit3/>} name="Ultra-Summary (1-Page)" sc={35} onClick={()=>addSC(35)} />
                    <TaskItem icon={<Layout/>} name="The Clean Slate" sc={15} onClick={()=>addSC(15)} />
                    <TaskItem icon={<Calendar/>} name="End-of-Day Review" sc={20} onClick={()=>addSC(20)} />
                  </TaskGroup>

                  <TaskGroup title="2. Subject Specific">
                    <TaskItem icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={()=>addSC(30)} />
                    <TaskItem icon={<Calculator/>} name="Maths: Part B Complex Q" sc={25} onClick={()=>addSC(25)} />
                    <TaskItem icon={<Wand2/>} name="Physics: The Architect (Derivation)" sc={30} onClick={()=>addSC(30)} />
                    <TaskItem icon={<Palette/>} name="Physics: Visualizer (Diagram)" sc={15} onClick={()=>addSC(15)} />
                    <TaskItem icon={<Beaker/>} name="Chemistry: The Alchemist (Synthesis)" sc={30} onClick={()=>addSC(30)} />
                    <TaskItem icon={<Microscope/>} name="Chemistry: Color Guru (Tests)" sc={25} onClick={()=>addSC(25)} />
                    <TaskItem icon={<FlaskConical/>} name="The Balancer (Redox)" sc={20} onClick={()=>addSC(20)} />
                    <TaskItem icon={<Plus/>} name="Stoichiometry Master" sc={20} onClick={()=>addSC(20)} />
                  </TaskGroup>

                  <TaskGroup title="3. Multipliers & Heroic">
                    <TaskItem icon={<Sunrise/>} name="Early Bird (Pre-7AM)" sc={40} onClick={()=>addSC(40)} />
                    <TaskItem icon={<User/>} name="The Teacher (Feynman)" sc={50} onClick={()=>addSC(50)} />
                    <TaskItem icon={<Smartphone/>} name="No-Phone (4hr+)" sc={20} onClick={()=>addSC(20)} />
                    <TaskItem icon={<Apple/>} name="Nutrition Boost" sc={10} onClick={()=>addSC(10)} />
                    <TaskItem icon={<Sword/>} name="The Full Mock (3hr)" sc={150} onClick={()=>addSC(150)} gold />
                    <TaskItem icon={<Target/>} name="The Weakness Slayer" sc={80} onClick={()=>addSC(80)} />
                    <TaskItem icon={<Trophy/>} name="Perfect Week Bonus" sc={250} onClick={()=>addSC(250)} gold />
                  </TaskGroup>
                </div>
              </div>

              {/* LOFI CONTROLLER */}
              <aside className="lg:col-span-4">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 sticky top-10">
                  <h3 className="text-xs font-black text-indigo-400 mb-6 uppercase tracking-widest flex items-center gap-2"><Music size={16}/> Sound Deck</h3>
                  <div className="text-center mb-8">
                    <p className="text-[10px] font-black text-white/40 mb-2 uppercase">{LOFI_LIBRARY[currentTrackIdx].name}</p>
                    <div className="flex items-center justify-center gap-6">
                      <button onClick={() => setCurrentTrackIdx(p => (p === 0 ? LOFI_LIBRARY.length-1 : p-1))}><SkipBack/></button>
                      <button onClick={() => { setIsPlaying(!isPlaying); isPlaying ? audioRef.current?.pause() : audioRef.current?.play(); }} 
                        className="p-5 bg-indigo-600 rounded-full shadow-xl shadow-indigo-500/20"><Pause fill="currentColor"/></button>
                      <button onClick={handleNextTrack}><SkipForward/></button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {LOFI_LIBRARY.map((t, i) => (
                      <div key={t.id} className={`flex justify-between p-3 rounded-xl text-[10px] font-bold ${currentTrackIdx === i ? 'bg-indigo-600/20 text-indigo-400' : 'bg-black/20 text-white/40'}`}>
                        <span>{t.name}</span>
                        {unlockedTracks.includes(t.id) ? <CheckCircle size={12}/> : <Lock size={12}/>}
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {/* STORE PAGE */}
          {activeTab === 'store' && (
            <motion.div key="s" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-4xl mx-auto space-y-10">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Rewards Emporium</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <StoreCard title="LOFI BEATS">
                  {LOFI_LIBRARY.map(t => (
                    <StoreItem key={t.id} name={t.name} cost={t.cost} unlocked={unlockedTracks.includes(t.id)} onClick={()=>buyItem(t.cost, t.id, true)} />
                  ))}
                </StoreCard>
                <StoreCard title="REAL WORLD PERKS">
                  <StoreItem name="Coffee Break (15m)" cost={50} onClick={()=>buyItem(50, 'cb')} />
                  <StoreItem name="Gaming Unlock (1hr)" cost={250} onClick={()=>buyItem(250, 'gu')} />
                  <StoreItem name="Cheat Meal Pass" cost={500} onClick={()=>buyItem(500, 'cm')} />
                  <StoreItem name="Early Night Exit" cost={150} onClick={()=>buyItem(150, 'en')} />
                </StoreCard>
              </div>
            </motion.div>
          )}

          {/* ANALYTICS PAGE */}
          {activeTab === 'analytics' && (
            <motion.div key="a" initial={{opacity:0}} animate={{opacity:1}} className="space-y-10">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Focus Analytics</h2>
              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 h-64 flex items-end gap-4">
                {dailyHistory.slice(-10).map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4">
                    <div className="w-full bg-blue-600 rounded-t-xl" style={{ height: `${(h.sc/300)*100}%` }} />
                    <span className="text-[8px] font-black text-slate-500">{h.date.split('/')[0]}</span>
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

// --- UI HELPERS ---
function NavBtn({icon, label, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`w-full p-4 flex items-center gap-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      {icon} <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function TaskGroup({title, children}: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] ml-4">{title}</h3>
      <div className="grid md:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function TaskItem({name, sc, icon, onClick, gold}: any) {
  return (
    <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.02] ${gold ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10'}`}>
      <div className="flex items-center gap-4 text-left">
        <div className={gold ? 'text-yellow-500' : 'text-blue-400'}>{icon}</div>
        <div>
          <p className="text-[10px] font-black uppercase text-white tracking-tight">{name}</p>
          <p className="text-emerald-400 text-[9px] font-bold">+{sc} SC</p>
        </div>
      </div>
      <button onClick={onClick} className="px-4 py-2 bg-blue-600 rounded-xl text-[9px] font-black uppercase">Claim</button>
    </div>
  );
}

function StoreCard({title, children}: any) {
  return (
    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
      <h4 className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-widest">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function StoreItem({name, cost, unlocked, onClick}: any) {
  return (
    <div onClick={unlocked ? undefined : onClick} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/5 transition-all">
      <span className="text-[10px] font-black uppercase text-white/80">{name}</span>
      <span className="text-[10px] font-black text-emerald-400">{unlocked ? 'OWNED' : `-${cost} SC`}</span>
    </div>
  );
}