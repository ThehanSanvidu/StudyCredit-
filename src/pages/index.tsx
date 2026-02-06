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

// --- TYPES & INTERFACES ---
interface ExamResult { subject: string; mark: number; date: string; }
interface HistoryEntry { date: string; sc: number; }
interface Track { id: string; name: string; url: string; cost: number; unlocked: boolean; }

// --- DATA ---
const SUBJECTS = ["Physics", "Chemistry", "General English", "Applied Maths", "Pure Maths", "General Knowledge"];
const LOFI_LIBRARY: Track[] = [
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
  const [name, setName] = useState("Scholar");
  const [isGhostMode, setIsGhostMode] = useState(false);
  
  // Timer/Stopwatch State
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(1500);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Lofi State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [unlockedTracks, setUnlockedTracks] = useState<string[]>(['t1']);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stats & Analysis Data
  const [dailyHistory, setDailyHistory] = useState<HistoryEntry[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  // Initialize Data
  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Thehan";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setUnlockedTracks(JSON.parse(localStorage.getItem(`tracks_${savedName}`) || '["t1"]'));
    setDailyHistory(JSON.parse(localStorage.getItem(`history_${savedName}`) || '[]'));
    setExamResults(JSON.parse(localStorage.getItem(`exams_${savedName}`) || '[]'));

    audioRef.current = new Audio(LOFI_LIBRARY[0].url);
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
  }, [isActive, timerMode, timeLeft, stopwatchTime]);

  // Audio Handler
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = LOFI_LIBRARY[currentTrackIdx].url;
      if (isPlaying) audioRef.current.play().catch(e => console.log("Playback interrupted"));
    }
  }, [currentTrackIdx]);

  const handleNextTrack = () => setCurrentTrackIdx((prev) => (prev + 1) % LOFI_LIBRARY.length);

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
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
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
    } else { alert("Insufficient SC! ❌"); }
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
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} 
              animate={{ x: [0, 200, 0], y: [0, 400, 0] }} 
              transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-96 h-96 rounded-full bg-blue-500/5 blur-[130px]" 
            />
          ))}
        </div>
      )}

      {/* 👻 GHOST PROTOCOL (TIMER/STOPWATCH) */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <div className="flex gap-10 mb-16 opacity-20 text-[10px] font-black tracking-[0.5em]">
              <button onClick={() => setTimerMode('pomodoro')} className={timerMode==='pomodoro' ? 'text-white underline' : ''}>TIMER</button>
              <button onClick={() => setTimerMode('stopwatch')} className={timerMode==='stopwatch' ? 'text-white underline' : ''}>STOPWATCH</button>
            </div>
            <h1 className="text-[16rem] font-mono font-black tracking-tighter leading-none">
              {formatTime(timerMode === 'pomodoro' ? timeLeft : stopwatchTime)}
            </h1>
            <div className="flex gap-6 mt-16">
              <button onClick={() => setIsActive(!isActive)} className="px-16 py-5 bg-white text-black font-black uppercase text-xs rounded-full">{isActive ? 'Pause' : 'Start'}</button>
              <button onClick={() => setIsGhostMode(false)} className="px-10 py-5 text-white/30 hover:text-white uppercase text-[10px] font-black tracking-widest">[ EXIT ]</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛰️ SIDEBAR */}
      <nav className="w-20 lg:w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col gap-8 z-50 backdrop-blur-3xl">
        <div className="flex items-center gap-3 mb-12">
          <Zap className="text-blue-500" /> <span className="hidden lg:block font-black text-xl tracking-tighter">SCHOLAR OS</span>
        </div>
        <NavBtn icon={<Home/>} label="Terminal" active={activeTab==='home'} onClick={()=>setActiveTab('home')}/>
        <NavBtn icon={<BarChart3/>} label="Analytics" active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')}/>
        <NavBtn icon={<ClipboardList/>} label="Exams" active={activeTab==='exams'} onClick={()=>setActiveTab('exams')}/>
        <NavBtn icon={<ShoppingCart/>} label="Store" active={activeTab==='store'} onClick={()=>setActiveTab('store')}/>
        <div className="mt-auto">
          <button onClick={()=>setIsGhostMode(true)} className="w-full p-4 flex items-center gap-3 text-purple-400 hover:bg-purple-500/10 rounded-2xl transition-all">
            <Ghost size={20}/> <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">Ghost Mode</span>
          </button>
        </div>
      </nav>

      {/* 📺 MAIN AREA */}
      <main className="flex-1 p-10 overflow-y-auto relative z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* TERMINAL PAGE */}
          {activeTab === 'home' && (
            <motion.div key="h" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-12">
                <header className="flex justify-between items-end">
                  <div>
                    <h2 className="text-6xl font-black tracking-tighter uppercase">Mission Terminal</h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">Level: {name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-mono font-black text-emerald-400">{sc}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase">SC Balance</p>
                  </div>
                </header>

                <div className="space-y-10 pb-20">
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
                    <TaskItem icon={<Wand2/>} name="Physics: The Architect" sc={30} onClick={()=>addSC(30)} />
                    <TaskItem icon={<Palette/>} name="Physics: Visualizer" sc={15} onClick={()=>addSC(15)} />
                    <TaskItem icon={<Beaker/>} name="Chemistry: The Alchemist" sc={30} onClick={()=>addSC(30)} />
                    <TaskItem icon={<Brain/>} name="Organic Synthesis Chain" sc={35} onClick={()=>addSC(35)} />
                    <TaskItem icon={<FlaskConical/>} name="The Balancer (Redox)" sc={20} onClick={()=>addSC(20)} />
                  </TaskGroup>

                  <TaskGroup title="3. Heroic Achievements">
                    <TaskItem icon={<Sword/>} name="The Full Mock (3hr)" sc={150} onClick={()=>addSC(150)} gold />
                    <TaskItem icon={<Target/>} name="The Weakness Slayer" sc={80} onClick={()=>addSC(80)} />
                    <TaskItem icon={<Trophy/>} name="Perfect Week Bonus" sc={250} onClick={()=>addSC(250)} gold />
                  </TaskGroup>
                </div>
              </div>

              <aside className="lg:col-span-4">
                <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 sticky top-10 backdrop-blur-3xl">
                  <h3 className="text-xs font-black text-indigo-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-2"><Music size={16}/> Lofi Player</h3>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-white/30 mb-4 uppercase">{LOFI_LIBRARY[currentTrackIdx].name}</p>
                    <div className="flex items-center justify-center gap-10">
                      <button onClick={() => setCurrentTrackIdx(p => (p === 0 ? LOFI_LIBRARY.length-1 : p-1))}><SkipBack size={24}/></button>
                      <button onClick={() => { setIsPlaying(!isPlaying); isPlaying ? audioRef.current?.pause() : audioRef.current?.play(); }} 
                        className="p-8 bg-indigo-600 rounded-full shadow-2xl">{isPlaying ? <Pause fill="white"/> : <Play fill="white"/>}</button>
                      <button onClick={handleNextTrack}><SkipForward size={24}/></button>
                    </div>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {/* ANALYTICS PAGE (FIXED) */}
          {activeTab === 'analytics' && (
            <motion.div key="a" initial={{opacity:0}} animate={{opacity:1}} className="space-y-12">
              <h2 className="text-6xl font-black uppercase tracking-tighter">Mastery Analysis</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 flex flex-col items-center">
                    <Target className="text-emerald-400 mb-4" size={40}/>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Total SC Earned</p>
                    <h4 className="text-4xl font-mono font-black mt-2">{sc}</h4>
                </div>
                <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 flex flex-col items-center">
                    <Flame className="text-orange-400 mb-4" size={40}/>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Study Days</p>
                    <h4 className="text-4xl font-mono font-black mt-2">{dailyHistory.length}</h4>
                </div>
              </div>
              
              <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 h-96 flex items-end gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-10 left-10 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Credits Per Day</div>
                {dailyHistory.length > 0 ? dailyHistory.slice(-7).map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-6">
                    <motion.div initial={{height:0}} animate={{height: `${Math.min((h.sc/300)*100, 100)}%`}} className="w-full bg-blue-600/60 rounded-t-2xl shadow-lg border-t border-blue-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{h.date.split('/')[0]}</span>
                  </div>
                )) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-black uppercase text-xs">No Data Logged Yet</div>
                )}
              </div>
            </motion.div>
          )}

          {/* EXAMS PAGE (RE-RESTORED) */}
          {activeTab === 'exams' && (
            <motion.div key="e" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-4xl mx-auto space-y-12">
              <h2 className="text-6xl font-black uppercase tracking-tighter text-center">Exam Registry</h2>
              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" onSubmit={(e:any) => {
                  e.preventDefault();
                  addExamMark(e.target.sub.value, Number(e.target.mrk.value));
                  e.target.reset();
                }}>
                  <select name="sub" className="bg-black/40 border border-white/10 rounded-2xl p-5 text-[10px] font-black uppercase tracking-widest" required>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input name="mrk" type="number" placeholder="Mark (%)" className="bg-black/40 border border-white/10 rounded-2xl p-5 text-xs font-black" required />
                  <button type="submit" className="bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/30">Record</button>
                </form>
                
                <div className="space-y-5">
                  {examResults.length > 0 ? examResults.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center p-6 bg-black/30 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_blue]" />
                        <span className="font-black text-xs uppercase text-slate-400 tracking-widest">{ex.subject}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-2xl text-emerald-400">{ex.mark}%</span>
                        <p className="text-[8px] text-slate-600 font-bold mt-1 uppercase tracking-widest">{ex.date}</p>
                      </div>
                    </div>
                  )).reverse() : <p className="text-center text-slate-600 font-black uppercase text-[10px] py-10">No Exam Records Found</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* STORE PAGE */}
          {activeTab === 'store' && (
            <motion.div key="s" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-5xl mx-auto space-y-12 pb-20">
              <h2 className="text-6xl font-black uppercase tracking-tighter">Marketplace</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <StoreCard title="LOFI BEATS">
                  {LOFI_LIBRARY.map(t => (
                    <StoreItem key={t.id} name={t.name} cost={t.cost} unlocked={unlockedTracks.includes(t.id)} onClick={()=>buyItem(t.cost, t.id, true)} />
                  ))}
                </StoreCard>
                <StoreCard title="REAL WORLD PERKS">
                  <StoreItem name="Coffee Break (15m)" cost={50} onClick={()=>buyItem(50, 'cb')} />
                  <StoreItem name="Gaming Unlock (1hr)" cost={250} onClick={()=>buyItem(250, 'gu')} />
                  <StoreItem name="Cheat Meal Reward" cost={500} onClick={()=>buyItem(500, 'cm')} />
                  <StoreItem name="Nap/Early Finish" cost={150} onClick={()=>buyItem(150, 'en')} />
                </StoreCard>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function NavBtn({icon, label, active, onClick}: {icon: any, label: string, active: boolean, onClick: () => void}) {
  return (
    <button onClick={onClick} className={`w-full p-5 flex items-center gap-5 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      {icon} <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function TaskGroup({title, children}: {title: string, children: any}) {
  return (
    <div className="space-y-6">
      <h3 className="text-[11px] font-black text-blue-400/60 uppercase tracking-[0.5em] ml-6">{title}</h3>
      <div className="grid md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function TaskItem({name, sc, icon, onClick, gold}: {name: string, sc: number, icon: any, onClick: () => void, gold?: boolean}) {
  return (
    <motion.div whileHover={{ x: 5 }} className={`p-6 rounded-[2.5rem] border transition-all flex items-center justify-between ${gold ? 'bg-yellow-500/10 border-yellow-500/20 shadow-lg shadow-yellow-500/5' : 'bg-white/5 border-white/10'}`}>
      <div className="flex items-center gap-6">
        <div className={gold ? 'text-yellow-500' : 'text-blue-500'}>{icon}</div>
        <div>
          <p className="text-xs font-black uppercase text-white tracking-tight leading-none">{name}</p>
          <p className="text-emerald-400 text-[10px] font-bold tracking-widest mt-2">+{sc} SC</p>
        </div>
      </div>
      <button onClick={onClick} className="px-6 py-3 bg-blue-600/10 hover:bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Claim</button>
    </motion.div>
  );
}

function StoreCard({title, children}: {title: string, children: any}) {
  return (
    <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 shadow-2xl backdrop-blur-md">
      <h4 className="text-[11px] font-black text-slate-500 mb-10 uppercase tracking-[0.4em]">{title}</h4>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function StoreItem({name, cost, unlocked, onClick}: {name: string, cost: number, unlocked?: boolean, onClick: () => void}) {
  return (
    <div onClick={unlocked ? undefined : onClick} className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-white/5 cursor-pointer hover:border-blue-500/40 transition-all">
      <span className="text-[10px] font-black uppercase text-white/70 tracking-tight">{name}</span>
      <span className="text-[10px] font-black text-emerald-400 tracking-widest">{unlocked ? 'ACTIVE' : `-${cost} SC`}</span>
    </div>
  );
}