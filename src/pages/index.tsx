"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Brain, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Ghost, GraduationCap, Microscope, Palette, Binary, Calendar, 
  ShoppingCart, Coffee, FastForward, Star, SkipForward, SkipBack, Apple, 
  BarChart3, ClipboardList, Home, Radio, Disc, Volume2, Timer, Settings, Dumbbell, Smartphone, AlertCircle, Link
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- CONSTANTS ---
const SUBJECTS = ["Physics", "Chemistry", "Combined Maths"];

const LOFI_LIBRARY = [
  { id: 't1', name: 'Deep Space Focus 🌌', url: 'https://stream.zeno.fm/0r0xa792kwzuv', cost: 0, unlocked: true },
  { id: 't2', name: 'Rainy Night Desk 🌧️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cost: 100, unlocked: false },
  { id: 't3', name: 'Cyberpunk Chill 🌃', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cost: 150, unlocked: false },
  { id: 't4', name: 'Zen Garden 🎋', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cost: 200, unlocked: false },
  { id: 't5', name: 'Midnight Library 📚', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cost: 250, unlocked: false },
  { id: 't6', name: 'Autumn Leaves 🍂', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cost: 300, unlocked: false },
  { id: 't7', name: 'Neon Rain 🎆', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', cost: 350, unlocked: false },
  { id: 't8', name: 'Coffee Shop Vibes ☕', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', cost: 400, unlocked: false },
  { id: 't10', name: 'Nebula Drift 🪐', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', cost: 500, unlocked: false },
];

export default function ScholarOS() {
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'store' | 'audio' | 'focus'>('home');
  const [sc, setSc] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0); 
  const [name, setName] = useState("Scholar");
  const [isGhostMode, setIsGhostMode] = useState(false);
  
  // Stats
  const [streak, setStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState("");
  const [unlockedTracks, setUnlockedTracks] = useState<string[]>(['t1']);
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);

  // Timer/Stopwatch State
  const [focusMode, setFocusMode] = useState<'timer' | 'stopwatch'>('timer');
  const [timeLeft, setTimeLeft] = useState(1500);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  // Audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setTotalSeconds(Number(localStorage.getItem(`total_secs_${savedName}`)) || 0);
    setUnlockedTracks(JSON.parse(localStorage.getItem(`tracks_${savedName}`) || '["t1"]'));
    setUnlockedRewards(JSON.parse(localStorage.getItem(`rewards_${savedName}`) || '[]'));

    audioRef.current = new Audio(LOFI_LIBRARY[0].url);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.src = LOFI_LIBRARY[currentTrackIdx].url;
        if (isPlaying) audioRef.current.play().catch(e => console.log("Audio block:", e));
    }
  }, [currentTrackIdx]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

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
          }
        } else {
          setStopwatchTime(s => s + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, focusMode, timeLeft, stopwatchTime]);

  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem(`sc_${name}`, total.toString());
    confetti();
  };

  const buyItem = (cost: number, id: string, type: 'track' | 'virtual' | 'real') => {
    if (sc >= cost) {
      setSc(s => s - cost);
      if (type === 'track') {
        const up = [...unlockedTracks, id];
        setUnlockedTracks(up);
        localStorage.setItem(`tracks_${name}`, JSON.stringify(up));
      } else {
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

  return (
    <div className={`min-h-screen ${isGhostMode ? 'bg-black' : 'bg-[#01040a]'} text-white font-sans flex flex-col lg:flex-row overflow-hidden relative transition-colors duration-500`}>
      
      {/* 🧊 RESPONSIVE NAV */}
      <nav className="w-full lg:w-24 xl:w-72 bg-white/5 border-b lg:border-b-0 lg:border-r border-white/10 p-4 lg:p-8 flex lg:flex-col items-center justify-between lg:justify-start gap-4 lg:gap-8 z-[100] backdrop-blur-2xl">
        <div className="w-10 h-10 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
          <GraduationCap size={32} />
        </div>

        <div className="flex lg:flex-col gap-2 lg:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar">
          <NavBtn icon={<Home/>} active={activeTab==='home'} onClick={()=>setActiveTab('home')} label="Terminal"/>
          <NavBtn icon={<Timer/>} active={activeTab==='focus'} onClick={()=>setActiveTab('focus')} label="Focus Hub"/>
          <NavBtn icon={<BarChart3/>} active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')} label="Analytics"/>
          <NavBtn icon={<Radio/>} active={activeTab==='audio'} onClick={()=>setActiveTab('audio')} label="Audio"/>
          <NavBtn icon={<ShoppingCart/>} active={activeTab==='store'} onClick={()=>setActiveTab('store')} label="The Vault"/>
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
            <motion.div key="h" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-8">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter">Terminal</h2>
                  <p className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] mt-2">Scholar Rank: Elite</p>
                </div>
                <div className="flex gap-8 lg:gap-12 bg-white/5 p-6 rounded-[2rem] border border-white/10">
                  <div className="text-right">
                    <p className="text-2xl lg:text-4xl font-mono font-black text-emerald-400">{sc} 💎</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Credits</p>
                  </div>
                  <div className="text-right border-l border-white/10 pl-8">
                    <p className="text-2xl lg:text-4xl font-mono font-black text-blue-400">{totalHours}h ⏳</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Time</p>
                  </div>
                </div>
              </header>

              <div className="space-y-12 pb-12">
                <TaskGroup title="01. Core Grind">
                  <TaskItem icon={<Clock/>} name="Deep Work Hour" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<RotateCcw/>} name="Pomodoro Streak" sc={50} onClick={()=>addSC(50)}/>
                  <TaskItem icon={<GraduationCap/>} name="Syllabus Progress" sc={40} onClick={()=>addSC(40)}/>
                  <TaskItem icon={<Edit3/>} name="Ultra-Summary (1-Page)" sc={35} onClick={()=>addSC(35)}/>
                  <TaskItem icon={<Layout/>} name="The Clean Slate" sc={15} onClick={()=>addSC(15)}/>
                  <TaskItem icon={<Calendar/>} name="End-of-Day Review" sc={20} onClick={()=>addSC(20)}/>
                </TaskGroup>

                <TaskGroup title="02. Subject Power Plays">
                  <TaskItem icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Calculator/>} name="Maths: The Long Game" sc={25} onClick={()=>addSC(25)}/>
                  <TaskItem icon={<Target/>} name="Maths: Pattern Recognition" sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<Microscope/>} name="Physics: Lab Report" sc={35} onClick={()=>addSC(35)}/>
                  <TaskItem icon={<Wand2/>} name="Physics: The Architect" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Palette/>} name="Physics: The Visualizer" sc={15} onClick={()=>addSC(15)}/>
                  <TaskItem icon={<Brain/>} name="Chem: The Alchemist" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Beaker/>} name="Chem: Color Guru" sc={25} onClick={()=>addSC(25)}/>
                  <TaskItem icon={<Zap/>} name="Chem: The Balancer" sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<FlaskConical/>} name="Chem: Stoichiometry Master" sc={20} onClick={()=>addSC(20)}/>
                </TaskGroup>

                <TaskGroup title="03. Bonus Multipliers">
                  <TaskItem icon={<Star/>} name="The Early Bird" sc={40} onClick={()=>addSC(40)}/>
                  <TaskItem icon={<GraduationCap/>} name="The Teacher (Feynman)" sc={50} onClick={()=>addSC(50)}/>
                  <TaskItem icon={<Dumbbell/>} name="Physical Buff" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Smartphone/>} name="No-Phone Multiplier" sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<Apple/>} name="Nutrition Boost" sc={10} onClick={()=>addSC(10)}/>
                </TaskGroup>

                <TaskGroup title="04. Heroic Feats">
                  <TaskItem icon={<Sword/>} name="The Full Mock (3HR)" sc={150} onClick={()=>addSC(150)} gold/>
                  <TaskItem icon={<Target/>} name="The Weakness Slayer" sc={80} onClick={()=>addSC(80)}/>
                  <TaskItem icon={<AlertCircle/>} name="The Error Log" sc={60} onClick={()=>addSC(60)}/>
                  <TaskItem icon={<Trophy/>} name="Perfect Week Bonus" sc={250} onClick={()=>addSC(250)} gold/>
                  <TaskItem icon={<Link/>} name="Inter-Subject Linkage" sc={70} onClick={()=>addSC(70)}/>
                </TaskGroup>
              </div>
            </motion.div>
          )}

          {/* 📈 ANALYTICS (Restored) */}
          {activeTab === 'analytics' && (
            <motion.div key="a" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-6xl mx-auto space-y-12">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Mastery Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] min-h-[300px]">
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Subject Spread 🧬</p>
                   <div className="space-y-6">
                      <SubjectBar label="Combined Maths" percent={75} color="bg-blue-500" />
                      <SubjectBar label="Physics" percent={60} color="bg-purple-500" />
                      <SubjectBar label="Chemistry" percent={45} color="bg-emerald-500" />
                   </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-between">
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Credit Velocity 📈</p>
                   <div className="h-48 flex items-end gap-2 px-4">
                      {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-600/20 rounded-t-lg relative group">
                          <motion.div initial={{height:0}} animate={{height: `${h}%`}} className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg group-hover:bg-blue-400 transition-colors" />
                        </div>
                      ))}
                   </div>
                   <div className="flex justify-between text-[8px] font-black text-slate-500 mt-4 uppercase">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 📻 AUDIO (Fixed) */}
          {activeTab === 'audio' && (
            <motion.div key="au" initial={{opacity:0}} animate={{opacity:1}} className="max-w-4xl mx-auto space-y-12">
              <div className="text-center">
                <h2 className="text-5xl font-black uppercase tracking-tighter">Audio Station 📻</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase mt-2 tracking-widest">Selected Frequency: {LOFI_LIBRARY[currentTrackIdx].name}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-4">
                {LOFI_LIBRARY.map((track, idx) => {
                  const isUnlocked = unlockedTracks.includes(track.id);
                  const isCurrent = currentTrackIdx === idx;
                  return (
                    <button key={track.id} onClick={() => isUnlocked && setCurrentTrackIdx(idx)} className={`w-full p-6 rounded-2xl border flex items-center justify-between transition-all ${isCurrent ? 'bg-blue-600 border-blue-400' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                      <div className="flex items-center gap-4">
                        <Disc className={`${isPlaying && isCurrent ? 'animate-spin' : ''} text-white/50`} size={20}/>
                        <span className="text-xs font-black uppercase tracking-widest">{track.name}</span>
                      </div>
                      {isUnlocked ? (
                         isCurrent && isPlaying ? <Pause size={18}/> : <Play size={18}/>
                      ) : (
                        <span className="text-[10px] font-black text-white/20">{track.cost} SC</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {isPlaying && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-blue-600 px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 z-[200]">
                  <button onClick={()=>setCurrentTrackIdx(p=>(p-1+LOFI_LIBRARY.length)%LOFI_LIBRARY.length)}><SkipBack size={20}/></button>
                  <button onClick={togglePlay} className="p-3 bg-white text-blue-600 rounded-full">{isPlaying ? <Pause size={24}/> : <Play size={24}/>}</button>
                  <button onClick={()=>setCurrentTrackIdx(p=>(p+1)%LOFI_LIBRARY.length)}><SkipForward size={20}/></button>
                </div>
              )}
            </motion.div>
          )}

          {/* 🛒 THE VAULT (Emoji Update) */}
          {activeTab === 'store' && (
            <motion.div key="s" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-12">
               <div className="text-center">
                  <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter">The Vault 🏛️</h2>
                  <p className="mt-4 text-emerald-400 font-mono text-2xl font-black">Balance: {sc} SC 💎</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StoreCard title="📻 Audio Expansion">
                    {LOFI_LIBRARY.slice(1).map(t => (
                      <StoreItem key={t.id} name={t.name} cost={t.cost} unlocked={unlockedTracks.includes(t.id)} onClick={()=>buyItem(t.cost, t.id, 'track')} />
                    ))}
                  </StoreCard>
                  <StoreCard title="👑 Prestige Titles">
                    <StoreItem name="Scholar Prime 🎖️" cost={300} unlocked={unlockedRewards.includes('v1')} onClick={()=>buyItem(300, 'v1', 'virtual')} />
                    <StoreItem name="Maths Deity 📐" cost={600} unlocked={unlockedRewards.includes('v2')} onClick={()=>buyItem(600, 'v2', 'virtual')} />
                    <StoreItem name="Atomic King ⚛️" cost={1000} unlocked={unlockedRewards.includes('v4')} onClick={()=>buyItem(1000, 'v4', 'virtual')} />
                  </StoreCard>
                  <StoreCard title="☕ Real World Rewards">
                    <StoreItem name="Coffee Break ☕" cost={70} onClick={()=>buyItem(70, 'r1', 'real')} />
                    <StoreItem name="Gaming Hour 🎮" cost={400} onClick={()=>buyItem(400, 'r2', 'real')} />
                    <StoreItem name="Cheat Meal 🍕" cost={800} onClick={()=>buyItem(800, 'r3', 'real')} />
                    <StoreItem name="Rest Day 🛌" cost={1500} onClick={()=>buyItem(1500, 'r4', 'real')} />
                  </StoreCard>
               </div>
            </motion.div>
          )}

          {/* ⏱️ FOCUS HUB */}
          {activeTab === 'focus' && (
            <motion.div key="f" initial={{opacity:0}} animate={{opacity:1}} className="max-w-4xl mx-auto h-[70vh] flex flex-col items-center justify-center space-y-12">
               <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10">
                  <button onClick={()=>setFocusMode('timer')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${focusMode==='timer' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Timer</button>
                  <button onClick={()=>setFocusMode('stopwatch')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${focusMode==='stopwatch' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Stopwatch</button>
               </div>
               <div className="text-center">
                  <h2 className="text-8xl md:text-[12rem] font-mono font-black tracking-tighter tabular-nums">
                    {focusMode === 'timer' ? formatTime(timeLeft) : formatTime(stopwatchTime)}
                  </h2>
               </div>
               <div className="flex gap-4">
                  <button onClick={()=>setIsActive(!isActive)} className="px-12 py-5 bg-white text-black font-black uppercase rounded-2xl text-sm tracking-widest">{isActive ? 'Pause' : 'Start'}</button>
                  <button onClick={()=>{setIsActive(false); focusMode==='timer' ? setTimeLeft(1500) : setStopwatchTime(0)}} className="p-5 bg-white/5 rounded-2xl border border-white/10"><RotateCcw/></button>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 👻 GHOST MODE */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center">
             <h1 className="text-[15rem] font-mono font-black opacity-40 tabular-nums">
                {focusMode === 'timer' ? formatTime(timeLeft) : formatTime(stopwatchTime)}
             </h1>
             <button onClick={()=>setIsGhostMode(false)} className="mt-12 text-white/20 hover:text-white uppercase text-[10px] font-black tracking-[0.5em]">[ ESCAPE GHOST PROTOCOL ]</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- HELPERS ---

function NavBtn({icon, active, onClick, label}: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-4 p-4 lg:p-5 rounded-2xl transition-all group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      <span>{icon}</span>
      <span className="hidden xl:block text-[11px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function TaskGroup({title, children}: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-[11px] font-black text-blue-500/40 uppercase tracking-[0.5em] ml-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function TaskItem({name, sc, icon, onClick, gold}: any) {
  return (
    <div className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${gold ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
      <div className="flex items-center gap-4">
        <div className={gold ? 'text-amber-500' : 'text-blue-500'}>{icon}</div>
        <div>
          <p className="text-[10px] lg:text-xs font-black uppercase tracking-tight text-white/90">{name}</p>
          <p className="text-emerald-400 text-[10px] font-bold">+{sc} SC</p>
        </div>
      </div>
      <button onClick={onClick} className="px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[9px] font-black uppercase tracking-widest">Claim</button>
    </div>
  );
}

function StoreCard({title, children}: any) {
  return (
    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
      <h4 className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-[0.4em] text-center">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function StoreItem({name, cost, unlocked, onClick}: any) {
  return (
    <button onClick={unlocked ? undefined : onClick} className={`w-full flex justify-between items-center p-5 rounded-2xl border transition-all ${unlocked ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
      <span className="text-[10px] font-black uppercase tracking-tight">{name}</span>
      <span className="text-[10px] font-black tracking-widest text-blue-400">{unlocked ? 'OWNED' : `${cost} SC`}</span>
    </button>
  );
}

function SubjectBar({label, percent, color}: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{width: 0}} animate={{width: `${percent}%`}} className={`h-full ${color}`} />
            </div>
        </div>
    );
}