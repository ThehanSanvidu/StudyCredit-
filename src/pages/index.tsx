"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, RefreshCw, User, Star, 
  ShoppingCart, Gamepad2, Pizza, Play, Zap, Brain, Ghost, 
  Clock, ShieldAlert, Users, Search, Microscope, Wand2, 
  Sword, BookOpen, AlertCircle, Music
} from 'lucide-react';

export default function StudyCreditsUltimateOS() {
  const [sc, setSc] = useState(0);
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("");
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isGhosted, setIsGhosted] = useState(false);
  const [isBossMode, setIsBossMode] = useState(false);
  const [errorLog, setErrorLog] = useState<{id: number, msg: string, sub: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Rank System 👑
  const getRank = () => {
    if (sc < 500) return { title: "Novice", color: "text-slate-400", icon: "🌱" };
    if (sc < 1500) return { title: "Apprentice", color: "text-blue-400", icon: "🛡️" };
    if (sc < 3000) return { title: "Specialist", color: "text-purple-400", icon: "⚔️" };
    if (sc < 6000) return { title: "Master", color: "text-cyan-400", icon: "💎" };
    return { title: "Legend", color: "text-yellow-400", icon: "👑" };
  };

  // 2. Ghost Timer & Boss Mode Logic 👻🐉
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTimerActive) {
        setIsGhosted(true);
        setIsTimerActive(false);
        alert("🚨 GHOST DETECTED! You switched tabs. Session broken!");
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
      const payout = isBossMode ? 150 : 50;
      addSC(payout, isBossMode ? "BOSS DEFEATED" : "Focus Session");
      setIsTimerActive(false);
      setIsBossMode(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // 3. Formula Randomizer 🧪
  const refreshFormula = () => {
    const formulas = [
      "Physics: $P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{constant}$",
      "Chemistry: $S_N1$ vs $S_N2$ Mechanisms",
      "Maths: $(\\cos \\theta + i \\sin \\theta)^n = \\cos n\\theta + i \\sin n\\theta$",
      "Physics: $f_{obs} = f_s \\left( \\frac{v \\pm v_o}{v \\mp v_s} \\right)$",
      "Chemistry: $[Ar] 3d^{10} 4s^1$ (Copper configuration)"
    ];
    setFormula(formulas[Math.floor(Math.random() * formulas.length)]);
  };

  useEffect(() => {
    const savedSc = localStorage.getItem('total_sc');
    if (savedSc) setSc(parseInt(savedSc));
    const savedName = localStorage.getItem('user_name') || prompt("Enter Hero Name:") || "Hero";
    setName(savedName);
    localStorage.setItem('user_name', savedName);
    const savedErrors = localStorage.getItem('error_log');
    if (savedErrors) setErrorLog(JSON.parse(savedErrors));
    refreshFormula();
  }, []);

  const addSC = (amount: number, task: string) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem('total_sc', total.toString());
  };

  const addError = (e: any) => {
    e.preventDefault();
    const msg = e.target.error.value;
    const sub = e.target.subject.value;
    const newList = [...errorLog, { id: Date.now(), msg, sub }];
    setErrorLog(newList);
    localStorage.setItem('error_log', JSON.stringify(newList));
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 font-sans overflow-x-hidden selection:bg-cyan-500/30">
      {/* 📊 LIVE PULSE: TOP PROGRESS BAR */}
      <motion.div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 z-50 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        initial={{ width: 0 }}
        animate={{ width: `${(sc % 500) / 5}%` }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        
        {/* LEFT COL: RANK & TRIVIA 👑 */}
        <aside className="lg:col-span-3 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl">
            <div className="text-4xl mb-2">{getRank().icon}</div>
            <h2 className="text-xl font-black uppercase tracking-tighter">{name}</h2>
            <p className={`text-xs font-bold uppercase tracking-widest ${getRank().color}`}>RANK: {getRank().title}</p>
            <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center shadow-inner">
               <p className="text-4xl font-mono font-black text-emerald-400">{sc}</p>
               <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Available Credits</p>
            </div>
          </motion.div>

          <div className="bg-indigo-900/20 p-6 rounded-3xl border border-indigo-500/30 group">
            <h3 className="text-xs font-black uppercase text-indigo-400 mb-3 flex items-center gap-2"><Wand2 size={14}/> Formula Randomizer</h3>
            <div className="p-3 bg-slate-900/50 rounded-xl mb-4 min-h-[60px] flex items-center justify-center text-center">
              <p className="text-xs text-slate-200">{formula}</p>
            </div>
            <button onClick={() => { addSC(5, "Trivia"); refreshFormula(); }} className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95 shadow-lg">Explain & Earn +5 SC</button>
          </div>
        </aside>

        {/* MIDDLE COL: DASHBOARD & BOSS FIGHT 🐉 */}
        <main className="lg:col-span-6 space-y-6">
          <header className="flex justify-between items-center bg-slate-900/50 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                <Zap className="text-yellow-400 animate-pulse" /> LIVE PULSE
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Subject Mastery Heatmap</p>
            </div>
            <div className="flex gap-1.5 p-2 bg-slate-950/50 rounded-lg">
              {[...Array(14)].map((_, i) => (
                <div key={i} className={`w-3.5 h-3.5 rounded-sm shadow-sm transition-colors duration-500 ${i % 3 === 0 ? 'bg-cyan-500/80' : i % 4 === 0 ? 'bg-emerald-500/80' : 'bg-slate-800'}`}></div>
              ))}
            </div>
          </header>

          {/* BOSS BATTLE ARENA */}
          <section className="bg-gradient-to-br from-red-900/40 to-slate-950 p-6 rounded-[2rem] border border-red-500/30 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Sword size={120} /></div>
            <h2 className="text-lg font-black text-red-500 uppercase tracking-tighter flex items-center gap-2 mb-4"><ShieldAlert /> BOSS BATTLE ARENA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-red-900/50">
                <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Current Boss</p>
                <p className="text-sm font-black text-white uppercase">The 3-Hour Full Mock </p>
                <p className="text-emerald-400 text-xs font-bold mt-2">+150 SC Reward </p>
              </div>
              <button 
                onClick={() => { setTimer(10800); setIsTimerActive(true); setIsBossMode(true); }}
                className="bg-red-600 hover:bg-red-500 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-900/20 active:scale-95 transition-all"
              >
                START CHALLENGE
              </button>
            </div>
          </section>

          {/* CORE TASKS */}
          <div className="space-y-3">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Earning Streams</h2>
            <TaskBtn name="Deep Work Hour [cite: 5]" sc={30} onClick={() => addSC(30, "Deep Work")} />
            <TaskBtn name="Chemistry Alchemist [cite: 5]" sc={30} onClick={() => addSC(30, "Chem")} />
            <TaskBtn name="Maths Part B Complex [cite: 5]" sc={25} onClick={() => addSC(25, "Math")} />
          </div>

          {/* ERROR LOG DATABASE */}
          <section className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-4 flex items-center gap-2"><Search size={14}/> Error Log Database </h3>
            <form onSubmit={addError} className="flex gap-2 mb-4">
              <input name="subject" placeholder="Sub" className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs w-20 outline-none focus:border-cyan-500" />
              <input name="error" placeholder="Describe the 'Bug' in your logic..." className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs flex-1 outline-none focus:border-cyan-500" />
              <button className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700"><CheckCircle size={16}/></button>
            </form>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {errorLog.map(err => (
                <div key={err.id} className="text-[10px] p-2 bg-slate-950/50 rounded border border-slate-800 flex justify-between">
                  <span className="text-red-400 font-bold w-12">{err.sub}</span>
                  <span className="flex-1 text-slate-300 ml-2">{err.msg}</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* RIGHT COL: FOCUS & GACHA 🎡 */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center relative overflow-hidden shadow-2xl">
            {isGhosted && <Ghost className="absolute top-4 right-4 text-red-500 animate-bounce" size={24} />}
            <h3 className="text-xs font-black uppercase text-cyan-400 mb-2 flex items-center justify-center gap-2"><Clock size={14}/> Focus Mode</h3>
            <p className="text-5xl font-mono font-black mb-4 text-white drop-shadow-md">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </p>
            <div className="flex gap-2 justify-center">
              {!isTimerActive ? (
                <button onClick={() => { setTimer(1500); setIsTimerActive(true); setIsGhosted(false); }} className="bg-cyan-600 px-6 py-2.5 rounded-xl text-xs font-bold uppercase shadow-lg shadow-cyan-900/20 active:scale-95 transition-all">Start</button>
              ) : (
                <button onClick={() => setIsTimerActive(false)} className="bg-slate-800 px-6 py-2.5 rounded-xl text-xs font-bold uppercase">Pause</button>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
              <Music size={12}/> Ambient Sound: Active
            </div>
          </div>

          <div className="bg-yellow-900/10 p-6 rounded-3xl border border-yellow-500/30 shadow-xl">
            <h3 className="text-xs font-black uppercase text-yellow-500 mb-4 flex items-center gap-2"><Gamepad2 size={16}/> Gacha Mystery Box</h3>
            <button 
              onClick={() => {
                if (sc < 150) return alert("Need 150 SC to pull!");
                const prizes = ["1hr Gaming Pass 🎮", "Cheat Meal Coupon 🍕", "YouTube 20m Pass 📺", "Sleep-In Pass 😴"];
                setSc(prev => prev - 150);
                alert(`🎡 GACHA WIN: ${prizes[Math.floor(Math.random()*prizes.length)]}!`);
              }}
              className="w-full bg-gradient-to-br from-yellow-500 to-orange-600 p-5 rounded-2xl flex flex-col items-center gap-1 group transition-all hover:rotate-1 active:scale-95 shadow-lg shadow-yellow-900/20"
            >
              <span className="text-sm font-black text-white">SPIN THE WHEEL</span>
              <span className="text-[10px] text-yellow-100 font-bold uppercase tracking-widest opacity-80">Cost: 150 SC</span>
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
      whileHover={{ x: 8 }}
      className={`flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 ${highlight ? 'border-yellow-500/50 bg-yellow-500/5 shadow-lg shadow-yellow-900/10' : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60'}`}
    >
      <div className="flex flex-col">
        <span className="text-xs font-black text-slate-100 uppercase tracking-tight">{name}</span>
        <span className="text-emerald-400 text-[10px] font-black tracking-widest">+{sc} SC Payout</span>
      </div>
      <button onClick={onClick} className="bg-slate-800 hover:bg-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-90 border border-slate-700">Complete</button>
    </motion.div>
  );
}