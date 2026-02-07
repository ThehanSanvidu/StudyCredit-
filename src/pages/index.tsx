"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Brain, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Ghost, GraduationCap, Microscope, Palette, Binary, AlertTriangle, Calendar, 
  ShoppingCart, Coffee, FastForward, Star, SkipForward, SkipBack, Apple, 
  BarChart3, ClipboardList, Home, Crown, Sparkles, Gem, Rocket, Heart, Dumbbell, Smartphone,
  Disc, Volume2, Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- CONSTANTS & FULL DATA ---
const SUBJECTS = ["Physics", "Chemistry", "General English", "Applied Maths", "Pure Maths", "General Knowledge"];
const PROFILE_EMOJIS = ["👨‍🎓", "🧠", "⚡", "🚀", "🔭", "🧪", "🧬", "📚", "🏆", "🔥", "☄️", "🛡️", "🧬", "🪐"];

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
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'exams' | 'store' | 'audio'>('home');
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

  // Load Data
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

  // Audio Sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = LOFI_LIBRARY[currentTrackIdx].url;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  }, [currentTrackIdx]);

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
    if (lastClaimDate === today) return alert("Already synced today! 🏃‍♂️");
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
    if (streak >= 30) return "bg-gradient-to-r from-fuchsia-600 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.4)]";
    if (streak >= 14) return "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]";
    if (streak >= 7) return "bg-gradient-to-r from-blue-400 to-indigo-600";
    return "bg-slate-700";
  };

  const currentEmoji = PROFILE_EMOJIS[new Date().getDate() % PROFILE_EMOJIS.length];

  return (
    <div className={`min-h-screen ${isGhostMode ? 'bg-black' : 'bg-[#02050f]'} text-white font-sans flex overflow-hidden relative`}>
      
      {/* 🧊 BG ANIMATION */}
      {!isGhostMode && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
        </div>
      )}

      {/* 👻 GHOST MODE */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <h1 className="text-[14rem] font-mono font-black opacity-90 tracking-tighter">
              {Math.floor((timerMode === 'pomodoro' ? timeLeft : stopwatchTime) / 60)}:
              {((timerMode === 'pomodoro' ? timeLeft : stopwatchTime) % 60).toString().padStart(2, '0')}
            </h1>
            <div className="flex gap-10 mt-12">
              <button onClick={() => setIsActive(!isActive)} className="px-16 py-6 bg-white text-black font-black uppercase rounded-full tracking-widest hover:scale-105 transition-all">{isActive ? 'PAUSE' : 'START'}</button>
              <button onClick={() => setIsGhostMode(false)} className="px-10 py-6 text-white/30 hover:text-white uppercase text-xs font-black tracking-[0.5em] transition-all">[ TERMINATE ]</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛰️ SIDEBAR */}
      <nav className="w-24 lg:w-72 bg-white/5 border-r border-white/10 p-8 flex flex-col items-center gap-8 z-50 backdrop-blur-2xl">
        <div className="flex flex-col items-center gap-4 mb-6">
          <motion.div whileHover={{rotate: 360}} transition={{duration: 1}} className="w-16 h-16 lg:w-24 lg:h-24 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-4xl lg:text-5xl shadow-2xl">
            {currentEmoji}
          </motion.div>
          <div className="text-center hidden lg:block">
            <h3 className="font-black text-xs tracking-[0.3em] uppercase opacity-70">{name}</h3>
            <div className={`mt-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getBadgeColor()}`}>
               STREAK: {streak} 🔥
            </div>
          </div>
        </div>

        <NavBtn icon={<Home/>} label="Terminal" active={activeTab==='home'} onClick={()=>setActiveTab('home')}/>
        <NavBtn icon={<BarChart3/>} label="Analysis" active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')}/>
        <NavBtn icon={<ClipboardList/>} label="Exams" active={activeTab==='exams'} onClick={()=>setActiveTab('exams')}/>
        <NavBtn icon={<Radio/>} label="Audio" active={activeTab==='audio'} onClick={()=>setActiveTab('audio')}/>
        <NavBtn icon={<ShoppingCart/>} label="The Vault" active={activeTab==='store'} onClick={()=>setActiveTab('store')}/>
        
        <button onClick={()=>setIsGhostMode(true)} className="mt-auto p-5 text-purple-400 hover:bg-purple-500/10 rounded-3xl transition-all flex items-center gap-4">
          <Ghost size={24}/> <span className="hidden lg:block text-[10px] font-black tracking-widest">GHOST</span>
        </button>
      </nav>

      {/* 📺 MAIN VIEWPORT */}
      <main className="flex-1 p-8 lg:p-14 overflow-y-auto z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* 🏠 TERMINAL (HOME) */}
          {activeTab === 'home' && (
            <motion.div key="h" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-6xl mx-auto space-y-12">
              <header className="flex justify-between items-end border-b border-white/5 pb-10">
                <div>
                  <h2 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none">Terminal</h2>
                  <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mt-6 flex items-center gap-2">
                      <Zap size={14} fill="currentColor"/> LEVEL {Math.floor(streak/7) + 1} ACADEMIC OPERATIVE
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-5xl lg:text-7xl font-mono font-black text-emerald-400">{sc}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CREDITS LOADED</p>
                </div>
              </header>

              <div className="p-10 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 rounded-[3rem] border border-blue-500/30 flex justify-between items-center gap-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-8 relative z-10">
                  <Rocket className="text-blue-400 animate-bounce" size={42}/>
                  <div>
                    <p className="text-lg font-black uppercase tracking-widest">Daily Multiplier Sync</p>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Status: {lastClaimDate === new Date().toLocaleDateString() ? 'Synchronized' : 'Awaiting Data'}</p>
                  </div>
                </div>
                <button onClick={claimDaily} className={`relative z-10 px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${lastClaimDate === new Date().toLocaleDateString() ? 'bg-white/5 text-white/20 cursor-default' : 'bg-blue-600 hover:scale-105 hover:bg-blue-500 shadow-2xl shadow-blue-600/40'}`}>
                  {lastClaimDate === new Date().toLocaleDateString() ? 'SYNCED' : 'SYNC NOW'}
                </button>
              </div>

              <div className="space-y-16 pb-20">
                <TaskGroup title="01. CORE CONSISTENCY (GRIND)">
                  <TaskItem icon={<Clock/>} name="Deep Work Hour" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<RotateCcw/>} name="Pomodoro Streak" sc={50} onClick={()=>addSC(50)}/>
                  <TaskItem icon={<GraduationCap/>} name="Syllabus Progress" sc={40} onClick={()=>addSC(40)}/>
                  <TaskItem icon={<Edit3/>} name="Ultra-Summary (Recall)" sc={35} onClick={()=>addSC(35)}/>
                  <TaskItem icon={<Layout/>} name="The Clean Slate" sc={15} onClick={()=>addSC(15)}/>
                  <TaskItem icon={<Calendar/>} name="End-of-Day Review" sc={20} onClick={()=>addSC(20)}/>
                </TaskGroup>

                <TaskGroup title="02. SUBJECT-SPECIFIC POWER PLAYS">
                  <TaskItem icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Calculator/>} name="Maths: Part B Mastery" sc={25} onClick={()=>addSC(25)}/>
                  <TaskItem icon={<Target/>} name="Maths: Pattern Rec." sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<Microscope/>} name="Physics: Lab Report" sc={35} onClick={()=>addSC(35)}/>
                  <TaskItem icon={<Wand2/>} name="Physics: The Architect" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Palette/>} name="Physics: Visualizer" sc={15} onClick={()=>addSC(15)}/>
                  <TaskItem icon={<Brain/>} name="Chem: The Alchemist" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<FlaskConical/>} name="Chem: Color Guru" sc={25} onClick={()=>addSC(25)}/>
                  <TaskItem icon={<Zap/>} name="Chem: Redox Balancer" sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<Beaker/>} name="Chem: Stoichiometry" sc={20} onClick={()=>addSC(20)}/>
                </TaskGroup>

                <TaskGroup title="03. MINDSET & HEROIC FEATS">
                  <TaskItem icon={<Star/>} name="The Early Bird" sc={40} onClick={()=>addSC(40)}/>
                  <TaskItem icon={<Sparkles/>} name="The Teacher (Feynman)" sc={50} onClick={()=>addSC(50)}/>
                  <TaskItem icon={<Dumbbell/>} name="Physical Buff (20m)" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Smartphone/>} name="No-Phone Multiplier" sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<Apple/>} name="Nutrition Boost" sc={10} onClick={()=>addSC(10)}/>
                  <TaskItem icon={<Sword/>} name="The Full Mock (3hr)" sc={150} onClick={()=>addSC(150)} gold/>
                  <TaskItem icon={<Trophy/>} name="The Weakness Slayer" sc={80} onClick={()=>addSC(80)}/>
                  <TaskItem icon={<FastForward/>} name="Inter-Subject Link" sc={70} onClick={()=>addSC(70)}/>
                  <TaskItem icon={<Crown/>} name="Perfect Week Bonus" sc={250} onClick={()=>addSC(250)} gold/>
                </TaskGroup>
              </div>
            </motion.div>
          )}

          {/* 📊 ANALYSIS (CHARTS) */}
          {activeTab === 'analytics' && (
            <motion.div key="a" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-12">
              <h2 className="text-7xl font-black uppercase tracking-tighter">Performance</h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 min-h-[500px] flex flex-col shadow-2xl">
                  <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.5em] mb-12">Credit Velocity (7 Days)</h4>
                  <div className="flex-1 flex items-end gap-5 pb-6">
                    {dailyHistory.length > 0 ? dailyHistory.map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                        <div className="text-[9px] font-black text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity mb-2">+{h.sc}</div>
                        <motion.div initial={{height:0}} animate={{height: `${Math.min((h.sc/400)*100, 100)}%`}} 
                          className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-2xl shadow-xl group-hover:brightness-125 transition-all" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{h.date}</span>
                      </div>
                    )) : <div className="w-full text-center text-white/20 uppercase font-black text-xs">Awaiting data logs... 📉</div>}
                  </div>
                </div>
                <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 min-h-[500px] shadow-2xl">
                  <h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-12">Subject Mastery (Exam Data)</h4>
                  <div className="space-y-8">
                    {examResults.length > 0 ? examResults.slice(-6).map((ex, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <span>{ex.subject}</span>
                            <span className="text-emerald-400">{ex.mark}%</span>
                        </div>
                        <div className="h-6 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                            <motion.div initial={{width:0}} animate={{width: `${ex.mark}%`}} transition={{duration:1}}
                                className={`h-full ${ex.mark >= 75 ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : ex.mark >= 50 ? 'bg-yellow-500' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'}`} />
                        </div>
                      </div>
                    )) : <div className="h-full flex items-center justify-center text-white/20 uppercase font-black text-xs">Log exams to see distribution 📝</div>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 🎧 AUDIO (NEW PAGE) */}
          {activeTab === 'audio' && (
            <motion.div key="au" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 gap-16">
               <div className="text-center space-y-4">
                  <h2 className="text-6xl font-black uppercase tracking-tighter">Audio Station</h2>
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.6em]">Aesthetic Lofi • Deep Work Protocol</p>
               </div>

               <div className="relative">
                  <motion.div animate={{rotate: isPlaying ? 360 : 0}} transition={{repeat: Infinity, duration: 10, ease: "linear"}}
                    className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border-[10px] border-white/5 p-4 bg-gradient-to-tr from-indigo-900 to-black shadow-[0_0_100px_rgba(79,70,229,0.2)]">
                      <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-3xl overflow-hidden relative">
                         <div className="w-20 h-20 bg-[#02050f] rounded-full border-4 border-white/10 z-10" />
                         <Disc className="absolute text-white/5 w-full h-full" size={300}/>
                      </div>
                  </motion.div>
                  {isPlaying && (
                    <div className="absolute -inset-10 border border-indigo-500/20 rounded-full animate-ping opacity-20" />
                  )}
               </div>

               <div className="flex flex-col items-center gap-10 w-full max-w-md">
                  <div className="text-center">
                    <h3 className="text-2xl font-black uppercase tracking-widest">{LOFI_LIBRARY[currentTrackIdx].name}</h3>
                    <p className="text-white/30 text-[10px] font-black uppercase mt-2">Source: Lofi Library Vol. 1</p>
                  </div>

                  <div className="flex items-center gap-14">
                    <button onClick={()=>setCurrentTrackIdx(p => (p === 0 ? LOFI_LIBRARY.length-1 : p-1))} className="text-white/40 hover:text-white transition-colors"><SkipBack size={32}/></button>
                    <button onClick={()=>{setIsPlaying(!isPlaying); isPlaying ? audioRef.current?.pause() : audioRef.current?.play();}} 
                      className="p-12 bg-indigo-600 rounded-full shadow-[0_0_50px_rgba(79,70,229,0.5)] transform active:scale-90 transition-all">
                      {isPlaying ? <Pause size={40} fill="white"/> : <Play size={40} fill="white" className="ml-2"/>}
                    </button>
                    <button onClick={()=>setCurrentTrackIdx(p => (p + 1) % LOFI_LIBRARY.length)} className="text-white/40 hover:text-white transition-colors"><SkipForward size={32}/></button>
                  </div>

                  <div className="w-full flex items-center gap-4 text-white/20">
                    <Volume2 size={16}/>
                    <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div animate={{width: isPlaying ? '100%' : '0%'}} transition={{duration: 200, repeat: Infinity}} className="h-full bg-indigo-500" />
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* 🛒 THE VAULT (FULL STORE) */}
          {activeTab === 'store' && (
            <motion.div key="s" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-7xl mx-auto space-y-16 pb-20">
              <header className="text-center">
                <h2 className="text-8xl font-black uppercase tracking-tighter">The Vault</h2>
                <div className="mt-8 flex justify-center gap-12">
                    <div className="flex flex-col items-center gap-2">
                       <p className="text-emerald-400 font-mono text-4xl font-black">{sc}</p>
                       <p className="text-[9px] font-black uppercase tracking-widest opacity-40">CREDITS</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <p className="text-purple-400 font-mono text-4xl font-black">{streak}</p>
                       <p className="text-[9px] font-black uppercase tracking-widest opacity-40">STREAK</p>
                    </div>
                </div>
              </header>
              <div className="grid md:grid-cols-3 gap-10">
                <StoreCard title="Audio Expansion Packs">
                  {LOFI_LIBRARY.slice(1).map(t => (
                    <StoreItem key={t.id} name={t.name} cost={t.cost} emoji="📻" unlocked={unlockedTracks.includes(t.id)} onClick={()=>buyItem(t.cost, t.id, 'track')} />
                  ))}
                </StoreCard>
                <StoreCard title="Prestige Achievements">
                  <StoreItem name="Scholar Prime" cost={300} emoji="💠" unlocked={unlockedRewards.includes('v1')} onClick={()=>buyItem(300, 'v1', 'virtual')} />
                  <StoreItem name="Maths Deity" cost={600} emoji="🔱" unlocked={unlockedRewards.includes('v2')} onClick={()=>buyItem(600, 'v2', 'virtual')} />
                  <StoreItem name="Atomic King" cost={1000} emoji="⚛️" unlocked={unlockedRewards.includes('v4')} onClick={()=>buyItem(1000, 'v4', 'virtual')} />
                  <StoreItem name="Grandmaster" cost={2500} emoji="🌌" unlocked={unlockedRewards.includes('v5')} onClick={()=>buyItem(2500, 'v5', 'virtual')} />
                </StoreCard>
                <StoreCard title="Real-World Recovery">
                  <StoreItem name="Coffee Break" cost={70} emoji="☕" onClick={()=>buyItem(70, 'r1', 'real')} />
                  <StoreItem name="Gaming Hour" cost={400} emoji="🎮" onClick={()=>buyItem(400, 'r2', 'real')} />
                  <StoreItem name="Cheat Meal" cost={800} emoji="🍔" onClick={()=>buyItem(800, 'r3', 'real')} />
                  <StoreItem name="Full Rest Day" cost={1500} emoji="😴" onClick={()=>buyItem(1500, 'r4', 'real')} />
                </StoreCard>
              </div>
            </motion.div>
          )}

          {/* 📝 EXAMS (REGISTRY) */}
          {activeTab === 'exams' && (
            <motion.div key="e" initial={{opacity:0}} animate={{opacity:1}} className="max-w-4xl mx-auto space-y-12">
              <h2 className="text-6xl font-black uppercase tracking-tighter text-center">Registry</h2>
              <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 shadow-2xl">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" onSubmit={(e:any) => {
                  e.preventDefault();
                  const newResult = { subject: e.target.sub.value, mark: Number(e.target.mrk.value), date: new Date().toLocaleDateString() };
                  const up = [...examResults, newResult];
                  setExamResults(up);
                  localStorage.setItem(`exams_${name}`, JSON.stringify(up));
                  e.target.reset();
                  alert("Log secured. Check Analytics.");
                }}>
                  <select name="sub" className="bg-black border border-white/10 rounded-2xl p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white" required>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input name="mrk" type="number" placeholder="Mark (%)" className="bg-black border border-white/10 rounded-2xl p-6 text-xs font-black text-white" required />
                  <button type="submit" className="bg-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all">Record Session</button>
                </form>
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                  {examResults.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center p-8 bg-black/40 rounded-[2rem] border border-white/5">
                      <div className="flex items-center gap-6">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]" />
                        <span className="font-black text-xs uppercase text-slate-400 tracking-widest">{ex.subject}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-3xl text-emerald-400">{ex.mark}%</span>
                        <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest mt-2">{ex.date}</p>
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

// --- REFINED SUB-COMPONENTS ---

function NavBtn({icon, label, active, onClick}: any) {
  return (
    <button onClick={onClick} className={`w-full p-5 flex items-center gap-6 rounded-[1.8rem] transition-all group ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="hidden lg:block text-[11px] font-black uppercase tracking-[0.3em] leading-none">{label}</span>
    </button>
  );
}

function TaskGroup({title, children}: any) {
  return (
    <div className="space-y-10">
      <h3 className="text-[12px] font-black text-blue-500/40 uppercase tracking-[0.6em] ml-10 border-l-4 border-blue-500/20 pl-6">{title}</h3>
      <div className="grid md:grid-cols-2 gap-8">{children}</div>
    </div>
  );
}

// FIXED: Flex layout and min-w-0 to prevent button overlap
function TaskItem({name, sc, icon, onClick, gold}: any) {
  return (
    <motion.div whileHover={{ y: -5 }} className={`p-8 lg:p-10 rounded-[3.5rem] border transition-all flex items-center justify-between gap-6 overflow-hidden ${gold ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_15px_40px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
      <div className="flex items-center gap-8 min-w-0">
        <div className={gold ? 'text-amber-500' : 'text-blue-500'}>{icon}</div>
        <div className="min-w-0">
          <p className="text-[11px] lg:text-xs font-black uppercase tracking-tight leading-tight text-white/90 truncate">{name}</p>
          <p className="text-emerald-400 text-[10px] font-bold tracking-widest mt-3">+{sc} SC</p>
        </div>
      </div>
      <button onClick={onClick} className="shrink-0 px-8 py-3.5 bg-blue-600/10 hover:bg-blue-600 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all text-white">Claim</button>
    </motion.div>
  );
}

function StoreCard({title, children}: any) {
  return (
    <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl h-full">
      <h4 className="text-[12px] font-black text-slate-500 mb-12 uppercase tracking-[0.5em] text-center">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function StoreItem({name, cost, emoji, unlocked, onClick}: any) {
  return (
    <motion.button onClick={unlocked ? undefined : onClick} whileHover={{ scale: 1.02 }}
      className={`w-full flex justify-between items-center p-6 rounded-[2rem] border transition-all ${unlocked ? 'bg-emerald-900/10 border-emerald-500/20 cursor-default' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
      <div className="flex items-center gap-5">
        <span className="text-xl">{emoji}</span>
        <span className={`text-[10px] font-black uppercase tracking-tight text-left ${unlocked ? 'text-emerald-400' : 'text-white/70'}`}>{name}</span>
      </div>
      <span className={`shrink-0 text-[10px] font-black tracking-widest ${unlocked ? 'text-emerald-500' : 'text-blue-400'}`}>{unlocked ? 'OWNED' : `${cost} SC`}</span>
    </motion.button>
  );
}