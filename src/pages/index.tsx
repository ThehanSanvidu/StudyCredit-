"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, User, Star, 
  Gamepad2, Play, Zap, Ghost, Clock, Wand2, Sword, 
  Music, Pause, Timer, Hourglass, Plus, Minus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudyCreditsFinalOS() {
  const [sc, setSc] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("");
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins
  const [customMins, setCustomMins] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Background Animation Stars 🌌
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 2 + Math.random() * 4
  }));

  // 2. Persistent Storage & Audio Setup
  useEffect(() => {
    setSc(Number(localStorage.getItem('total_sc')) || 0);
    setTotalHours(Number(localStorage.getItem('total_hours')) || 0);
    setName(localStorage.getItem('user_name') || "Elite Scholar");
    refreshFormula();
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audioRef.current.loop = true;
  }, []);

  // 3. Timer & Stopwatch Logic ⏱️
  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        if (timerMode === 'pomodoro') {
          if (timeLeft > 0) setTimeLeft(prev => prev - 1);
          else {
            setIsActive(false);
            addSC(50, "Focus Session");
            confetti();
          }
        } else {
          setStopwatchTime(prev => prev + 1);
          if (stopwatchTime % 3600 === 0 && stopwatchTime > 0) {
            setTotalHours(prev => prev + 1);
            localStorage.setItem('total_hours', (totalHours + 1).toString());
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode, stopwatchTime]);

  const addSC = (amount: number, task: string) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem('total_sc', total.toString());
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  const refreshFormula = () => {
    const formulas = [
      "Physics: Bernoulli's - P + 1/2ρv² + ρgh = Constant",
      "Chemistry: Ideal Gas Law - PV = nRT",
      "Maths: De Moivre's - [r(cosθ + isinθ)]ⁿ",
      "Physics: Doppler Effect - f' = f [v / (v ± vs)]",
      "Chemistry: First Law Thermodynamics - ΔU = q + w",
      "Maths: Standard Integration - ∫sec²x dx = tan x + C"
    ];
    setFormula(formulas[Math.floor(Math.random() * formulas.length)]);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 font-sans relative overflow-hidden">
      {/* 🌌 ANIMATED SPACE BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        {stars.map(star => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: star.duration, repeat: Infinity }}
            className="absolute bg-white rounded-full"
            style={{ width: star.size, height: star.size, left: `${star.x}%`, top: `${star.y}%` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT: IDENTITY & HOURS 👑 */}
        <aside className="lg:col-span-3 space-y-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                <User size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">{name}</h2>
              <div className="mt-4 w-full grid grid-cols-2 gap-2">
                <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Credits</p>
                  <p className="text-xl font-mono text-emerald-400 font-bold">{sc}</p>
                </div>
                <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Hours</p>
                  <p className="text-xl font-mono text-cyan-400 font-bold">{totalHours}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10">
            <h3 className="text-xs font-black uppercase text-indigo-300 mb-4 flex items-center gap-2"><Music size={14}/> Soundscape</h3>
            <button 
              onClick={() => { if(audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${isPlaying ? 'bg-indigo-500 shadow-indigo-500/40' : 'bg-slate-800'} shadow-lg active:scale-95`}
            >
              {isPlaying ? <Pause size={20}/> : <Play size={20}/>}
              <span className="text-xs font-bold uppercase tracking-widest">{isPlaying ? "Mute" : "Lofi Stream"}</span>
            </button>
          </div>
        </aside>

        {/* CENTER: MASSIVE TASK LIST 📋 */}
        <main className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900/20 backdrop-blur-sm p-8 rounded-[3rem] border border-white/5">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              <Zap className="text-yellow-400" /> MISSION CONTROL
            </h1>
            
            <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <TaskRow icon={<Clock/>} name="Deep Work (1 Hour)" sc={30} onClick={() => addSC(30, "Deep")} />
              <TaskRow icon={<Sword/>} name="Full Mock Exam (3hr)" sc={150} onClick={() => addSC(150, "Mock")} gold />
              <TaskRow icon={<Target/>} name="Part B Mastery (Maths)" sc={25} onClick={() => addSC(25, "Math")} />
              <TaskRow icon={<Brain/>} name="Organic Synthesis Chain" sc={35} onClick={() => addSC(35, "Chem")} />
              <TaskRow icon={<CheckCircle/>} name="Physics: Unit Test" sc={40} onClick={() => addSC(40, "Physics")} />
              <TaskRow icon={<Flame/>} name="No-Phone Streak (4hr)" sc={60} onClick={() => addSC(60, "Focus")} />
              <TaskRow icon={<Target/>} name="Syllabus Unit Clear" sc={80} onClick={() => addSC(80, "Syllabus")} />
              <TaskRow icon={<User/>} name="Feynman Explanation" sc={50} onClick={() => addSC(50, "Feynman")} />
            </div>
          </div>
        </main>

        {/* RIGHT: SMART TIMER ⏱️ */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center">
            <div className="flex justify-center gap-4 mb-6">
              <button onClick={() => {setTimerMode('pomodoro'); setIsActive(false);}} className={`text-[10px] font-bold uppercase tracking-widest ${timerMode === 'pomodoro' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500'}`}>Timer</button>
              <button onClick={() => {setTimerMode('stopwatch'); setIsActive(false);}} className={`text-[10px] font-bold uppercase tracking-widest ${timerMode === 'stopwatch' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500'}`}>Stopwatch</button>
            </div>

            <p className="text-6xl font-mono font-black mb-6 tracking-tighter text-white">
              {timerMode === 'pomodoro' ? formatTime(timeLeft) : formatTime(stopwatchTime)}
            </p>

            {timerMode === 'pomodoro' && !isActive && (
              <div className="flex items-center justify-center gap-4 mb-6 bg-black/30 p-2 rounded-xl">
                <button onClick={() => {setCustomMins(m => Math.max(1, m-5)); setTimeLeft((customMins-5)*60)}}><Minus size={16}/></button>
                <span className="text-xs font-bold uppercase">{customMins}m</span>
                <button onClick={() => {setCustomMins(m => m+5); setTimeLeft((customMins+5)*60)}}><Plus size={16}/></button>
              </div>
            )}

            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${isActive ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-cyan-600 shadow-lg shadow-cyan-500/20'}`}
            >
              {isActive ? "PAUSE" : "START SESSION"}
            </button>
          </div>

          <div className="bg-indigo-500/10 p-8 rounded-[2.5rem] border border-indigo-500/20 group">
             <h3 className="text-xs font-black uppercase text-indigo-400 mb-4 flex items-center gap-2"><Wand2 size={16}/> Daily Concept</h3>
             <p className="text-xs font-medium italic text-slate-200 mb-6 bg-black/40 p-4 rounded-2xl leading-relaxed">"{formula}"</p>
             <button onClick={() => { addSC(5, "Trivia"); refreshFormula(); }} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 shadow-lg">Explained +5 SC</button>
          </div>
        </aside>

      </div>
    </div>
  );
}

function TaskRow({ name, sc, onClick, icon, gold = false }: any) {
  return (
    <motion.div whileHover={{ x: 5 }} className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${gold ? 'bg-yellow-500/5 border-yellow-500/30 shadow-lg shadow-yellow-950/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
      <div className="flex items-center gap-4">
        <div className={`${gold ? 'text-yellow-500' : 'text-cyan-400'}`}>{icon}</div>
        <div className="flex flex-col">
          <span className={`text-xs font-black uppercase tracking-tight ${gold ? 'text-yellow-200' : 'text-slate-100'}`}>{name}</span>
          <span className="text-emerald-400 text-[10px] font-bold tracking-widest">+{sc} SC</span>
        </div>
      </div>
      <button onClick={onClick} className="bg-slate-800 hover:bg-emerald-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all border border-white/5 shadow-inner">Complete</button>
    </motion.div>
  );
}