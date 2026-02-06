"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, User, Zap, 
  Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Minus, Brain, BookOpen, Calculator, RotateCcw,
  Coffee, Layout, Edit3, FlaskConical, Beaker, Sunrise, Dumbbell, Smartphone, Ghost
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

  // 1. Setup Persistent Sync Identity 🔑
  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setTotalHours(Number(localStorage.getItem(`hours_${savedName}`)) || 0);
  }, []);

  // 2. Timer & Stopwatch Logic ⏱️
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
    confetti({ particleCount: 150, spread: 60 });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 font-sans relative overflow-hidden">
      
      {/* 🧊 LIQUID GLASS BACKGROUND WITH BLURRED BUBBLES */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#05070a] to-[#1a0b2e]" />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [Math.random() * 100, Math.random() * 800, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 500, Math.random() * 100],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
            className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* SIDEBAR: SYNCED IDENTITY 👤 */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
            <div className="flex flex-col items-center">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20"
              >
                <User size={40} className="text-white" />
              </motion.div>
              <input 
                value={name} 
                onChange={(e) => {setName(e.target.value); localStorage.setItem('study_sync_name', e.target.value);}}
                className="bg-transparent text-center text-xl font-black uppercase tracking-widest border-none focus:ring-0 w-full"
                placeholder="ENTER NAME"
              />
              <p className="text-[10px] text-blue-400 font-bold mt-2">ID SYNCED ACROSS DEVICES 🌐</p>
              
              <div className="mt-8 w-full space-y-3">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Credits</span>
                  <span className="text-xl font-mono text-emerald-400 font-black">{sc}</span>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Hours</span>
                  <span className="text-xl font-mono text-cyan-400 font-black">{totalHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* GHOST MODE TOGGLE 👻 */}
          <button 
            onClick={() => setIsGhostMode(!isGhostMode)}
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all ${isGhostMode ? 'bg-purple-600 shadow-purple-500/50' : 'bg-white/5'} border border-white/10`}
          >
            <Ghost className={isGhostMode ? "animate-bounce" : ""} />
            <span className="text-xs font-black uppercase tracking-widest">
              {isGhostMode ? "EXIT GHOST MODE" : "ENTER GHOST MODE"}
            </span>
          </button>
        </aside>

        {/* MAIN: ANIMATED TASKS 📋 */}
        <main className="lg:col-span-6 bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 shadow-2xl">
          <h1 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter border-b border-white/10 pb-4">
            <Zap className="text-yellow-400 animate-pulse" /> SC MISSION CONTROL
          </h1>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {/* CORE GRIND [cite: 1] */}
            <TaskRow icon={<Clock className="animate-spin-slow"/>} name="Deep Work Hour" sc={30} onClick={() => addSC(30)} />
            <TaskRow icon={<RotateCcw className="animate-reverse-spin"/>} name="Pomodoro Streak" sc={50} onClick={() => addSC(50)} />
            
            {/* SUBJECT SPECIFIC [cite: 2] */}
            <TaskRow icon={<Calculator className="animate-bounce"/>} name="Maths: Part B Complex Q" sc={25} onClick={() => addSC(25)} />
            <TaskRow icon={<Wand2 className="animate-pulse"/>} name="Physics: Formula Derivation" sc={30} onClick={() => addSC(30)} />
            <TaskRow icon={<Beaker className="animate-pulse text-pink-400"/>} name="Chemistry: Organic Synthesis" sc={30} onClick={() => addSC(30)} />
            
            {/* HEROIC FEATS [cite: 3] */}
            <TaskRow icon={<Sword className="animate-bounce"/>} name="Full 3-Hour Mock Exam" sc={150} onClick={() => addSC(150)} gold />
            <TaskRow icon={<Smartphone className="animate-pulse"/>} name="No-Phone Multiplier (4hr)" sc={20} onClick={() => addSC(20)} />
          </div>
        </main>

        {/* RIGHT: FLOATING GHOST TIMER 👻 */}
        <aside className="lg:col-span-3">
          <AnimatePresence>
            <motion.div 
              layout
              className={`p-8 rounded-[2.5rem] border border-white/10 shadow-2xl text-center transition-all ${isGhostMode ? 'bg-purple-900/40 backdrop-blur-3xl scale-110 border-purple-500/50' : 'bg-slate-900/80'}`}
            >
              <h3 className="text-[10px] font-black text-blue-400 mb-6 tracking-[0.2em]">
                {isGhostMode ? "GHOST TRACKING ACTIVE 👻" : "STANDARD SESSION"}
              </h3>
              
              <p className={`text-6xl font-mono font-black mb-8 tracking-tighter ${isGhostMode ? 'text-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'text-white'}`}>
                {timerMode === 'pomodoro' ? formatTime(timeLeft) : formatTime(stopwatchTime)}
              </p>

              <div className="flex gap-2">
                <button onClick={() => setIsActive(!isActive)} className="flex-1 py-4 bg-blue-600 rounded-xl font-black uppercase text-xs">
                  {isActive ? "PAUSE" : "START"}
                </button>
                <button onClick={() => {setTimerMode(timerMode === 'pomodoro' ? 'stopwatch' : 'pomodoro'); setIsActive(false);}} className="p-4 bg-white/5 rounded-xl">
                  <RotateCcw size={18}/>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </aside>

      </div>
    </div>
  );
}

function TaskRow({ name, sc, onClick, icon, gold = false }: any) {
  return (
    <motion.div whileHover={{ x: 10, scale: 1.02 }} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${gold ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/5'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-black/20 ${gold ? 'text-yellow-500' : 'text-blue-400'}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-black uppercase tracking-tight ${gold ? 'text-yellow-200' : 'text-white'}`}>{name}</span>
          <span className="text-emerald-400 text-[10px] font-bold">+{sc} SC </span>
        </div>
      </div>
      <button onClick={onClick} className="bg-blue-600/20 hover:bg-emerald-600 text-blue-400 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all">Claim</button>
    </motion.div>
  );
}