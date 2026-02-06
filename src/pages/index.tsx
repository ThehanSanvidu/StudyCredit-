"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, RefreshCw, User, Star, 
  ShoppingCart, Gamepad2, Pizza, Play, Zap, Brain, Ghost, 
  Clock, ShieldAlert, Users, Search, Microscope, Wand2 
} from 'lucide-react';

export default function StudyCreditsEliteOS() {
  const [sc, setSc] = useState(0);
  const [name, setName] = useState("");
  const [badge, setBadge] = useState("");
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isGhosted, setIsGhosted] = useState(false);
  const [formula, setFormula] = useState("");

  // 1. Rank System 👑
  const getRank = () => {
    if (sc < 500) return { title: "Novice", color: "text-slate-400" };
    if (sc < 1500) return { title: "Apprentice", color: "text-blue-400" };
    if (sc < 3000) return { title: "Specialist", color: "text-purple-400" };
    if (sc < 6000) return { title: "Master", color: "text-cyan-400" };
    return { title: "Legend", color: "text-yellow-400" };
  };

  // 2. Ghost Timer Logic 👻
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTimerActive) {
        setIsGhosted(true);
        setIsTimerActive(false);
        alert("🚨 GHOST DETECTED! You left the tab. Potential SC lost!");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isTimerActive]);

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && isTimerActive) {
      addSC(50, "Focus Session");
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // 3. Formula Randomizer 🧪
  const refreshFormula = () => {
    const formulas = [
      "Physics: Bernoulli's Equation Derivation",
      "Chemistry: Sn1 vs Sn2 Mechanism",
      "Maths: De Moivre's Theorem Proof",
      "Physics: Doppler Effect Formula",
      "Chemistry: Transition Metal Color Origins"
    ];
    setFormula(formulas[Math.floor(Math.random() * formulas.length)]);
  };

  useEffect(() => {
    const savedSc = localStorage.getItem('total_sc');
    if (savedSc) setSc(parseInt(savedSc));
    const savedName = localStorage.getItem('user_name') || prompt("Enter Hero Name:") || "Hero";
    setName(savedName);
    localStorage.setItem('user_name', savedName);
    refreshFormula();
  }, []);

  const addSC = (amount: number, task: string) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem('total_sc', total.toString());
  };

  const pullGacha = () => {
    if (sc < 150) return alert("Need 150 SC for a Mystery Box!");
    const rewards = ["1hr Gaming 🎮", "Cheat Meal 🍕", "No Alarms Tomorrow 😴", "YouTube Pass 📺"];
    const prize = rewards[Math.floor(Math.random() * rewards.length)];
    setSc(prev => prev - 150);
    alert(`🎁 MYSTERY BOX OPENED: You won a ${prize}!`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 font-sans overflow-x-hidden">
      {/* Dynamic Progress Bar Background */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-cyan-500 z-50"
        style={{ width: `${(sc % 500) / 5}%` }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR: Stats & Formula Randomizer */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
            <User className="text-cyan-400 mb-2" size={32} />
            <h2 className="text-xl font-black uppercase tracking-tighter">{name}</h2>
            <p className={`text-xs font-bold uppercase tracking-widest ${getRank().color}`}>Rank: {getRank().title}</p>
            <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
               <p className="text-3xl font-mono font-black text-emerald-400">{sc}</p>
               <p className="text-[10px] uppercase text-slate-500">Credits</p>
            </div>
          </div>

          <div className="bg-indigo-900/20 p-6 rounded-3xl border border-indigo-500/30">
            <h3 className="text-xs font-black uppercase text-indigo-400 mb-3 flex items-center gap-2"><Wand2 size={14}/> Daily Trivia</h3>
            <p className="text-xs italic text-slate-300 mb-4">"{formula}"</p>
            <button onClick={() => { addSC(5, "Trivia"); refreshFormula(); }} className="w-full bg-indigo-600 py-2 rounded-lg text-[10px] font-bold uppercase">Explain & Earn +5 SC</button>
          </div>
        </aside>

        {/* MAIN: Dashboard & Tasks */}
        <main className="lg:col-span-6 space-y-6">
          <header className="flex justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2"><Zap className="text-yellow-400" /> LIVE PULSE</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Session Activity Active</p>
            </div>
            {/* Heatmap Placeholder */}
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => <div key={i} className={`w-3 h-3 rounded-sm ${i > 4 ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>)}
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Core Tasks</h2>
            <TaskBtn name="Deep Work Hour" sc={30} onClick={() => addSC(30, "Deep Work")} />
            <TaskBtn name="The Full Mock (3hr)" sc={150} onClick={() => addSC(150, "Full Mock")} highlight />
            <TaskBtn name="Physics Architect" sc={30} onClick={() => addSC(30, "Physics Architect")} />
          </div>
        </main>

        {/* RIGHT: Focus & Store */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Ghost Timer */}
          <div className="bg-red-950/20 p-6 rounded-3xl border border-red-500/30 text-center relative overflow-hidden">
            {isGhosted && <Ghost className="absolute top-2 right-2 text-red-500 animate-bounce" size={20} />}
            <h3 className="text-xs font-black uppercase text-red-400 mb-2 flex items-center justify-center gap-2"><Clock size={14}/> Ghost Timer</h3>
            <p className="text-4xl font-mono font-bold mb-4">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
            {!isTimerActive ? (
              <button onClick={() => { setTimer(1500); setIsTimerActive(true); setIsGhosted(false); }} className="bg-red-600 px-6 py-2 rounded-xl text-xs font-bold uppercase">Start Focus</button>
            ) : (
              <button onClick={() => setIsTimerActive(false)} className="bg-slate-800 px-6 py-2 rounded-xl text-xs font-bold uppercase">Pause</button>
            )}
            <p className="text-[8px] text-slate-500 mt-2 italic">Tab switch = SC penalty 📵</p>
          </div>

          {/* Gacha Store */}
          <div className="bg-yellow-900/20 p-6 rounded-3xl border border-yellow-500/30">
            <h3 className="text-xs font-black uppercase text-yellow-500 mb-4 flex items-center gap-2"><Gamepad2 size={16}/> Gacha Rewards</h3>
            <button onClick={pullGacha} className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-2xl flex flex-col items-center gap-1 group transition-transform active:scale-95">
              <span className="text-xs font-black text-white">OPEN MYSTERY BOX</span>
              <span className="text-[10px] text-yellow-200 font-bold">COST: 150 SC</span>
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}

function TaskBtn({ name, sc, onClick, highlight = false }: any) {
  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className={`flex justify-between items-center p-4 rounded-2xl border ${highlight ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-slate-800 bg-slate-900/40'}`}
    >
      <div className="flex flex-col">
        <span className="text-xs font-black text-slate-200 uppercase">{name}</span>
        <span className="text-emerald-400 text-[10px] font-black">+{sc} SC</span>
      </div>
      <button onClick={onClick} className="bg-cyan-600 px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-90">Finish</button>
    </motion.div>
  );
}