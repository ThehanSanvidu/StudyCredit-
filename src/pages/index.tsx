"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, User, Zap, 
  Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Minus, Brain, BookOpen, Calculator, RotateCcw,
  Coffee, Layout, Edit3, FlaskConical, Beaker, Sunrise, Dumbbell, Smartphone, Ghost,
  Eye, GraduationCap, Microscope, Palette, Binary, AlertTriangle, Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudyCreditsOS() {
  const [sc, setSc] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [name, setName] = useState("");
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(1500); 
  const [isActive, setIsActive] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persistence & Sync Setup 🔐
  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setTotalHours(Number(localStorage.getItem(`hours_${savedName}`)) || 0);
    // Lofi Stream
    audioRef.current = new Audio("https://stream.zeno.fm/0r0xa792kwzuv");
    audioRef.current.loop = true;
  }, []);

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
  }, [isActive, timeLeft, timerMode, stopwatchTime, name]);

  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem(`sc_${name}`, total.toString());
    confetti({ particleCount: 150, spread: 60, colors: ['#60a5fa', '#a855f7', '#10b981'] });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isGhostMode ? 'bg-black' : 'bg-[#05070a]'} text-white p-6 font-sans relative overflow-hidden`}>
      
      {/* 🧊 IMPROVED LIQUID GLASS BACKGROUND */}
      <div className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ${isGhostMode ? 'opacity-20' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#05070a] to-[#1a0b2e]" />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [Math.random() * -200, Math.random() * 1000, Math.random() * -200],
              y: [Math.random() * -200, Math.random() * 800, Math.random() * -200],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 25 + i * 5, repeat: Infinity, ease: "linear" }}
            className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px]"
          />
        ))}
      </div>

      {/* 👻 STEALTH GHOST OVERLAY */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 4 }}
              className="text-[12rem] font-mono font-black tracking-tighter text-white/5 absolute select-none"
            >
              {formatTime(timerMode === 'pomodoro' ? timeLeft : stopwatchTime)}
            </motion.div>
            <div className="text-center z-10 pointer-events-auto">
              <p className="text-8xl font-mono font-black tracking-tighter mb-4 text-purple-500/80 drop-shadow-2xl">
                {formatTime(timerMode === 'pomodoro' ? timeLeft : stopwatchTime)}
              </p>
              <div className="flex justify-center gap-8 mt-10">
                <button onClick={() => setIsActive(!isActive)} className="text-xs font-black tracking-[0.5em] uppercase text-white/40 hover:text-white transition-colors">
                  {isActive ? "[ PAUSE ]" : "[ RESUME ]"}
                </button>
                <button onClick={() => setIsGhostMode(false)} className="text-xs font-black tracking-[0.5em] uppercase text-red-500/60 hover:text-red-500 transition-colors">
                  [ EXIT_STEALTH ]
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* SIDEBAR 👤 */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center">
              <motion.div whileHover={{ scale: 1.1 }} className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-blue-500/20">
                <User size={40} />
              </motion.div>
              <input 
                value={name} 
                onChange={(e) => {setName(e.target.value); localStorage.setItem('study_sync_name', e.target.value);}}
                className="bg-transparent text-center text-xl font-black uppercase tracking-widest border-none focus:ring-0 w-full placeholder-white/20"
                placeholder="NAME_KEY"
              />
              <div className="mt-8 w-full space-y-3">
                <StatBox label="Credits" value={sc} color="text-emerald-400" />
                <StatBox label="Hours" value={totalHours} color="text-cyan-400" />
              </div>
            </div>
          </div>

          <button onClick={() => { if(audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all ${isPlaying ? 'bg-indigo-600 shadow-lg shadow-indigo-500/50' : 'bg-white/5 border border-white/10'}`}>
            <Music className={isPlaying ? "animate-pulse" : ""} />
            <span className="text-xs font-black uppercase tracking-widest">Lofi Focus Stream</span>
          </button>

          <button onClick={() => setIsGhostMode(true)} className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-purple-600/20 transition-all">
            <Ghost className="animate-bounce" />
            <span className="text-xs font-black uppercase tracking-widest text-purple-400">Enter Stealth Mode</span>
          </button>
        </aside>

        {/* MAIN TERMINAL 📋 */}
        <main className="lg:col-span-6 bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <h1 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
              <Zap className="text-yellow-400 animate-pulse" /> Mission Control
            </h1>
            <span className="text-[10px] font-bold text-slate-500">A/L EDITION V2.0</span>
          </div>
          
          <div className="space-y-6 max-h-[650px] overflow-y-auto pr-4 custom-scrollbar">
            {/* 1. CORE GRIND */}
            <div>
              <h3 className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.3em] mb-4 ml-2">1. Core Grind [cite: 5]</h3>
              <div className="space-y-3">
                <TaskRow icon={<Clock className="animate-spin-slow"/>} name="Deep Work Hour" sc={30} onClick={() => addSC(30)} />
                <TaskRow icon={<RotateCcw className="animate-reverse-spin"/>} name="Pomodoro Streak" sc={50} onClick={() => addSC(50)} />
                <TaskRow icon={<GraduationCap className="animate-bounce"/>} name="Syllabus Progress" sc={40} onClick={() => addSC(40)} />
                <TaskRow icon={<Edit3 className="animate-pulse"/>} name="Ultra-Summary" sc={35} onClick={() => addSC(35)} />
                <TaskRow icon={<Layout className="animate-pulse"/>} name="The Clean Slate" sc={15} onClick={() => addSC(15)} />
                <TaskRow icon={<Calendar className="animate-pulse"/>} name="End-of-Day Review" sc={20} onClick={() => addSC(20)} />
              </div>
            </div>

            {/* 2. POWER PLAYS */}
            <div>
              <h3 className="text-[10px] font-black text-pink-500/60 uppercase tracking-[0.3em] mb-4 ml-2">2. Subject Power Plays </h3>
              <div className="space-y-3">
                <TaskRow icon={<Calculator className="animate-bounce"/>} name="Maths: Part B Complex" sc={25} onClick={() => addSC(25)} />
                <TaskRow icon={<Binary className="animate-pulse"/>} name="Maths: Proof Mastery" sc={30} onClick={() => addSC(30)} />
                <TaskRow icon={<Wand2 className="animate-pulse"/>} name="Physics: The Architect" sc={30} onClick={() => addSC(30)} />
                <TaskRow icon={<Palette className="animate-pulse"/>} name="Physics: The Visualizer" sc={15} onClick={() => addSC(15)} />
                <TaskRow icon={<Beaker className="animate-pulse"/>} name="Chemistry: The Alchemist" sc={30} onClick={() => addSC(30)} />
                <TaskRow icon={<Microscope className="animate-pulse"/>} name="Chemistry: Color Guru" sc={25} onClick={() => addSC(25)} />
                <TaskRow icon={<FlaskConical className="animate-pulse"/>} name="The Balancer (Redox)" sc={20} onClick={() => addSC(20)} />
              </div>
            </div>

            {/* 3. HEROIC FEATS */}
            <div>
              <h3 className="text-[10px] font-black text-yellow-500/60 uppercase tracking-[0.3em] mb-4 ml-2">3. Heroic Feats [cite: 6]</h3>
              <div className="space-y-3">
                <TaskRow icon={<Sword className="animate-bounce"/>} name="The Full Mock (3hr)" sc={150} onClick={() => addSC(150)} gold />
                <TaskRow icon={<Target className="animate-pulse"/>} name="The Weakness Slayer" sc={80} onClick={() => addSC(80)} />
                <TaskRow icon={<AlertTriangle className="animate-pulse"/>} name="The Error Log (10x)" sc={60} onClick={() => addSC(60)} />
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: CONTROL PANEL ⏱️ */}
        <aside className="lg:col-span-3">
          <div className="bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center sticky top-6">
            <div className="flex justify-center gap-6 mb-8">
              <button onClick={() => setTimerMode('pomodoro')} className={`text-[10px] font-black uppercase tracking-widest ${timerMode === 'pomodoro' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>Timer</button>
              <button onClick={() => setTimerMode('stopwatch')} className={`text-[10px] font-black uppercase tracking-widest ${timerMode === 'stopwatch' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>Stopwatch</button>
            </div>
            <p className="text-6xl font-mono font-black mb-10 tracking-tighter text-white">{timerMode === 'pomodoro' ? formatTime(timeLeft) : formatTime(stopwatchTime)}</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setIsActive(!isActive)} className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${isActive ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-blue-600 shadow-lg shadow-blue-500/40'}`}>
                {isActive ? "Emergency Stop" : "Initiate Focus"}
              </button>
              <button onClick={() => {setIsActive(false); setStopwatchTime(0); setTimeLeft(1500);}} className="text-[10px] font-bold text-slate-500 uppercase hover:text-white transition-colors mt-2">Reset System</button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-white/20 transition-all">
      <span className="text-[10px] text-slate-500 font-bold uppercase group-hover:text-slate-300">{label}</span>
      <span className={`text-2xl font-mono font-black ${color}`}>{value}</span>
    </div>
  );
}

function TaskRow({ name, sc, onClick, icon, gold = false }: any) {
  return (
    <motion.div whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.05)' }} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${gold ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/5'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-black/20 ${gold ? 'text-yellow-500' : 'text-blue-400'}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className={`text-[11px] font-black uppercase tracking-tight ${gold ? 'text-yellow-200' : 'text-white'}`}>{name}</span>
          <span className="text-emerald-400 text-[10px] font-bold">+{sc} SC </span>
        </div>
      </div>
      <button onClick={onClick} className="bg-blue-600/20 hover:bg-emerald-600 text-blue-400 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all">Claim</button>
    </motion.div>
  );
}