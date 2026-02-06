"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, User, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Minus, Brain, BookOpen, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Sunrise, Dumbbell, Smartphone, Ghost, GraduationCap, Microscope, Palette, Binary, 
  AlertTriangle, Calendar, ShoppingCart, Coffee, FastForward, Gift, Moon, Star, Volume2, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

// LOFI TRACK DATA
const LOFI_LIBRARY = [
  { id: 'track1', name: 'Deep Space Focus', url: 'https://stream.zeno.fm/0r0xa792kwzuv', cost: 0, unlocked: true },
  { id: 'track2', name: 'Rainy Night Desk', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cost: 100, unlocked: false },
  { id: 'track3', name: 'Cyberpunk Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cost: 250, unlocked: false },
  { id: 'track4', name: 'Zen Garden', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cost: 500, unlocked: false },
];

export default function StudyCreditsUltimateOS() {
  const [sc, setSc] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [name, setName] = useState("");
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(1500); 
  const [isActive, setIsActive] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [unlockedTracks, setUnlockedTracks] = useState(['track1']);
  const [currentTrack, setCurrentTrack] = useState(LOFI_LIBRARY[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setTotalHours(Number(localStorage.getItem(`hours_${savedName}`)) || 0);
    const savedTracks = JSON.parse(localStorage.getItem(`tracks_${savedName}`) || '["track1"]');
    setUnlockedTracks(savedTracks);
    
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.loop = true;
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.loop = true;
      if (wasPlaying) audioRef.current.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        if (timerMode === 'pomodoro') {
          if (timeLeft > 0) setTimeLeft(prev => prev - 1);
          else { setIsActive(false); addSC(50); confetti(); }
        } else {
          setStopwatchTime(prev => prev + 1);
          if (stopwatchTime > 0 && stopwatchTime % 3600 === 0) {
            setTotalHours(h => h + 1);
            localStorage.setItem(`hours_${name}`, (totalHours + 1).toString());
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode, stopwatchTime, name, totalHours]);

  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem(`sc_${name}`, total.toString());
    confetti({ particleCount: 150, spread: 60 });
  };

  const buyReward = (cost: number, itemName: string, isTrack = false, trackId = "") => {
    if (sc >= cost) {
      const total = sc - cost;
      setSc(total);
      localStorage.setItem(`sc_${name}`, total.toString());
      if (isTrack) {
        const newTracks = [...unlockedTracks, trackId];
        setUnlockedTracks(newTracks);
        localStorage.setItem(`tracks_${name}`, JSON.stringify(newTracks));
      }
      alert(`REWARD ACTIVATED: ${itemName} 🎁`);
    } else {
      alert("INSUFFICIENT CREDITS ❌");
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isGhostMode ? 'bg-black' : 'bg-[#05070a]'} text-white p-6 font-sans relative overflow-hidden`}>
      
      {/* 🧊 LIQUID GLASS BACKGROUND */}
      <div className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ${isGhostMode ? 'opacity-10' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#05070a] to-[#1a0b2e]" />
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} animate={{ x: [0, 800, 0], y: [0, 500, 0] }} transition={{ duration: 30 + i * 5, repeat: Infinity }}
            className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
        ))}
      </div>

      {/* 👻 STEALTH GHOST OVERLAY */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="text-center z-10 pointer-events-auto">
              <p className="text-[14rem] font-mono font-black tracking-tighter mb-4 text-white/90 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] leading-none">
                {formatTime(timerMode === 'pomodoro' ? timeLeft : stopwatchTime)}
              </p>
              <button onClick={() => setIsGhostMode(false)} className="mt-12 text-[10px] font-black tracking-[1em] text-white/20 hover:text-white uppercase transition-all">
                [ EXIT_VOID ]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT: IDENTITY & STORE 👤🛒 */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 mx-auto"><User size={30} /></div>
            <input value={name} onChange={(e) => {setName(e.target.value); localStorage.setItem('study_sync_name', e.target.value);}}
              className="bg-transparent text-center text-lg font-black uppercase tracking-widest border-none focus:ring-0 w-full" placeholder="NAME_KEY" />
            <div className="mt-6 space-y-2">
              <StatBox label="SC Balance" value={sc} color="text-emerald-400" icon={<Star size={12}/>} />
            </div>
          </div>

          {/* LOFI PLAYER & STORE */}
          <div className="bg-white/5 backdrop-blur-3xl p-5 rounded-[2rem] border border-white/10">
            <h3 className="text-[10px] font-black text-indigo-400 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
              <Volume2 size={14}/> Lofi Beats Store
            </h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {LOFI_LIBRARY.map(track => {
                const isUnlocked = unlockedTracks.includes(track.id);
                return (
                  <div key={track.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase">{track.name}</span>
                      <span className="text-[8px] text-slate-500">{isUnlocked ? "OWNED" : `${track.cost} SC`}</span>
                    </div>
                    {isUnlocked ? (
                      <button onClick={() => {setCurrentTrack(track); if(!isPlaying && audioRef.current) {audioRef.current.play(); setIsPlaying(true);}}} 
                        className={`p-2 rounded-lg ${currentTrack.id === track.id ? 'bg-indigo-600' : 'bg-white/5'}`}>
                        {currentTrack.id === track.id && isPlaying ? <Pause size={12}/> : <Play size={12}/>}
                      </button>
                    ) : (
                      <button onClick={() => buyReward(track.cost, track.name, true, track.id)} className="p-2 bg-yellow-600/20 text-yellow-500 rounded-lg">
                        <Lock size={12}/>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl p-5 rounded-[2rem] border border-white/10">
            <h3 className="text-[10px] font-black text-yellow-500 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
              <ShoppingCart size={14}/> Reward shop
            </h3>
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
              <RewardItem name="Coffee Break" cost={50} icon={<Coffee/>} onClick={() => buyReward(50, "Coffee Break")} />
              <RewardItem name="Gaming (1hr)" cost={250} icon={<FastForward/>} onClick={() => buyReward(250, "Gaming Unlock")} />
            </div>
          </div>
        </aside>

        {/* MAIN: TASK TERMINAL 📋 */}
        <main className="lg:col-span-6 bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <h1 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter border-b border-white/10 pb-4">
            [cite_start]<Zap className="text-yellow-400" /> A/L SC Earning Menu [cite: 1]
          </h1>
          
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            <TaskSection title="1. Core Grind">
              [cite_start]<TaskRow icon={<Clock className="animate-spin-slow"/>} name="Deep Work Hour" sc={30} onClick={() => addSC(30)} /> [cite: 2]
              [cite_start]<TaskRow icon={<RotateCcw className="animate-reverse-spin"/>} name="Pomodoro Streak" sc={50} onClick={() => addSC(50)} /> [cite: 2]
              [cite_start]<TaskRow icon={<GraduationCap/>} name="Syllabus Progress" sc={40} onClick={() => addSC(40)} /> [cite: 2]
              [cite_start]<TaskRow icon={<Edit3/>} name="Ultra-Summary" sc={35} onClick={() => addSC(35)} /> [cite: 2]
              [cite_start]<TaskRow icon={<Layout/>} name="The Clean Slate" sc={15} onClick={() => addSC(15)} /> [cite: 2]
            </TaskSection>

            <TaskSection title="2. Subject Power Plays">
              [cite_start]<TaskRow icon={<Binary/>} name="Combined Maths: Proof Mastery" sc={30} onClick={() => addSC(30)} /> [cite: 2]
              [cite_start]<TaskRow icon={<Calculator className="animate-bounce"/>} name="Maths: Part B Complex Q" sc={25} onClick={() => addSC(25)} /> [cite: 2]
              [cite_start]<TaskRow icon={<Wand2/>} name="Physics: The Architect" sc={30} onClick={() => addSC(30)} /> [cite: 2]
              [cite_start]<TaskRow icon={<Beaker/>} name="Chemistry: The Alchemist" sc={30} onClick={() => addSC(30)} /> [cite: 2]
            </TaskSection>

            <TaskSection title="3. Heroic Feats">
              [cite_start]<TaskRow icon={<Sword className="animate-bounce"/>} name="The Full Mock (3hr)" sc={150} onClick={() => addSC(150)} gold /> [cite: 3]
              [cite_start]<TaskRow icon={<Target/>} name="The Weakness Slayer" sc={80} onClick={() => addSC(80)} /> [cite: 3]
              [cite_start]<TaskRow icon={<Trophy/>} name="Perfect Week Bonus" sc={250} onClick={() => addSC(250)} gold /> [cite: 3]
            </TaskSection>
          </div>
        </main>

        {/* RIGHT: CONTROL PANEL ⏱️ */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-2xl text-center">
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => setTimerMode('pomodoro')} className={`text-[9px] font-black uppercase ${timerMode==='pomodoro' ? 'text-blue-400 border-b border-blue-400':'text-slate-500'}`}>Timer</button>
              <button onClick={() => setTimerMode('stopwatch')} className={`text-[9px] font-black uppercase ${timerMode==='stopwatch' ? 'text-blue-400 border-b border-blue-400':'text-slate-500'}`}>Stopwatch</button>
            </div>
            <p className="text-5xl font-mono font-black mb-6 text-white tracking-tighter">{formatTime(timerMode==='pomodoro' ? timeLeft : stopwatchTime)}</p>
            <button onClick={() => setIsActive(!isActive)} className={`w-full py-4 rounded-xl font-black uppercase text-xs transition-all ${isActive ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-blue-600 shadow-lg'}`}>
              {isActive ? "PAUSE" : "START MISSION"}
            </button>
          </div>
          <button onClick={() => setIsGhostMode(true)} className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
            <Ghost size={16}/> Protocol: Stealth
          </button>
        </aside>
      </div>
    </div>
  );
}

// Sub-Components
function StatBox({ label, value, color, icon }: any) {
  return (
    <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between items-center">
      <div className="flex items-center gap-2"> {icon} <span className="text-[9px] text-slate-500 font-bold uppercase">{label}</span> </div>
      <span className={`text-xl font-mono font-black ${color}`}>{value}</span>
    </div>
  );
}

function RewardItem({ name, cost, icon, onClick }: any) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
      <div className="flex items-center gap-3"> <div className="text-yellow-500">{icon}</div> <span className="text-[10px] font-bold text-slate-300 uppercase">{name}</span> </div>
      <span className="text-[10px] font-black text-emerald-400">-{cost}</span>
    </div>
  );
}

function TaskSection({ title, children }: any) {
  return (
    <div>
      <h3 className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.3em] mb-3 ml-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function TaskRow({ name, sc, onClick, icon, gold = false }: any) {
  return (
    <motion.div whileHover={{ x: 5 }} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${gold ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/5'}`}>
      <div className="flex items-center gap-3">
        <div className={gold ? 'text-yellow-500' : 'text-blue-400'}>{icon}</div>
        <div className="flex flex-col">
          <span className={`text-[10px] font-black uppercase tracking-tight ${gold ? 'text-yellow-200' : 'text-white'}`}>{name}</span>
          <span className="text-emerald-400 text-[9px] font-bold">+{sc} SC</span>
        </div>
      </div>
      <button onClick={onClick} className="bg-blue-600/20 hover:bg-emerald-600 text-blue-400 hover:text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all">Claim</button>
    </motion.div>
  );
}