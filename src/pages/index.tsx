"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, User, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Minus, Brain, BookOpen, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Sunrise, Dumbbell, Smartphone, Ghost, GraduationCap, Microscope, Palette, Binary, 
  AlertTriangle, Calendar, ShoppingCart, Coffee, FastForward, Gift, Moon, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setTotalHours(Number(localStorage.getItem(`hours_${savedName}`)) || 0);
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
  }, [isActive, timeLeft, timerMode, stopwatchTime, name, totalHours]);

  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem(`sc_${name}`, total.toString());
    confetti({ particleCount: 150, spread: 60 });
  };

  const buyReward = (cost: number, itemName: string) => {
    if (sc >= cost) {
      const total = sc - cost;
      setSc(total);
      localStorage.setItem(`sc_${name}`, total.toString());
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
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center pointer-events-none"
          >
            <p className="text-9xl font-mono font-black tracking-tighter text-white/10 absolute select-none">
              {formatTime(timerMode === 'pomodoro' ? timeLeft : stopwatchTime)}
            </p>
            <div className="text-center z-10 pointer-events-auto">
              <p className="text-[14rem] font-mono font-black tracking-tighter mb-4 text-white/80 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] leading-none">
                {formatTime(timerMode === 'pomodoro' ? timeLeft : stopwatchTime)}
              </p>
              <button onClick={() => setIsGhostMode(false)} className="mt-12 text-[10px] font-black tracking-[1em] text-white/30 hover:text-white uppercase transition-all">
                [ ESCAPE_VOID ]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT: IDENTITY & STORE 👤🛒 */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-xl shadow-blue-500/20"><User size={30} /></div>
              <input value={name} onChange={(e) => {setName(e.target.value); localStorage.setItem('study_sync_name', e.target.value);}}
                className="bg-transparent text-center text-lg font-black uppercase tracking-widest border-none focus:ring-0 w-full" placeholder="NAME_KEY" />
              <div className="mt-6 w-full space-y-2">
                <StatBox label="SC Balance" value={sc} color="text-emerald-400" icon={<Star size={12}/>} />
                <StatBox label="Total Hours" value={totalHours} color="text-cyan-400" icon={<Clock size={12}/>} />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10">
            <h3 className="text-[10px] font-black text-yellow-500 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
              <ShoppingCart size={14}/> Rewards Emporium
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <RewardItem name="Coffee Break (15m)" cost={50} icon={<Coffee/>} onClick={() => buyReward(50, "Coffee Break")} />
              <RewardItem name="Gaming Unlock (1hr)" cost={250} icon={<FastForward/>} onClick={() => buyReward(250, "Gaming Unlock")} />
              <RewardItem name="Cheat Meal Pass" cost={500} icon={<Gift/>} onClick={() => buyReward(500, "Cheat Meal")} />
              <RewardItem name="Early Night Exit" cost={150} icon={<Moon/>} onClick={() => buyReward(150, "Early Night")} />
              <RewardItem name="Social Media (30m)" cost={100} icon={<Smartphone/>} onClick={() => buyReward(100, "Social Media")} />
            </div>
          </div>
        </aside>

        {/* MAIN: TASK TERMINAL 📋 */}
        <main className="lg:col-span-6 bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h1 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
              <Zap className="text-yellow-400" /> A/L Master Menu
            </h1>
          </div>
          
          <div className="space-y-6 max-h-[650px] overflow-y-auto pr-4 custom-scrollbar">
            <TaskSection title="1. Core Grind [cite: 2]">
              <TaskRow icon={<Clock className="animate-spin-slow"/>} name="Deep Work Hour" sc={30} onClick={() => addSC(30)} />
              <TaskRow icon={<RotateCcw className="animate-reverse-spin"/>} name="Pomodoro Streak" sc={50} onClick={() => addSC(50)} />
              <TaskRow icon={<GraduationCap/>} name="Syllabus Progress" sc={40} onClick={() => addSC(40)} />
              <TaskRow icon={<Edit3/>} name="Ultra-Summary" sc={35} onClick={() => addSC(35)} />
              <TaskRow icon={<Layout/>} name="The Clean Slate" sc={15} onClick={() => addSC(15)} />
              <TaskRow icon={<Calendar/>} name="Day Review & Goal Setting" sc={20} onClick={() => addSC(20)} />
            </TaskSection>

            <TaskSection title="2. Subject Power Plays ">
              <TaskRow icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={() => addSC(30)} />
              <TaskRow icon={<Calculator className="animate-bounce"/>} name="Maths: Part B Complex Q" sc={25} onClick={() => addSC(25)} />
              <TaskRow icon={<Wand2/>} name="Physics: The Architect" sc={30} onClick={() => addSC(30)} />
              <TaskRow icon={<Palette/>} name="Physics: The Visualizer" sc={15} onClick={() => addSC(15)} />
              <TaskRow icon={<Beaker/>} name="Chemistry: The Alchemist" sc={30} onClick={() => addSC(30)} />
              <TaskRow icon={<Microscope/>} name="Chemistry: Color Guru" sc={25} onClick={() => addSC(25)} />
              <TaskRow icon={<FlaskConical/>} name="Redox: The Balancer" sc={20} onClick={() => addSC(20)} />
              <TaskRow icon={<Calculator/>} name="Stoichiometry Master" sc={20} onClick={() => addSC(20)} />
            </TaskSection>

            <TaskSection title="3. Bonus Multipliers ">
              <TaskRow icon={<Sunrise/>} name="The Early Bird (Pre-7AM)" sc={40} onClick={() => addSC(40)} />
              <TaskRow icon={<User/>} name="The Teacher (Feynman)" sc={50} onClick={() => addSC(50)} />
              <TaskRow icon={<Dumbbell/>} name="Physical Buff (20m)" sc={30} onClick={() => addSC(30)} />
              <TaskRow icon={<Smartphone/>} name="No-Phone Multiplier (4hr)" sc={20} onClick={() => addSC(20)} />
            </TaskSection>

            <TaskSection title="4. Heroic Feats ">
              <TaskRow icon={<Sword className="animate-bounce"/>} name="The Full Mock (3hr)" sc={150} onClick={() => addSC(150)} gold />
              <TaskRow icon={<Target/>} name="The Weakness Slayer" sc={80} onClick={() => addSC(80)} />
              <TaskRow icon={<AlertTriangle/>} name="The Error Log (10x)" sc={60} onClick={() => addSC(60)} />
              <TaskRow icon={<Trophy/>} name="Perfect Week Bonus" sc={250} onClick={() => addSC(250)} gold />
            </TaskSection>
          </div>
        </main>

        {/* RIGHT: CONTROL PANEL ⏱️ */}
        <aside className="lg:col-span-3 space-y-4 text-center">
          <div className="bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => setTimerMode('pomodoro')} className={`text-[9px] font-black uppercase ${timerMode==='pomodoro' ? 'text-blue-400 border-b border-blue-400':'text-slate-500'}`}>Timer</button>
              <button onClick={() => setTimerMode('stopwatch')} className={`text-[9px] font-black uppercase ${timerMode==='stopwatch' ? 'text-blue-400 border-b border-blue-400':'text-slate-500'}`}>Stopwatch</button>
            </div>
            <p className="text-5xl font-mono font-black mb-6 text-white tracking-tighter">{formatTime(timerMode==='pomodoro' ? timeLeft : stopwatchTime)}</p>
            <button onClick={() => setIsActive(!isActive)} className={`w-full py-4 rounded-xl font-black uppercase text-xs transition-all ${isActive ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-blue-600 shadow-lg'}`}>
              {isActive ? "Emergency Stop" : "Initiate Focus"}
            </button>
          </div>
          <button onClick={() => setIsGhostMode(true)} className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-purple-600/10 border border-purple-500/30 text-purple-400 hover:bg-purple-600/20 transition-all text-xs font-black uppercase tracking-widest">
            <Ghost size={16}/> Stealth Protocol
          </button>
        </aside>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, icon }: any) {
  return (
    <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between items-center group transition-all">
      <div className="flex items-center gap-2">
        {icon} <span className="text-[9px] text-slate-500 font-bold uppercase">{label}</span>
      </div>
      <span className={`text-xl font-mono font-black ${color}`}>{value}</span>
    </div>
  );
}

function RewardItem({ name, cost, icon, onClick }: any) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all group">
      <div className="flex items-center gap-3">
        <div className="text-yellow-500 group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] font-bold text-slate-300 uppercase">{name}</span>
      </div>
      <span className="text-[10px] font-black text-emerald-400">-{cost} SC</span>
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