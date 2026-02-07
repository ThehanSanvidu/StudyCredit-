"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Brain, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Ghost, GraduationCap, Microscope, Palette, Binary, Calendar, 
  ShoppingCart, Coffee, FastForward, Star, SkipForward, SkipBack, Apple, 
  BarChart3, ClipboardList, Home, Radio, Disc, Volume2, Timer, Settings
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- CONSTANTS ---
const SUBJECTS = ["Physics", "Chemistry", "General English", "Applied Maths", "Pure Maths", "General Knowledge"];
const PROFILE_EMOJIS = ["👨‍🎓", "🧠", "⚡", "🚀", "🔭", "🧪", "🧬", "📚", "🏆", "🔥", "☄️", "🛡️", "🪐"];

const LOFI_LIBRARY = [
  { id: 't1', name: 'Deep Space Focus', url: 'https://stream.zeno.fm/0r0xa792kwzuv', cost: 0, unlocked: true },
  { id: 't2', name: 'Rainy Night Desk', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cost: 100, unlocked: false },
  { id: 't3', name: 'Cyberpunk Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cost: 150, unlocked: false },
  { id: 't4', name: 'Zen Garden', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cost: 200, unlocked: false },
  { id: 't5', name: 'Midnight Library', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cost: 250, unlocked: false },
  { id: 't6', name: 'Autumn Leaves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cost: 300, unlocked: false },
  { id: 't7', name: 'Neon Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', cost: 350, unlocked: false },
  { id: 't8', name: 'Coffee Shop Vibes', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', cost: 400, unlocked: false },
  { id: 't10', name: 'Nebula Drift', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', cost: 500, unlocked: false },
];

export default function ScholarOS() {
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'exams' | 'store' | 'audio' | 'focus'>('home');
  const [sc, setSc] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0); // Hours Tracker
  const [name, setName] = useState("Scholar");
  const [isGhostMode, setIsGhostMode] = useState(false);
  
  // Stats
  const [streak, setStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState("");
  const [unlockedTracks, setUnlockedTracks] = useState<string[]>(['t1']);
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);
  const [dailyHistory, setDailyHistory] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);

  // Timer/Stopwatch State
  const [focusMode, setFocusMode] = useState<'timer' | 'stopwatch'>('timer');
  const [timeLeft, setTimeLeft] = useState(1500);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  // Audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize
  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setTotalSeconds(Number(localStorage.getItem(`total_secs_${savedName}`)) || 0);
    setStreak(Number(localStorage.getItem(`streak_${savedName}`)) || 0);
    setLastClaimDate(localStorage.getItem(`claim_${savedName}`) || "");
    setUnlockedTracks(JSON.parse(localStorage.getItem(`tracks_${savedName}`) || '["t1"]'));
    setUnlockedRewards(JSON.parse(localStorage.getItem(`rewards_${savedName}`) || '[]'));
    setDailyHistory(JSON.parse(localStorage.getItem(`history_${savedName}`) || '[]'));
    setExamResults(JSON.parse(localStorage.getItem(`exams_${savedName}`) || '[]'));

    audioRef.current = new Audio(LOFI_LIBRARY[0].url);
    audioRef.current.onended = () => setCurrentTrackIdx(p => (p + 1) % LOFI_LIBRARY.length);
  }, []);

  // Timer Core Engine
  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds(s => {
            const next = s + 1;
            localStorage.setItem(`total_secs_${name}`, next.toString());
            return next;
        });

        if (focusMode === 'timer') {
          if (timeLeft > 0) setTimeLeft(t => t - 1);
          else { 
            setIsActive(false); 
            addSC(50); 
            confetti(); 
            alert("Focus Session Complete! +50 SC 🏆");
          }
        } else {
          setStopwatchTime(s => s + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, focusMode, timeLeft, stopwatchTime]);

  // Audio Sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = LOFI_LIBRARY[currentTrackIdx].url;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  }, [currentTrackIdx]);

  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem(`sc_${name}`, total.toString());
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const newHist = [...dailyHistory];
    const idx = newHist.findIndex(h => h.date === today);
    if (idx > -1) newHist[idx].sc += amount;
    else {
        if(newHist.length >= 7) newHist.shift();
        newHist.push({ date: today, sc: amount });
    }
    setDailyHistory(newHist);
    localStorage.setItem(`history_${name}`, JSON.stringify(newHist));
    confetti();
  };

  const claimDaily = () => {
    const today = new Date().toLocaleDateString();
    if (lastClaimDate === today) return alert("System already synced! 🏃‍♂️");
    const newStreak = streak + 1;
    const reward = 50 + (newStreak * 10);
    setStreak(newStreak);
    setLastClaimDate(today);
    addSC(reward);
    localStorage.setItem(`streak_${name}`, newStreak.toString());
    localStorage.setItem(`claim_${name}`, today);
  };

  const buyItem = (cost: number, id: string, type: 'track' | 'virtual' | 'real') => {
    if (sc >= cost) {
      setSc(s => s - cost);
      if (type === 'track') {
        const up = [...unlockedTracks, id];
        setUnlockedTracks(up);
        localStorage.setItem(`tracks_${name}`, JSON.stringify(up));
      } else if (type === 'virtual') {
        const up = [...unlockedRewards, id];
        setUnlockedRewards(up);
        localStorage.setItem(`rewards_${name}`, JSON.stringify(up));
      }
      confetti();
    } else { alert("Insufficient Credits! 💎"); }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalHours = (totalSeconds / 3600).toFixed(1);
  const currentEmoji = PROFILE_EMOJIS[new Date().getDate() % PROFILE_EMOJIS.length];

  return (
    <div className={`min-h-screen ${isGhostMode ? 'bg-black' : 'bg-[#01040a]'} text-white font-sans flex flex-col lg:flex-row overflow-hidden relative`}>
      
      {/* 🧊 RESPONSIVE NAV */}
      <nav className="w-full lg:w-24 xl:w-72 bg-white/5 border-b lg:border-b-0 lg:border-r border-white/10 p-4 lg:p-8 flex lg:flex-col items-center justify-between lg:justify-start gap-4 lg:gap-8 z-[100] backdrop-blur-2xl">
        <div className="flex lg:flex-col items-center gap-4">
          <div className="w-10 h-10 lg:w-20 lg:h-20 bg-blue-600/10 rounded-full border border-blue-500/20 flex items-center justify-center text-2xl lg:text-4xl">
            {currentEmoji}
          </div>
          <div className="hidden xl:block text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{name}</p>
             <p className="text-[9px] font-bold text-orange-400 uppercase mt-1">Streak: {streak} 🔥</p>
          </div>
        </div>

        <div className="flex lg:flex-col gap-2 lg:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar">
          <NavBtn icon={<Home/>} active={activeTab==='home'} onClick={()=>setActiveTab('home')} label="Terminal"/>
          <NavBtn icon={<Timer/>} active={activeTab==='focus'} onClick={()=>setActiveTab('focus')} label="Focus"/>
          <NavBtn icon={<BarChart3/>} active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')} label="Data"/>
          <NavBtn icon={<Radio/>} active={activeTab==='audio'} onClick={()=>setActiveTab('audio')} label="Audio"/>
          <NavBtn icon={<ShoppingCart/>} active={activeTab==='store'} onClick={()=>setActiveTab('store')} label="Vault"/>
        </div>
        
        <button onClick={()=>setIsGhostMode(true)} className="hidden lg:flex mt-auto p-4 text-purple-400 hover:bg-purple-500/10 rounded-2xl transition-all items-center gap-3">
          <Ghost size={20}/> <span className="hidden xl:block text-[10px] font-black tracking-widest">GHOST</span>
        </button>
      </nav>

      {/* 📺 MAIN WORKSPACE */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-12 pb-24 lg:pb-12">
        <AnimatePresence mode="wait">
          
          {/* 🏠 TERMINAL */}
          {activeTab === 'home' && (
            <motion.div key="h" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-8 lg:space-y-12">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter">Terminal</h2>
                  <p className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
                      <Zap size={12}/> System Active • Ready for Operations
                  </p>
                </div>
                <div className="flex gap-8 lg:gap-12">
                  <div className="text-right">
                    <p className="text-3xl lg:text-5xl font-mono font-black text-emerald-400">{sc}</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Credits (SC)</p>
                  </div>
                  <div className="text-right border-l border-white/10 pl-8 lg:pl-12">
                    <p className="text-3xl lg:text-5xl font-mono font-black text-blue-400">{totalHours}h</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Study Hours</p>
                  </div>
                </div>
              </header>

              {/* DAILY SYNC */}
              <div className="p-6 lg:p-10 bg-blue-600/5 rounded-[2rem] lg:rounded-[3rem] border border-blue-500/20 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl">
                <div className="flex items-center gap-6">
                  <Flame className="text-orange-500" size={32}/>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest">Daily Multiplier Sync</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bonus: +{(streak*10)} SC for Consistency</p>
                  </div>
                </div>
                <button onClick={claimDaily} className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${lastClaimDate === new Date().toLocaleDateString() ? 'bg-white/5 text-white/20' : 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20'}`}>
                  {lastClaimDate === new Date().toLocaleDateString() ? 'Synced' : 'Sync Now'}
                </button>
              </div>

              {/* ALL TASKS (No features removed) */}
              <div className="space-y-12 pb-12">
                <TaskGroup title="01. Core Grind">
                  <TaskItem icon={<Clock/>} name="Deep Work Hour" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<RotateCcw/>} name="Pomodoro Streak" sc={50} onClick={()=>addSC(50)}/>
                  <TaskItem icon={<GraduationCap/>} name="Syllabus Progress" sc={40} onClick={()=>addSC(40)}/>
                  <TaskItem icon={<Edit3/>} name="Ultra-Summary" sc={35} onClick={()=>addSC(35)}/>
                  <TaskItem icon={<Layout/>} name="The Clean Slate" sc={15} onClick={()=>addSC(15)}/>
                  <TaskItem icon={<Calendar/>} name="End-of-Day Review" sc={20} onClick={()=>addSC(20)}/>
                </TaskGroup>

                <TaskGroup title="02. Maths & Physics Power Plays">
                  <TaskItem icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Calculator/>} name="Maths: Part B Mastery" sc={25} onClick={()=>addSC(25)}/>
                  <TaskItem icon={<Target/>} name="Maths: Pattern Rec." sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<Microscope/>} name="Physics: Lab Report" sc={35} onClick={()=>addSC(35)}/>
                  <TaskItem icon={<Wand2/>} name="Physics: The Architect" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Palette/>} name="Physics: Visualizer" sc={15} onClick={()=>addSC(15)}/>
                </TaskGroup>

                <TaskGroup title="03. Chemistry Mastery">
                  <TaskItem icon={<Brain/>} name="Chem: The Alchemist" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<FlaskConical/>} name="Chem: Color Guru" sc={25} onClick={()=>addSC(25)}/>
                  <TaskItem icon={<Zap/>} name="Chem: Redox Balancer" sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<Beaker/>} name="Chem: Stoichiometry" sc={20} onClick={()=>addSC(20)}/>
                </TaskGroup>

                <TaskGroup title="04. Mindset & Heroic Feats">
                  <TaskItem icon={<Star/>} name="The Early Bird" sc={40} onClick={()=>addSC(40)}/>
                  <TaskItem icon={<Brain/>} name="The Teacher (Feynman)" sc={50} onClick={()=>addSC(50)}/>
                  <TaskItem icon={<Sword/>} name="The Full Mock (3hr)" sc={150} onClick={()=>addSC(150)} gold/>
                  <TaskItem icon={<Trophy/>} name="The Weakness Slayer" sc={80} onClick={()=>addSC(80)}/>
                  <TaskItem icon={<FastForward/>} name="Inter-Subject Link" sc={70} onClick={()=>addSC(70)}/>
                </TaskGroup>
              </div>
            </motion.div>
          )}

          {/* ⏱️ FOCUS HUB (Timer & Stopwatch) */}
          {activeTab === 'focus' && (
            <motion.div key="f" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center space-y-12">
               <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10">
                  <button onClick={()=>setFocusMode('timer')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${focusMode==='timer' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Timer</button>
                  <button onClick={()=>setFocusMode('stopwatch')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${focusMode==='stopwatch' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Stopwatch</button>
               </div>

               <div className="text-center">
                  <h2 className="text-8xl lg:text-[12rem] font-mono font-black tracking-tighter tabular-nums">
                    {focusMode === 'timer' ? formatTime(timeLeft) : formatTime(stopwatchTime)}
                  </h2>
                  <p className="text-blue-500 font-black text-xs uppercase tracking-[0.5em] mt-4">Deep Work Session</p>
               </div>

               <div className="flex gap-6 items-center">
                  {focusMode === 'timer' && (
                    <button onClick={()=>setTimeLeft(1500)} className="p-4 bg-white/5 rounded-full border border-white/10 text-slate-400 hover:text-white transition-all"><Settings size={24}/></button>
                  )}
                  <button onClick={()=>setIsActive(!isActive)} className="px-16 py-6 bg-white text-black font-black uppercase rounded-full text-sm tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    {isActive ? 'Pause Session' : 'Start Focus'}
                  </button>
                  <button onClick={()=>{setIsActive(false); focusMode==='timer' ? setTimeLeft(1500) : setStopwatchTime(0)}} className="p-4 bg-white/5 rounded-full border border-white/10 text-slate-400 hover:text-white transition-all"><RotateCcw size={24}/></button>
               </div>

               <button onClick={()=>setIsGhostMode(true)} className="flex items-center gap-3 px-8 py-4 bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all">
                  <Ghost size={16}/> Enter Ghost Mode
               </button>
            </motion.div>
          )}

          {/* 🛒 THE VAULT */}
          {activeTab === 'store' && (
            <motion.div key="s" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-12">
               <div className="text-center">
                  <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter">The Vault</h2>
                  <p className="mt-4 text-emerald-400 font-mono text-2xl font-black">Balance: {sc} SC</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StoreCard title="Audio Expansion">
                    {LOFI_LIBRARY.slice(1).map(t => (
                      <StoreItem key={t.id} name={t.name} cost={t.cost} unlocked={unlockedTracks.includes(t.id)} onClick={()=>buyItem(t.cost, t.id, 'track')} />
                    ))}
                  </StoreCard>
                  <StoreCard title="Prestige Titles">
                    <StoreItem name="Scholar Prime" cost={300} unlocked={unlockedRewards.includes('v1')} onClick={()=>buyItem(300, 'v1', 'virtual')} />
                    <StoreItem name="Maths Deity" cost={600} unlocked={unlockedRewards.includes('v2')} onClick={()=>buyItem(600, 'v2', 'virtual')} />
                    <StoreItem name="Atomic King" cost={1000} unlocked={unlockedRewards.includes('v4')} onClick={()=>buyItem(1000, 'v4', 'virtual')} />
                  </StoreCard>
                  <StoreCard title="Real World Recovery">
                    <StoreItem name="Coffee Break" cost={70} onClick={()=>buyItem(70, 'r1', 'real')} />
                    <StoreItem name="Gaming Hour" cost={400} onClick={()=>buyItem(400, 'r2', 'real')} />
                    <StoreItem name="Cheat Meal" cost={800} onClick={()=>buyItem(800, 'r3', 'real')} />
                    <StoreItem name="Rest Day" cost={1500} onClick={()=>buyItem(1500, 'r4', 'real')} />
                  </StoreCard>
               </div>
            </motion.div>
          )}

          {/* 📊 ANALYTICS */}
          {activeTab === 'analytics' && (
            <motion.div key="a" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-10">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 h-[400px] flex flex-col">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-10">7-Day SC Velocity</h4>
                  <div className="flex-1 flex items-end gap-4 pb-4">
                    {dailyHistory.map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3 justify-end h-full">
                        <div className="text-[8px] font-bold text-blue-400">+{h.sc}</div>
                        <motion.div initial={{height:0}} animate={{height: `${Math.min((h.sc/300)*100, 100)}%`}} className="w-full bg-blue-600 rounded-t-lg shadow-lg" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">{h.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-10">Subject Mastery</h4>
                  <div className="space-y-6">
                    {examResults.slice(-5).map((ex, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>{ex.subject}</span>
                          <span className="text-white">{ex.mark}%</span>
                        </div>
                        <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <motion.div initial={{width:0}} animate={{width: `${ex.mark}%`}} className="h-full bg-emerald-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 👻 GHOST PROTOCOL OVERLAY */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-8">
             <h1 className="text-[10rem] lg:text-[18rem] font-mono font-black opacity-80 tabular-nums">
                {focusMode === 'timer' ? formatTime(timeLeft) : formatTime(stopwatchTime)}
             </h1>
             <div className="flex flex-wrap justify-center gap-8 mt-12">
                <button onClick={()=>setIsActive(!isActive)} className="px-16 py-6 bg-white text-black font-black uppercase rounded-full text-lg tracking-widest hover:scale-110 transition-all">
                  {isActive ? 'PAUSE' : 'START'}
                </button>
                <button onClick={()=>setIsGhostMode(false)} className="px-10 py-6 text-white/20 hover:text-white uppercase text-xs font-black tracking-[0.5em] transition-all">[ TERMINATE PROTOCOL ]</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- REFINED SUB-COMPONENTS ---

function NavBtn({icon, active, onClick, label}: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-4 p-4 lg:p-5 rounded-2xl transition-all group ${active ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="hidden xl:block text-[11px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function TaskGroup({title, children}: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-[11px] font-black text-blue-500/40 uppercase tracking-[0.5em] ml-4 lg:ml-8">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">{children}</div>
    </div>
  );
}

function TaskItem({name, sc, icon, onClick, gold}: any) {
  return (
    <motion.div whileHover={{ y: -3 }} className={`p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border transition-all flex items-center justify-between gap-4 ${gold ? 'bg-amber-500/5 border-amber-500/20 shadow-lg' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
      <div className="flex items-center gap-5 min-w-0">
        <div className={gold ? 'text-amber-500' : 'text-blue-500'}>{icon}</div>
        <div className="min-w-0">
          <p className="text-[11px] lg:text-xs font-black uppercase tracking-tight text-white/90 truncate">{name}</p>
          <p className="text-emerald-400 text-[10px] font-bold tracking-widest mt-1">+{sc} SC</p>
        </div>
      </div>
      <button onClick={onClick} className="shrink-0 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Claim</button>
    </motion.div>
  );
}

function StoreCard({title, children}: any) {
  return (
    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl h-full">
      <h4 className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-[0.4em] text-center">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function StoreItem({name, cost, unlocked, onClick}: any) {
  return (
    <button onClick={unlocked ? undefined : onClick} className={`w-full flex justify-between items-center p-5 rounded-2xl border transition-all ${unlocked ? 'bg-emerald-900/10 border-emerald-500/20 cursor-default' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
      <span className={`text-[10px] font-black uppercase tracking-tight text-left pr-4 ${unlocked ? 'text-emerald-400' : 'text-white/70'}`}>{name}</span>
      <span className={`shrink-0 text-[10px] font-black tracking-widest ${unlocked ? 'text-emerald-500' : 'text-blue-400'}`}>{unlocked ? 'OWNED' : `${cost} SC`}</span>
    </button>
  );
}