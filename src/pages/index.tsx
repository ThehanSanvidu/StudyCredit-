"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Brain, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Ghost, GraduationCap, Microscope, Palette, Binary, AlertTriangle, Calendar, 
  ShoppingCart, Coffee, FastForward, Star, SkipForward, SkipBack, Apple, 
  BarChart3, ClipboardList, Home, Crown, Sparkles, Gem, Rocket, Heart, Dumbbell, Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- CONSTANTS & DATA ---
const SUBJECTS = ["Physics", "Chemistry", "General English", "Applied Maths", "Pure Maths", "General Knowledge"];
const PROFILE_EMOJIS = ["👨‍🎓", "🧠", "⚡", "🚀", "🔭", "🧪", "🧬", "📚", "🏆", "🔥", "☄️", "🛡️", "🧬", "🪐"];

const LOFI_LIBRARY = [
  { id: 't1', name: 'Deep Space Focus', url: 'https://stream.zeno.fm/0r0xa792kwzuv', cost: 0, unlocked: true },
  { id: 't2', name: 'Rainy Night Desk', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cost: 100, unlocked: false },
  { id: 't3', name: 'Cyberpunk Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cost: 150, unlocked: false },
  { id: 't4', name: 'Zen Garden', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cost: 200, unlocked: false },
  { id: 't5', name: 'Midnight Library', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cost: 250, unlocked: false },
];

export default function ScholarOS() {
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'exams' | 'store'>('home');
  const [sc, setSc] = useState(0);
  const [name, setName] = useState("Scholar");
  const [isGhostMode, setIsGhostMode] = useState(false);
  
  // Stats & Streaks
  const [streak, setStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState("");
  const [unlockedTracks, setUnlockedTracks] = useState<string[]>(['t1']);
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);
  const [dailyHistory, setDailyHistory] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);

  // Timer/Audio
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(1500);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Data
  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setStreak(Number(localStorage.getItem(`streak_${savedName}`)) || 0);
    setLastClaimDate(localStorage.getItem(`claim_${savedName}`) || "");
    setUnlockedTracks(JSON.parse(localStorage.getItem(`tracks_${savedName}`) || '["t1"]'));
    setUnlockedRewards(JSON.parse(localStorage.getItem(`rewards_${savedName}`) || '[]'));
    setDailyHistory(JSON.parse(localStorage.getItem(`history_${savedName}`) || '[]'));
    setExamResults(JSON.parse(localStorage.getItem(`exams_${savedName}`) || '[]'));

    audioRef.current = new Audio(LOFI_LIBRARY[0].url);
    audioRef.current.onended = () => setCurrentTrackIdx(p => (p + 1) % LOFI_LIBRARY.length);
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        if (timerMode === 'pomodoro') {
          if (timeLeft > 0) setTimeLeft(t => t - 1);
          else { setIsActive(false); addSC(50); confetti(); }
        } else { setStopwatchTime(s => s + 1); }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timerMode, timeLeft, stopwatchTime]);

  // Audio Logic
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
    
    // Update History for Analytics
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"
    const newHist = [...dailyHistory];
    const idx = newHist.findIndex(h => h.date === today);
    
    // Simple logic: if today exists, add to it. If not, add new entry. Keep max 7 days.
    if (idx > -1) {
        newHist[idx].sc += amount;
    } else {
        if(newHist.length >= 7) newHist.shift(); // Remove oldest
        newHist.push({ date: today, sc: amount });
    }
    
    setDailyHistory(newHist);
    localStorage.setItem(`history_${name}`, JSON.stringify(newHist));
    confetti();
  };

  const claimDaily = () => {
    const today = new Date().toLocaleDateString();
    if (lastClaimDate === today) return alert("Already claimed today! 🏃‍♂️");
    
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

  const getBadgeColor = () => {
    if (streak >= 30) return "bg-gradient-to-r from-fuchsia-600 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.5)]";
    if (streak >= 14) return "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]";
    if (streak >= 7) return "bg-gradient-to-r from-blue-400 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]";
    if (streak >= 3) return "bg-gradient-to-r from-emerald-400 to-teal-600";
    return "bg-slate-700";
  };

  const getBadgeLabel = () => {
    if (streak >= 30) return "Radiant";
    if (streak >= 14) return "Elite";
    if (streak >= 7) return "Scholar";
    if (streak >= 3) return "Novice";
    return "Neutral";
  };

  const currentEmoji = PROFILE_EMOJIS[new Date().getDate() % PROFILE_EMOJIS.length];

  return (
    <div className={`min-h-screen ${isGhostMode ? 'bg-black' : 'bg-[#02050f]'} text-white font-sans flex overflow-hidden relative`}>
      
      {/* 🧊 LIQUID GLASS ANIMATION */}
      {!isGhostMode && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div key={i} animate={{ x: [0, 200, 0], y: [0, 400, 0] }} transition={{ duration: 15 + i * 3, repeat: Infinity }}
              className="absolute w-80 h-80 rounded-full bg-blue-600/5 blur-[120px]" />
          ))}
        </div>
      )}

      {/* 👻 GHOST PROTOCOL */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
             <div className="flex gap-10 mb-16 opacity-30 text-[10px] font-black tracking-[0.5em]">
              <button onClick={() => setTimerMode('pomodoro')} className={timerMode==='pomodoro' ? 'text-white underline' : ''}>TIMER</button>
              <button onClick={() => setTimerMode('stopwatch')} className={timerMode==='stopwatch' ? 'text-white underline' : ''}>STOPWATCH</button>
            </div>
            <h1 className="text-[15rem] font-mono font-black opacity-80 leading-none">
              {Math.floor((timerMode === 'pomodoro' ? timeLeft : stopwatchTime) / 60)}:
              {((timerMode === 'pomodoro' ? timeLeft : stopwatchTime) % 60).toString().padStart(2, '0')}
            </h1>
            <div className="flex gap-10 mt-16">
              <button onClick={() => setIsActive(!isActive)} className="px-16 py-5 bg-white text-black font-black uppercase rounded-full">{isActive ? 'PAUSE' : 'START'}</button>
              <button onClick={() => setIsGhostMode(false)} className="px-10 py-5 text-white/20 hover:text-white uppercase text-[10px] font-black">[ TERMINATE ]</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛰️ SIDEBAR */}
      <nav className="w-24 lg:w-80 bg-white/5 border-r border-white/10 p-10 flex flex-col items-center gap-10 z-50 backdrop-blur-3xl">
        <div className="flex flex-col items-center gap-6 mb-10">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-24 h-24 lg:w-32 lg:h-32 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-6xl shadow-2xl relative">
            {currentEmoji}
            <div className="absolute -bottom-2 right-0 bg-blue-600 p-2 rounded-full border-4 border-[#02050f]">
                <Zap size={14} fill="white"/>
            </div>
          </motion.div>
          <div className="text-center hidden lg:block">
            <h3 className="font-black text-xl tracking-tighter uppercase">{name}</h3>
            <div className={`mt-2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${getBadgeColor()}`}>
              {getBadgeLabel()} • {streak} Day Streak
            </div>
          </div>
        </div>

        <NavBtn icon={<Home/>} label="Terminal" active={activeTab==='home'} onClick={()=>setActiveTab('home')}/>
        <NavBtn icon={<BarChart3/>} label="Analysis" active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')}/>
        <NavBtn icon={<ClipboardList/>} label="Exams" active={activeTab==='exams'} onClick={()=>setActiveTab('exams')}/>
        <NavBtn icon={<ShoppingCart/>} label="The Vault" active={activeTab==='store'} onClick={()=>setActiveTab('store')}/>
        
        <button onClick={()=>setIsGhostMode(true)} className="mt-auto p-4 flex items-center gap-4 text-purple-400 hover:bg-purple-500/10 rounded-3xl transition-all">
          <Ghost/> <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">GHOST MODE</span>
        </button>
      </nav>

      {/* 📺 MAIN TERMINAL */}
      <main className="flex-1 p-8 lg:p-14 overflow-y-auto z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {activeTab === 'home' && (
            <motion.div key="h" initial={{opacity:0}} animate={{opacity:1}} className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-14">
                <header className="flex justify-between items-end border-b border-white/5 pb-12">
                  <div>
                    <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">Terminal</h2>
                    <p className="text-blue-500/60 font-black text-[10px] uppercase tracking-[0.6em] mt-6 flex items-center gap-2">
                        <Flame size={12}/> SYSTEM ACTIVE • {getBadgeLabel()} PROTOCOL
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-5xl lg:text-7xl font-mono font-black text-emerald-400">{sc}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CREDITS EARNED</p>
                  </div>
                </header>

                <div className="space-y-16 pb-20">
                  {/* Daily Reward Sync */}
                  <motion.div whileHover={{ scale: 1.02 }} className="p-10 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-[2.5rem] border border-blue-500/30 flex justify-between items-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl"/>
                    <div className="flex items-center gap-8 relative z-10">
                      <Rocket className="text-blue-400" size={40}/>
                      <div>
                        <p className="text-lg font-black uppercase">Daily Sync Reward</p>
                        <p className="text-[11px] text-blue-400 font-bold uppercase tracking-widest">Multiplier: x{1 + (streak * 0.1).toFixed(1)}</p>
                      </div>
                    </div>
                    <button onClick={claimDaily} className={`relative z-10 px-8 lg:px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${lastClaimDate === new Date().toLocaleDateString() ? 'bg-white/5 text-white/20 cursor-default' : 'bg-blue-600 shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95'}`}>
                      {lastClaimDate === new Date().toLocaleDateString() ? 'Claimed' : 'Claim'}
                    </button>
                  </motion.div>

                  <TaskGroup title="1. CORE CONSISTENCY">
                    <TaskItem icon={<Clock/>} name="Deep Work Hour" sc={30} onClick={()=>addSC(30)}/>
                    <TaskItem icon={<RotateCcw/>} name="Pomodoro Streak" sc={50} onClick={()=>addSC(50)}/>
                    <TaskItem icon={<GraduationCap/>} name="Syllabus Progress" sc={40} onClick={()=>addSC(40)}/>
                    <TaskItem icon={<Edit3/>} name="Ultra-Summary (1-Page)" sc={35} onClick={()=>addSC(35)}/>
                    <TaskItem icon={<Layout/>} name="The Clean Slate" sc={15} onClick={()=>addSC(15)}/>
                    <TaskItem icon={<Calendar/>} name="End-of-Day Review" sc={20} onClick={()=>addSC(20)}/>
                  </TaskGroup>

                  <TaskGroup title="2. EXAM POWER PLAYS">
                    <TaskItem icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={()=>addSC(30)}/>
                    <TaskItem icon={<Calculator/>} name="Maths: The Long Game" sc={25} onClick={()=>addSC(25)}/>
                    <TaskItem icon={<Binary/>} name="Maths: Pattern Rec." sc={20} onClick={()=>addSC(20)}/>
                    <TaskItem icon={<Microscope/>} name="Physics: Lab Report" sc={35} onClick={()=>addSC(35)}/>
                    <TaskItem icon={<Wand2/>} name="Physics: The Architect" sc={30} onClick={()=>addSC(30)}/>
                    <TaskItem icon={<Palette/>} name="Physics: The Visualizer" sc={15} onClick={()=>addSC(15)}/>
                    <TaskItem icon={<Brain/>} name="Chem: The Alchemist" sc={30} onClick={()=>addSC(30)}/>
                    <TaskItem icon={<FlaskConical/>} name="Chem: The Balancer" sc={20} onClick={()=>addSC(20)}/>
                  </TaskGroup>

                  <TaskGroup title="3. MINDSET & HEROIC FEATS">
                    <TaskItem icon={<Star/>} name="The Early Bird (Pre-7AM)" sc={40} onClick={()=>addSC(40)}/>
                    <TaskItem icon={<Brain/>} name="The Teacher (Feynman)" sc={50} onClick={()=>addSC(50)}/>
                    <TaskItem icon={<Dumbbell/>} name="Physical Buff (Exercise)" sc={30} onClick={()=>addSC(30)}/>
                    <TaskItem icon={<Smartphone/>} name="No-Phone Multiplier" sc={20} onClick={()=>addSC(20)}/>
                    <TaskItem icon={<Apple/>} name="Nutrition Boost" sc={10} onClick={()=>addSC(10)}/>
                    <TaskItem icon={<Sword/>} name="The Full Mock (3hr)" sc={150} onClick={()=>addSC(150)} gold/>
                    <TaskItem icon={<Target/>} name="The Weakness Slayer" sc={80} onClick={()=>addSC(80)}/>
                    <TaskItem icon={<FastForward/>} name="Inter-Subject Linkage" sc={70} onClick={()=>addSC(70)}/>
                    <TaskItem icon={<Trophy/>} name="Perfect Week Bonus" sc={250} onClick={()=>addSC(250)} gold/>
                  </TaskGroup>
                </div>
              </div>

              {/* LOFI STICKY */}
              <aside className="lg:col-span-4 space-y-12 hidden lg:block">
                <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 sticky top-14 backdrop-blur-3xl shadow-2xl">
                  <h3 className="text-xs font-black text-indigo-400 mb-10 uppercase tracking-[0.5em] flex items-center gap-4"><Music size={20}/> Focus Audio</h3>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-white/30 mb-8 uppercase tracking-widest truncate">{LOFI_LIBRARY[currentTrackIdx].name}</p>
                    <div className="flex items-center justify-center gap-12">
                      <button onClick={() => setCurrentTrackIdx(p => (p === 0 ? LOFI_LIBRARY.length-1 : p-1))}><SkipBack size={28}/></button>
                      <button onClick={() => { setIsPlaying(!isPlaying); isPlaying ? audioRef.current?.pause() : audioRef.current?.play(); }} 
                        className="p-10 bg-indigo-600 rounded-full shadow-2xl shadow-indigo-600/40 transform active:scale-90 transition-all">
                        {isPlaying ? <Pause size={32} fill="white"/> : <Play size={32} fill="white"/>}
                      </button>
                      <button onClick={() => setCurrentTrackIdx(p => (p + 1) % LOFI_LIBRARY.length)}><SkipForward size={28}/></button>
                    </div>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {/* ANALYSIS TAB */}
          {activeTab === 'analytics' && (
            <motion.div key="a" initial={{opacity:0}} animate={{opacity:1}} className="space-y-14">
              <h2 className="text-7xl font-black uppercase tracking-tighter">Analysis</h2>
              <div className="grid md:grid-cols-2 gap-12">
                
                {/* 1. Credit Velocity (Activity) */}
                <div className="bg-white/5 p-14 rounded-[3rem] border border-white/10 h-[500px] flex flex-col shadow-2xl">
                  <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-12">7-Day Velocity</h4>
                  <div className="flex-1 flex items-end gap-6 pb-6 relative">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                        <div className="w-full h-px bg-white"/>
                        <div className="w-full h-px bg-white"/>
                        <div className="w-full h-px bg-white"/>
                    </div>
                    
                    {dailyHistory.length > 0 ? dailyHistory.map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-4 z-10 group">
                        <div className="relative w-full h-full flex items-end">
                            <motion.div 
                                initial={{height:0}} 
                                animate={{height: `${Math.min((h.sc/400)*100, 100)}%`}} 
                                className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:bg-indigo-400 transition-colors" 
                            />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{h.date}</span>
                      </div>
                    )) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 font-black uppercase tracking-widest text-sm">
                            Start completing tasks to see data
                        </div>
                    )}
                  </div>
                </div>

                {/* 2. Subject Spread (Marks) */}
                <div className="bg-white/5 p-14 rounded-[3rem] border border-white/10 h-[500px] shadow-2xl overflow-y-auto custom-scrollbar">
                  <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-12">Recent Marks</h4>
                  <div className="space-y-8">
                    {examResults.length > 0 ? examResults.slice().reverse().map((ex, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <span>{ex.subject}</span>
                            <span className="text-white">{ex.mark}%</span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{width:0}} 
                                animate={{width: `${ex.mark}%`}} 
                                transition={{duration: 1, ease: "easeOut"}}
                                className={`h-full ${ex.mark >= 75 ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : ex.mark >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            />
                        </div>
                      </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4">
                            <ClipboardList size={40} className="opacity-20"/>
                            <span className="font-black uppercase tracking-widest text-xs">No Exam Data Found</span>
                            <button onClick={()=>setActiveTab('exams')} className="text-[10px] text-blue-400 underline uppercase tracking-widest">Go to Exams Tab</button>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STORE TAB */}
          {activeTab === 'store' && (
            <motion.div key="s" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-7xl mx-auto space-y-16 pb-20">
              <header className="text-center">
                <h2 className="text-8xl font-black uppercase tracking-tighter">The Vault</h2>
                <div className="mt-6 flex justify-center gap-8">
                    <p className="text-emerald-400 font-mono text-3xl font-black">CREDITS: {sc}</p>
                    <p className="text-purple-400 font-mono text-3xl font-black">STREAK: {streak}</p>
                </div>
              </header>
              <div className="grid md:grid-cols-3 gap-12">
                <StoreCard title="🎧 AUDIO UNLOCKS">
                  {LOFI_LIBRARY.slice(1, 6).map(t => (
                    <StoreItem key={t.id} name={t.name} cost={t.cost} emoji="📻" unlocked={unlockedTracks.includes(t.id)} onClick={()=>buyItem(t.cost, t.id, 'track')} />
                  ))}
                </StoreCard>
                <StoreCard title="👑 PRESTIGE TITLES">
                  <StoreItem name="Scholar Prime" cost={300} emoji="💠" unlocked={unlockedRewards.includes('v1')} onClick={()=>buyItem(300, 'v1', 'virtual')} />
                  <StoreItem name="Maths Deity" cost={600} emoji="🔱" unlocked={unlockedRewards.includes('v2')} onClick={()=>buyItem(600, 'v2', 'virtual')} />
                  <StoreItem name="Atomic King" cost={1000} emoji="⚛️" unlocked={unlockedRewards.includes('v4')} onClick={()=>buyItem(1000, 'v4', 'virtual')} />
                  <StoreItem name="Grandmaster" cost={2500} emoji="🌌" unlocked={unlockedRewards.includes('v5')} onClick={()=>buyItem(2500, 'v5', 'virtual')} />
                </StoreCard>
                <StoreCard title="🎁 RECOVERY PERKS">
                  <StoreItem name="Coffee Break" cost={70} emoji="☕" onClick={()=>buyItem(70, 'r1', 'real')} />
                  <StoreItem name="Gaming Hour" cost={400} emoji="🎮" onClick={()=>buyItem(400, 'r2', 'real')} />
                  <StoreItem name="Cheat Meal" cost={800} emoji="🍔" onClick={()=>buyItem(800, 'r3', 'real')} />
                  <StoreItem name="Full Rest Day" cost={1500} emoji="😴" onClick={()=>buyItem(1500, 'r4', 'real')} />
                </StoreCard>
              </div>
            </motion.div>
          )}

          {/* EXAMS TAB */}
          {activeTab === 'exams' && (
            <motion.div key="e" initial={{opacity:0}} animate={{opacity:1}} className="max-w-4xl mx-auto space-y-12">
              <h2 className="text-6xl font-black uppercase tracking-tighter text-center">Registry</h2>
              <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" onSubmit={(e:any) => {
                  e.preventDefault();
                  const newResult = { subject: e.target.sub.value, mark: Number(e.target.mrk.value), date: new Date().toLocaleDateString() };
                  const up = [...examResults, newResult];
                  setExamResults(up);
                  localStorage.setItem(`exams_${name}`, JSON.stringify(up));
                  e.target.reset();
                  alert("Mark Recorded! Check Analytics tab.");
                }}>
                  <select name="sub" className="bg-black border border-white/10 rounded-2xl p-5 text-[10px] font-black uppercase tracking-widest text-white" required>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input name="mrk" type="number" placeholder="Mark (%)" className="bg-black border border-white/10 rounded-2xl p-5 text-xs font-black text-white" required />
                  <button type="submit" className="bg-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all text-white">Record</button>
                </form>
                <div className="space-y-4">
                  {examResults.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center p-6 bg-black/40 rounded-3xl border border-white/5">
                      <div className="flex items-center gap-5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="font-black text-xs uppercase text-slate-400 tracking-widest">{ex.subject}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-2xl text-emerald-400">{ex.mark}%</span>
                        <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest mt-1">{ex.date}</p>
                      </div>
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

// --- REFINED UI COMPONENTS ---

function NavBtn({icon, label, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`w-full p-6 flex items-center gap-6 lg:gap-8 rounded-[2rem] transition-all group ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="hidden lg:block text-[11px] font-black uppercase tracking-[0.4em] leading-none">{label}</span>
    </button>
  );
}

function TaskGroup({title, children}: any) {
  return (
    <div className="space-y-8">
      <h3 className="text-[12px] font-black text-blue-500/50 uppercase tracking-[0.6em] ml-2 lg:ml-10">{title}</h3>
      <div className="grid md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

// FIXED TASK ITEM: Better spacing, button alignment, and refined typography
function TaskItem({name, sc, icon, onClick, gold}: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }} 
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer p-6 lg:p-8 rounded-[2.5rem] border transition-all flex items-center justify-between gap-4 ${gold ? 'bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/10' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
    >
      <div className="flex items-center gap-6">
        <div className={`p-4 rounded-2xl ${gold ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-400'}`}>
            {icon}
        </div>
        <div>
          <p className={`text-xs lg:text-sm font-black uppercase tracking-tight leading-tight ${gold ? 'text-amber-100' : 'text-slate-200'}`}>{name}</p>
          <p className={`text-[10px] font-bold tracking-widest mt-2 ${gold ? 'text-amber-400' : 'text-emerald-400'}`}>+{sc} SC</p>
        </div>
      </div>
      
      <button className={`shrink-0 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${gold ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white/10 text-white hover:bg-white/20'}`}>
        Claim
      </button>
    </motion.div>
  );
}

function StoreCard({title, children}: any) {
  return (
    <div className="bg-white/5 p-10 lg:p-14 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
      <h4 className="text-[12px] font-black text-slate-500 mb-12 uppercase tracking-[0.5em] text-center">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function StoreItem({name, cost, emoji, unlocked, onClick}: any) {
  return (
    <motion.button 
        onClick={unlocked ? undefined : onClick} 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex justify-between items-center p-6 lg:p-8 rounded-[2rem] border transition-all ${unlocked ? 'bg-emerald-900/20 border-emerald-500/30 cursor-default' : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'}`}
    >
      <div className="flex items-center gap-6">
        <span className="text-2xl">{emoji}</span>
        <span className={`text-[10px] lg:text-[11px] font-black uppercase tracking-tight ${unlocked ? 'text-emerald-400' : 'text-white/70'}`}>{name}</span>
      </div>
      <span className={`text-[10px] font-black tracking-widest ${unlocked ? 'text-emerald-500' : 'text-blue-400'}`}>{unlocked ? 'OWNED' : `-${cost} SC`}</span>
    </motion.button>
  );
}