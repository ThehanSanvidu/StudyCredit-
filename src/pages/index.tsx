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

// --- CONSTANTS & DATA (Derived from Master SC Menu [cite: 1, 2, 3]) ---
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
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const newHist = [...dailyHistory];
    const idx = newHist.findIndex(h => h.date === today);
    
    if (idx > -1) {
        newHist[idx].sc += amount;
    } else {
        if(newHist.length >= 7) newHist.shift();
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
    // Multiplier Logic: Reward = 50 + (Streak * 10)
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
    if (streak >= 30) return "bg-gradient-to-r from-fuchsia-600 to-purple-600";
    if (streak >= 14) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    if (streak >= 7) return "bg-gradient-to-r from-blue-400 to-indigo-600";
    return "bg-slate-700";
  };

  const currentEmoji = PROFILE_EMOJIS[new Date().getDate() % PROFILE_EMOJIS.length];

  return (
    <div className={`min-h-screen ${isGhostMode ? 'bg-black' : 'bg-[#02050f]'} text-white font-sans flex overflow-hidden relative`}>
      
      {/* 🧊 BACKGROUND BLUR */}
      {!isGhostMode && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        </div>
      )}

      {/* 👻 GHOST PROTOCOL */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <h1 className="text-[12rem] font-mono font-black opacity-80">
              {Math.floor((timerMode === 'pomodoro' ? timeLeft : stopwatchTime) / 60)}:
              {((timerMode === 'pomodoro' ? timeLeft : stopwatchTime) % 60).toString().padStart(2, '0')}
            </h1>
            <div className="flex gap-8 mt-10">
              <button onClick={() => setIsActive(!isActive)} className="px-12 py-4 bg-white text-black font-black uppercase rounded-full">{isActive ? 'PAUSE' : 'START'}</button>
              <button onClick={() => setIsGhostMode(false)} className="px-8 py-4 text-white/40 uppercase text-xs font-black tracking-widest">Terminate</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛰️ SIDEBAR */}
      <nav className="w-24 lg:w-72 bg-white/5 border-r border-white/10 p-8 flex flex-col items-center gap-8 z-50 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-4xl lg:text-5xl shadow-2xl">
            {currentEmoji}
          </div>
          <div className="text-center hidden lg:block">
            <h3 className="font-black text-sm tracking-widest uppercase">{name}</h3>
            <div className={`mt-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getBadgeColor()}`}>
               {streak} Day Streak 🔥
            </div>
          </div>
        </div>

        <NavBtn icon={<Home/>} label="Terminal" active={activeTab==='home'} onClick={()=>setActiveTab('home')}/>
        <NavBtn icon={<BarChart3/>} label="Analysis" active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')}/>
        <NavBtn icon={<ClipboardList/>} label="Exams" active={activeTab==='exams'} onClick={()=>setActiveTab('exams')}/>
        <NavBtn icon={<ShoppingCart/>} label="The Vault" active={activeTab==='store'} onClick={()=>setActiveTab('store')}/>
        
        <button onClick={()=>setIsGhostMode(true)} className="mt-auto p-4 text-purple-400 hover:bg-purple-500/10 rounded-2xl transition-all">
          <Ghost size={24}/>
        </button>
      </nav>

      {/* 📺 MAIN TERMINAL */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {activeTab === 'home' && (
            <motion.div key="h" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-12">
              <header className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter">Terminal</h2>
                  <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
                      <Zap size={12}/> System Online • Ready to Grind
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl lg:text-6xl font-mono font-black text-emerald-400">{sc}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Study Credits</p>
                </div>
              </header>

              {/* DAILY CLAIM BOX */}
              <div className="p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-[2.5rem] border border-blue-500/20 flex flex-wrap justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-blue-600/20 rounded-2xl text-blue-400"><Rocket/></div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest">Daily Multiplier Sync</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Multiplier: $$x(1 + streak \times 0.1)$$</p>
                  </div>
                </div>
                <button onClick={claimDaily} className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${lastClaimDate === new Date().toLocaleDateString() ? 'bg-white/5 text-white/20' : 'bg-blue-600 hover:scale-105 shadow-xl shadow-blue-600/20'}`}>
                  {lastClaimDate === new Date().toLocaleDateString() ? 'Sync Complete' : 'Sync Now'}
                </button>
              </div>

              {/* TASK GROUPS [cite: 2, 3] */}
              <div className="space-y-12 pb-20">
                <TaskGroup title="1. Core Grind">
                  <TaskItem icon={<Clock/>} name="Deep Work Hour" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<RotateCcw/>} name="Pomodoro Streak" sc={50} onClick={()=>addSC(50)}/>
                  <TaskItem icon={<GraduationCap/>} name="Syllabus Progress" sc={40} onClick={()=>addSC(40)}/>
                  <TaskItem icon={<Edit3/>} name="Ultra-Summary" sc={35} onClick={()=>addSC(35)}/>
                  <TaskItem icon={<Layout/>} name="The Clean Slate" sc={15} onClick={()=>addSC(15)}/>
                  <TaskItem icon={<Calendar/>} name="End-of-Day Review" sc={20} onClick={()=>addSC(20)}/>
                </TaskGroup>

                <TaskGroup title="2. Subject Power Plays">
                  <TaskItem icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Calculator/>} name="Maths: Part B Mastery" sc={25} onClick={()=>addSC(25)}/>
                  <TaskItem icon={<Microscope/>} name="Physics: Lab Report" sc={35} onClick={()=>addSC(35)}/>
                  <TaskItem icon={<Wand2/>} name="Physics: The Architect" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Brain/>} name="Chem: The Alchemist" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<FlaskConical/>} name="Chem: Color Guru" sc={25} onClick={()=>addSC(25)}/>
                </TaskGroup>

                <TaskGroup title="3. Heroic Feats">
                  <TaskItem icon={<Sword/>} name="The Full Mock (3hr)" sc={150} onClick={()=>addSC(150)} gold/>
                  <TaskItem icon={<Target/>} name="The Weakness Slayer" sc={80} onClick={()=>addSC(80)}/>
                  <TaskItem icon={<FastForward/>} name="Inter-Subject Link" sc={70} onClick={()=>addSC(70)}/>
                  <TaskItem icon={<Trophy/>} name="Perfect Week Bonus" sc={250} onClick={()=>addSC(250)} gold/>
                </TaskGroup>
              </div>
            </motion.div>
          )}

          {/* ANALYSIS TAB - FIXED CHARTS */}
          {activeTab === 'analytics' && (
            <motion.div key="a" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-12">
              <h2 className="text-6xl font-black uppercase tracking-tighter">Mastery Analysis</h2>
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* 1. Credit Velocity (7-Day Chart) */}
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 min-h-[400px] flex flex-col">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-10">7-Day Credit Velocity</h4>
                  <div className="flex-1 flex items-end gap-4 pb-4">
                    {dailyHistory.length > 0 ? dailyHistory.map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                        <div className="text-[8px] font-bold text-blue-400 mb-1">{h.sc}</div>
                        <motion.div 
                          initial={{height:0}} animate={{height: `${Math.min((h.sc/300)*100, 100)}%`}} 
                          className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg shadow-lg shadow-blue-600/20" 
                        />
                        <span className="text-[10px] font-black text-slate-500 uppercase">{h.date}</span>
                      </div>
                    )) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 font-black uppercase tracking-widest text-xs">No Data Logged Yet 📉</div>
                    )}
                  </div>
                </div>

                {/* 2. Subject Spread (Marks Distribution) */}
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 min-h-[400px]">
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-10">Recent Exam Performance</h4>
                  <div className="space-y-6">
                    {examResults.length > 0 ? examResults.slice(-5).map((ex, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">{ex.subject}</span>
                            <span className="text-emerald-400">{ex.mark}%</span>
                        </div>
                        <div className="h-6 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{width:0}} animate={{width: `${ex.mark}%`}} 
                                className={`h-full ${ex.mark >= 75 ? 'bg-emerald-500' : ex.mark >= 50 ? 'bg-yellow-500' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} 
                            />
                        </div>
                      </div>
                    )) : (
                      <div className="h-full flex items-center justify-center text-slate-600 font-black uppercase tracking-widest text-xs">Register exams to see data 📝</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STORE TAB - FIXED OVERLAP */}
          {activeTab === 'store' && (
            <motion.div key="s" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-12">
               <header className="text-center">
                <h2 className="text-7xl font-black uppercase tracking-tighter">The Vault</h2>
                <p className="mt-4 text-emerald-400 font-mono text-2xl font-black uppercase tracking-widest">Balance: {sc} SC 💎</p>
              </header>
              <div className="grid md:grid-cols-3 gap-8">
                <StoreCard title="Audio Unlocks">
                  {LOFI_LIBRARY.slice(1).map(t => (
                    <StoreItem key={t.id} name={t.name} cost={t.cost} unlocked={unlockedTracks.includes(t.id)} onClick={()=>buyItem(t.cost, t.id, 'track')} />
                  ))}
                </StoreCard>
                <StoreCard title="Prestige Titles">
                  <StoreItem name="Scholar Prime" cost={300} unlocked={unlockedRewards.includes('v1')} onClick={()=>buyItem(300, 'v1', 'virtual')} />
                  <StoreItem name="Maths Deity" cost={600} unlocked={unlockedRewards.includes('v2')} onClick={()=>buyItem(600, 'v2', 'virtual')} />
                  <StoreItem name="Atomic King" cost={1000} unlocked={unlockedRewards.includes('v4')} onClick={()=>buyItem(1000, 'v4', 'virtual')} />
                </StoreCard>
                <StoreCard title="Recovery Perks">
                  <StoreItem name="Coffee Break" cost={70} onClick={()=>buyItem(70, 'r1', 'real')} />
                  <StoreItem name="Gaming Hour" cost={400} onClick={()=>buyItem(400, 'r2', 'real')} />
                  <StoreItem name="Full Rest Day" cost={1500} onClick={()=>buyItem(1500, 'r4', 'real')} />
                </StoreCard>
              </div>
            </motion.div>
          )}

          {/* EXAMS TAB */}
          {activeTab === 'exams' && (
            <motion.div key="e" initial={{opacity:0}} animate={{opacity:1}} className="max-w-4xl mx-auto space-y-10">
              <h2 className="text-5xl font-black uppercase tracking-tighter text-center">Exam Registry</h2>
              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
                <form className="flex flex-col md:flex-row gap-4 mb-10" onSubmit={(e:any) => {
                  e.preventDefault();
                  const newResult = { subject: e.target.sub.value, mark: Number(e.target.mrk.value), date: new Date().toLocaleDateString() };
                  const up = [...examResults, newResult];
                  setExamResults(up);
                  localStorage.setItem(`exams_${name}`, JSON.stringify(up));
                  e.target.reset();
                }}>
                  <select name="sub" className="flex-1 bg-black border border-white/10 rounded-xl p-4 text-[10px] font-black uppercase text-white" required>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input name="mrk" type="number" placeholder="Mark (%)" className="w-full md:w-32 bg-black border border-white/10 rounded-xl p-4 text-xs font-black text-white" required />
                  <button type="submit" className="px-8 py-4 bg-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all">Log Mark</button>
                </form>
                <div className="space-y-3">
                  {examResults.slice().reverse().map((ex, i) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-black/40 rounded-2xl border border-white/5">
                      <span className="font-black text-[10px] uppercase text-slate-400 tracking-widest">{ex.subject}</span>
                      <span className="font-mono font-black text-xl text-emerald-400">{ex.mark}%</span>
                    </div>
                  ))}
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
    <button onClick={onClick} className={`w-full p-4 lg:p-5 flex items-center gap-5 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      <span className="shrink-0">{icon}</span>
      <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function TaskGroup({title, children}: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-[11px] font-black text-blue-500/50 uppercase tracking-[0.5em] ml-4">{title}</h3>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

// FIXED: Flex layout with shrink-0 button to prevent squashing
function TaskItem({name, sc, icon, onClick, gold}: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }} 
      className={`p-5 lg:p-6 rounded-[2rem] border transition-all flex items-center justify-between gap-4 ${gold ? 'bg-amber-500/5 border-amber-500/20 shadow-lg shadow-amber-500/5' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
    >
      <div className="flex items-center gap-5 min-w-0">
        <div className={`p-3 rounded-xl shrink-0 ${gold ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-400'}`}>
            {icon}
        </div>
        <div className="truncate">
          <p className="text-[11px] font-black uppercase tracking-tight text-white/90 truncate">{name}</p>
          <p className={`text-[9px] font-bold mt-1 ${gold ? 'text-amber-400' : 'text-emerald-400'}`}>+{sc} SC</p>
        </div>
      </div>
      <button onClick={onClick} className={`shrink-0 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${gold ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white/10 text-white hover:bg-white/20'}`}>
        Claim
      </button>
    </motion.div>
  );
}

function StoreCard({title, children}: any) {
  return (
    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
      <h4 className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-[0.4em] text-center">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function StoreItem({name, cost, unlocked, onClick}: any) {
  return (
    <button 
        onClick={unlocked ? undefined : onClick} 
        className={`w-full flex justify-between items-center p-5 rounded-2xl border transition-all ${unlocked ? 'bg-emerald-900/10 border-emerald-500/20 cursor-default' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
    >
      <span className={`text-[9px] font-black uppercase tracking-tight text-left pr-2 ${unlocked ? 'text-emerald-400' : 'text-white/70'}`}>{name}</span>
      <span className={`shrink-0 text-[9px] font-black tracking-widest ${unlocked ? 'text-emerald-500' : 'text-blue-400'}`}>{unlocked ? 'OWNED' : `${cost} SC`}</span>
    </button>
  );
}