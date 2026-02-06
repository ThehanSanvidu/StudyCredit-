"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, RefreshCw, User, Star, 
  ShoppingCart, Gamepad2, Pizza, Play, Zap, Brain, Ghost, 
  Clock, ShieldAlert, Wand2, Sword, Music, Pause, Volume2
} from 'lucide-react';

export default function StudyCreditsPureOS() {
  const [sc, setSc] = useState(0);
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("");
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isGhosted, setIsGhosted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Rank System 👑
  const getRank = () => {
    if (sc < 1000) return { title: "Novice Hero", color: "text-slate-400", icon: "🌱" };
    if (sc < 3000) return { title: "Scholar Knight", color: "text-blue-400", icon: "🛡️" };
    if (sc < 7000) return { title: "Exam Titan", color: "text-purple-400", icon: "⚔️" };
    return { title: "Ultimate Legend", color: "text-yellow-400", icon: "👑" };
  };

  // 2. Ambient Sound Logic 🎵
  const toggleAmbience = () => {
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); } 
      else { audioRef.current.play(); }
      setIsPlaying(!isPlaying);
    }
  };

  // 3. Formula Randomizer (Clean Text Version) 🧪
  const refreshFormula = () => {
    const formulas = [
      "Physics: Bernoulli's Principle - Pressure + KinEnergy + PotEnergy = Constant",
      "Chemistry: Ideal Gas Law - PV = nRT",
      "Maths: De Moivre's Theorem - [r(cosθ + i sinθ)]^n",
      "Physics: Doppler Effect - f' = f [v / (v ± vs)]",
      "Chemistry: Rate Law - Rate = k[A]^m [B]^n",
      "Maths: Integration by Parts - ∫u dv = uv - ∫v du",
      "Physics: Newton's Law of Cooling Rate"
    ];
    setFormula(formulas[Math.floor(Math.random() * formulas.length)]);
  };

  useEffect(() => {
    const savedSc = localStorage.getItem('total_sc');
    if (savedSc) setSc(parseInt(savedSc));
    setName(localStorage.getItem('user_name') || "Hero");
    refreshFormula();
    // Pre-load Lofi stream
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); 
    audioRef.current.loop = true;
  }, []);

  const addSC = (amount: number, task: string) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem('total_sc', total.toString());
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-4 font-sans selection:bg-cyan-500/30">
      <motion.div className="fixed top-0 left-0 h-1 bg-cyan-500 z-50 shadow-[0_0_10px_#06b6d4]" animate={{ width: `${(sc % 1000) / 10}%` }} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        
        {/* SIDEBAR: RANK & SOUND 🔊 */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-[2rem] border border-slate-800 backdrop-blur-md">
            <div className="text-4xl mb-2">{getRank().icon}</div>
            <h2 className="text-xl font-black uppercase tracking-tighter">{name}</h2>
            <p className={`text-xs font-bold uppercase tracking-widest ${getRank().color}`}>{getRank().title}</p>
            <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
               <p className="text-4xl font-mono font-black text-emerald-400">{sc}</p>
               <p className="text-[10px] uppercase text-slate-500 font-bold">Total Credits</p>
            </div>
          </div>

          <div className="bg-cyan-900/10 p-6 rounded-[2rem] border border-cyan-500/20">
            <h3 className="text-xs font-black uppercase text-cyan-400 mb-4 flex items-center gap-2"><Music size={14}/> Ambient Lofi</h3>
            <button onClick={toggleAmbience} className="w-full flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 p-3 rounded-xl transition-all active:scale-95 shadow-lg">
              {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
              <span className="text-xs font-bold uppercase">{isPlaying ? "Mute Sound" : "Play Lofi"}</span>
            </button>
          </div>
        </aside>

        {/* MAIN: DASHBOARD & TASKS 📋 */}
        <main className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800">
             <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2 mb-4">📜 TASK COMMAND</h1>
             <div className="grid grid-cols-1 gap-3">
                <TaskBtn name="Deep Work (1 Hour)" sc={30} onClick={() => addSC(30, "Deep Work")} />
                <TaskBtn name="Full Mock Exam (3hr)" sc={150} onClick={() => addSC(150, "Mock")} highlight />
                <TaskBtn name="Maths: Part B Mastery" sc={25} onClick={() => addSC(25, "Math")} />
                <TaskBtn name="Physics: Formula Derivation" sc={30} onClick={() => addSC(30, "Physics")} />
                <TaskBtn name="Chemistry: Organic Synthesis" sc={35} onClick={() => addSC(35, "Chem")} />
                <TaskBtn name="No-Phone Streak (4hr)" sc={40} onClick={() => addSC(40, "No Phone")} />
                <TaskBtn name="Feynman Technique (Teach)" sc={50} onClick={() => addSC(50, "Feynman")} />
                <TaskBtn name="Syllabus Unit Completion" sc={60} onClick={() => addSC(60, "Syllabus")} />
             </div>
          </div>
        </main>

        {/* RIGHT: FOCUS & TRIVIA 🔮 */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-red-950/10 p-6 rounded-[2rem] border border-red-500/20 text-center relative overflow-hidden">
            {isGhosted && <Ghost className="absolute top-4 right-4 text-red-500 animate-pulse" size={24} />}
            <h3 className="text-xs font-black uppercase text-red-400 mb-2 flex items-center justify-center gap-2"><Clock size={14}/> Ghost Timer</h3>
            <p className="text-5xl font-mono font-black mb-4 text-white">25:00</p>
            <button className="bg-red-600 px-8 py-2.5 rounded-xl text-xs font-bold uppercase active:scale-95 transition-all shadow-lg">Focus Mode</button>
          </div>

          <div className="bg-indigo-900/10 p-6 rounded-[2rem] border border-indigo-500/20">
            <h3 className="text-xs font-black uppercase text-indigo-400 mb-3 flex items-center gap-2"><Wand2 size={14}/> Formula Check</h3>
            <div className="p-4 bg-slate-950 rounded-2xl mb-4 border border-slate-800">
              <p className="text-[11px] leading-relaxed text-slate-200 font-medium italic">"{formula}"</p>
            </div>
            <button onClick={() => { addSC(5, "Trivia"); refreshFormula(); }} className="w-full bg-indigo-600 py-3 rounded-xl text-[10px] font-bold uppercase transition-all hover:bg-indigo-500 active:scale-95 shadow-lg">Recite & Earn +5 SC</button>
          </div>
        </aside>

      </div>
    </div>
  );
}

function TaskBtn({ name, sc, onClick, highlight = false }: any) {
  return (
    <motion.div whileHover={{ x: 5 }} className={`flex justify-between items-center p-4 rounded-2xl border ${highlight ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-slate-800 bg-slate-900/40'}`}>
      <div className="flex flex-col">
        <span className="text-xs font-black text-slate-100 uppercase tracking-tight">{name}</span>
        <span className="text-emerald-400 text-[10px] font-black tracking-widest">+{sc} SC</span>
      </div>
      <button onClick={onClick} className="bg-slate-800 hover:bg-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-90 border border-slate-700">Complete</button>
    </motion.div>
  );
}