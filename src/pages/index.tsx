"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, User, Zap, 
  Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Minus, Brain, BookOpen, Calculator, RotateCcw,
  Coffee, Layout, Edit3, FlaskConical, Beaker, Sunrise, Dumbbell, Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudyCreditsOS() {
  const [sc, setSc] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [formula, setFormula] = useState("");
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(1500); 
  const [customMins, setCustomMins] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🌌 Obscura-style Star Background
  const stars = Array.from({ length: 60 }).map((_, i) => ({
    id: i, size: Math.random() * 2 + 0.5, x: Math.random() * 100, y: Math.random() * 100, duration: 2 + Math.random() * 3, delay: Math.random() * 5
  }));

  useEffect(() => {
    setSc(Number(localStorage.getItem('total_sc')) || 0);
    setTotalHours(Number(localStorage.getItem('total_hours')) || 0);
    refreshFormula();
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
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
            localStorage.setItem('total_hours', (totalHours + 1).toString());
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode, stopwatchTime]);

  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem('total_sc', total.toString());
    confetti({ particleCount: 150, spread: 60, origin: { y: 0.7 } });
  };

  const refreshFormula = () => {
    const formulas = ["PV = nRT", "P + 1/2ρv² + ρgh = constant", "ΔU = q + w", "∫ sec²x dx = tan x + C"];
    setFormula(formulas[Math.floor(Math.random() * formulas.length)]);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 font-sans relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1128] to-[#02040a]" />
        {stars.map(star => (
          <motion.div key={star.id} animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
            className="absolute bg-white rounded-full shadow-[0_0_5px_white]" style={{ width: star.size, height: star.size, left: `${star.x}%`, top: `${star.y}%` }} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-4 mx-auto"><User size={40} /></div>
            <h2 className="text-xl font-black uppercase tracking-widest">Elite Scholar</h2>
            <div className="mt-6 space-y-3">
              <Stat label="Credits" value={sc} color="text-emerald-400" />
              <Stat label="Hours" value={totalHours} color="text-cyan-400" />
            </div>
          </div>
          <button onClick={() => { if(audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${isPlaying ? 'bg-indigo-600' : 'bg-white/5 border border-white/10'}`}>
            {isPlaying ? <Pause size={20}/> : <Play size={20}/>} <span className="text-xs font-black uppercase">Lofi Ambience</span>
          </button>
        </aside>

        <main className="lg:col-span-6 bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <h1 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter border-b border-white/10 pb-4"><Zap className="text-yellow-400" /> SC Earning Menu</h1>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">1. Core Grind</h3>
            <TaskRow icon={<Clock/>} name="Deep Work Hour" sc={30} onClick={() => addSC(30)} />
            <TaskRow icon={<RotateCcw/>} name="Pomodoro Streak (4 sessions)" sc={50} onClick={() => addSC(50)} />
            <TaskRow icon={<BookOpen/>} name="Syllabus Progress (1 topic)" sc={40} onClick={() => addSC(40)} />
            <TaskRow icon={<Edit3/>} name="Ultra-Summary (1 page)" sc={35} onClick={() => addSC(35)} />
            <TaskRow icon={<Layout/>} name="The Clean Slate (Tidy space)" sc={15} onClick={() => addSC(15)} />

            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6">2. Exam Power Plays</h3>
            <TaskRow icon={<Calculator/>} name="Maths: Part B Complex Q" sc={25} onClick={() => addSC(25)} />
            <TaskRow icon={<Wand2/>} name="Physics: Formula Derivation" sc={30} onClick={() => addSC(30)} />
            <TaskRow icon={<Beaker/>} name="Chemistry: Organic Synthesis" sc={30} onClick={() => addSC(30)} />
            <TaskRow icon={<FlaskConical/>} name="Redox/Inorganic Mastery" sc={25} onClick={() => addSC(25)} />

            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6">3. Heroic Feats</h3>
            <TaskRow icon={<Sword/>} name="Full 3-Hour Mock Exam" sc={150} onClick={() => addSC(150)} gold />
            <TaskRow icon={<Target/>} name="The Weakness Slayer (2hr)" sc={80} onClick={() => addSC(80)} />
            <TaskRow icon={<Sunrise/>} name="Early Bird (Before 7AM)" sc={40} onClick={() => addSC(40)} />
            <TaskRow icon={<Dumbbell/>} name="Physical Buff (20min Exercise)" sc={30} onClick={() => addSC(30)} />
            <TaskRow icon={<Smartphone/>} name="No-Phone Multiplier (4hr+)" sc={20} onClick={() => addSC(20)} />
          </div>
        </main>

        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl text-center">
            <div className="flex justify-center gap-6 mb-8">
              <button onClick={() => setTimerMode('pomodoro')} className={`text-[10px] font-black uppercase ${timerMode === 'pomodoro' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>Timer</button>
              <button onClick={() => setTimerMode('stopwatch')} className={`text-[10px] font-black uppercase ${timerMode === 'stopwatch' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>Stopwatch</button>
            </div>
            <p className="text-6xl font-mono font-black mb-8 text-white">{timerMode === 'pomodoro' ? formatTime(timeLeft) : formatTime(stopwatchTime)}</p>
            {timerMode === 'pomodoro' && !isActive && (
              <div className="flex items-center justify-center gap-4 mb-6"><button onClick={() => setTimeLeft(Math.max(0, timeLeft-300))}><Minus/></button><span className="text-xs font-bold">{Math.floor(timeLeft/60)}m</span><button onClick={() => setTimeLeft(timeLeft+300)}><Plus/></button></div>
            )}
            <button onClick={() => setIsActive(!isActive)} className={`w-full py-4 rounded-xl font-black uppercase text-xs ${isActive ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-blue-600 shadow-lg'}`}>{isActive ? "Pause" : "Start"}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: any) {
  return (
    <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
      <span className="text-[10px] text-slate-500 font-bold uppercase">{label}</span>
      <span className={`text-2xl font-mono font-black ${color}`}>{value}</span>
    </div>
  );
}

function TaskRow({ name, sc, onClick, icon, gold = false }: any) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${gold ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
      <div className="flex items-center gap-4 text-left">
        <div className={gold ? 'text-yellow-500' : 'text-blue-400'}>{icon}</div>
        <div className="flex flex-col"><span className={`text-xs font-black uppercase tracking-tight ${gold ? 'text-yellow-200' : 'text-white'}`}>{name}</span><span className="text-emerald-400 text-[10px] font-bold">+{sc} SC</span></div>
      </div>
      <button onClick={onClick} className="bg-slate-800 hover:bg-emerald-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-md">Claim</button>
    </div>
  );
}