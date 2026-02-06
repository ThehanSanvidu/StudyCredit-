"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, User, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Plus, Minus, Brain, BookOpen, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Sunrise, Dumbbell, Smartphone, Ghost, GraduationCap, Microscope, Palette, Binary, 
  AlertTriangle, Calendar, ShoppingCart, Coffee, FastForward, Gift, Moon, Star, Volume2, Lock,
  SkipForward, SkipBack, Apple
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 🎵 10 TRACK LOFI LIBRARY
const LOFI_LIBRARY = [
  { id: 't1', name: 'Deep Space Focus', url: 'https://stream.zeno.fm/0r0xa792kwzuv', cost: 0, unlocked: true },
  { id: 't2', name: 'Rainy Night Desk', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cost: 100, unlocked: false },
  { id: 't3', name: 'Cyberpunk Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cost: 150, unlocked: false },
  { id: 't4', name: 'Zen Garden', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cost: 200, unlocked: false },
  { id: 't5', name: 'Midnight Library', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cost: 250, unlocked: false },
  { id: 't6', name: 'Autumn Leaves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cost: 300, unlocked: false },
  { id: 't7', name: 'Neon Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', cost: 350, unlocked: false },
  { id: 't8', name: 'Coffee Shop Vibes', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', cost: 400, unlocked: false },
  { id: 't9', name: 'Vintage Radio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', cost: 450, unlocked: false },
  { id: 't10', name: 'Nebula Drift', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', cost: 500, unlocked: false },
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
  const [unlockedTracks, setUnlockedTracks] = useState(['t1']);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setTotalHours(Number(localStorage.getItem(`hours_${savedName}`)) || 0);
    const savedTracks = JSON.parse(localStorage.getItem(`tracks_${savedName}`) || '["t1"]');
    setUnlockedTracks(savedTracks);
    audioRef.current = new Audio(LOFI_LIBRARY[0].url);
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current = new Audio(LOFI_LIBRARY[currentTrackIndex].url);
      audioRef.current.loop = true;
      if (wasPlaying) audioRef.current.play();
    }
  }, [currentTrackIndex]);

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

  const buyItem = (cost: number, itemName: string, isTrack = false, trackId = "") => {
    if (sc >= cost) {
      const total = sc - cost;
      setSc(total);
      localStorage.setItem(`sc_${name}`, total.toString());
      if (isTrack) {
        const newTracks = [...unlockedTracks, trackId];
        setUnlockedTracks(newTracks);
        localStorage.setItem(`tracks_${name}`, JSON.stringify(newTracks));
      }
      alert(`PURCHASED: ${itemName} ✅`);
    } else {
      alert("INSUFFICIENT SC ❌");
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isGhostMode ? 'bg-black' : 'bg-[#02040a]'} text-white p-6 font-sans relative overflow-hidden`}>
      
      {/* 🧊 LIQUID GLASS BACKGROUND */}
      <div className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ${isGhostMode ? 'opacity-5' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#02040a] to-[#1a0b2e]" />
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} animate={{ x: [0, 600, 0], y: [0, 400, 0] }} transition={{ duration: 25 + i * 5, repeat: Infinity }}
            className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
        ))}
      </div>

      {/* 👻 STEALTH GHOST MODE */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none"
          >
            <p className="text-[15rem] font-mono font-black text-white/90 drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] leading-none">
              {formatTime(timerMode === 'pomodoro' ? timeLeft : stopwatchTime)}
            </p>
            <button onClick={() => setIsGhostMode(false)} className="mt-20 pointer-events-auto text-[10px] font-black tracking-[1.5em] text-white/20 hover:text-white uppercase transition-all">
              [ TERMINATE_GHOST_PROTOCOL ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT: IDENTITY & LOFI CONTROL 👤🎵 */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 mx-auto"><User size={30} /></div>
            <input value={name} onChange={(e) => {setName(e.target.value); localStorage.setItem('study_sync_name', e.target.value);}}
              className="bg-transparent text-center text-lg font-black uppercase tracking-widest border-none focus:ring-0 w-full" placeholder="NAME_KEY" />
            <div className="mt-4 bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between">
              <span className="text-[10px] font-bold text-slate-500">SC BALANCE</span>
              <span className="text-xl font-mono font-black text-emerald-400">{sc}</span>
            </div>
          </div>

          {/* 🎧 LOFI PLAYER CONTROLLER */}
          <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10">
            <h3 className="text-[10px] font-black text-indigo-400 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]"><Volume2 size={14}/> Lofi Deck</h3>
            <div className="text-center mb-4">
              <span className="text-[10px] font-black uppercase text-white/60 block mb-2">{LOFI_LIBRARY[currentTrackIndex].name}</span>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setCurrentTrackIndex(prev => (prev === 0 ? LOFI_LIBRARY.length-1 : prev-1))} className="p-2 hover:text-indigo-400"><SkipBack size={20}/></button>
                <button onClick={() => { if(audioRef.current) isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} className="p-3 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/20">
                  {isPlaying ? <Pause size={24}/> : <Play size={24}/>}
                </button>
                <button onClick={() => setCurrentTrackIndex(prev => (prev === LOFI_LIBRARY.length-1 ? 0 : prev+1))} className="p-2 hover:text-indigo-400"><SkipForward size={20}/></button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar border-t border-white/5 pt-4">
              {LOFI_LIBRARY.map((track, idx) => {
                const isUnlocked = unlockedTracks.includes(track.id);
                return (
                  <div key={track.id} className={`flex items-center justify-between p-2 rounded-lg text-[10px] transition-all ${currentTrackIndex === idx ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-black/20 border border-transparent'}`}>
                    <span className="font-bold uppercase truncate w-24">{track.name}</span>
                    {isUnlocked ? (
                      <button onClick={() => setCurrentTrackIndex(idx)} className="text-indigo-400 font-black uppercase">SELECT</button>
                    ) : (
                      <button onClick={() => buyItem(track.cost, track.name, true, track.id)} className="flex items-center gap-1 text-yellow-500 font-black">
                        <Lock size={10}/> {track.cost}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* MAIN: FULL PDF TASK TERMINAL 📋 */}
        <main className="lg:col-span-6 bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <h1 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter border-b border-white/10 pb-4">
            <Zap className="text-yellow-400 animate-pulse" /> Mission Control (Full Menu)
          </h1>
          
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {/* 1. CORE GRIND [cite: 2] */}
            <TaskSection title="1. Core Grind">
              <TaskRow icon={<Clock className="animate-spin-slow"/>} name="Deep Work Hour (60 min)" sc={30} onClick={() => addSC(30)} />
              <TaskRow icon={<RotateCcw className="animate-reverse-spin"/>} name="Pomodoro Streak (4 sessions)" sc={50} onClick={() => addSC(50)} />
              <TaskRow icon={<GraduationCap/>} name="Syllabus Progress (1 sub-topic)" sc={40} onClick={() => addSC(40)} />
              <TaskRow icon={<Edit3/>} name="Ultra-Summary (1-page recall)" sc={35} onClick={() => addSC(35)} />
              <TaskRow icon={<Layout/>} name="The Clean Slate (Tidy space)" sc={15} onClick={() => addSC(15)} />
              <TaskRow icon={<Calendar/>} name="End-of-Day Review & Goal Setting" sc={20} onClick={() => addSC(20)} />
            </TaskSection>

            {/* 2. SUBJECT SPECIFIC  */}
            <TaskSection title="2. Subject Power Plays">
              <TaskRow icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={() => addSC(30)} />
              <TaskRow icon={<Calculator className="animate-bounce"/>} name="Maths: Part B Complex Q" sc={25} onClick={() => addSC(25)} />
              <TaskRow icon={<Wand2/>} name="Physics: The Architect (Derivation)" sc={30} onClick={() => addSC(30)} />
              <TaskRow icon={<Palette/>} name="Physics: The Visualizer (Diagram)" sc={15} onClick={() => addSC(15)} />
              <TaskRow icon={<Beaker/>} name="Chemistry: The Alchemist (Synthesis)" sc={30} onClick={() => addSC(30)} />
              <TaskRow icon={<Microscope/>} name="Chemistry: Color Guru (Tests)" sc={25} onClick={() => addSC(25)} />
              <TaskRow icon={<FlaskConical/>} name="The Balancer (Redox)" sc={20} onClick={() => addSC(20)} />
              <TaskRow icon={<Calculator/>} name="Stoichiometry Master" sc={20} onClick={() => addSC(20)} />
            </TaskSection>

            {/* 3. BONUS MULTIPLIERS [cite: 3] */}
            <TaskSection title="3. Bonus Multipliers">
              <TaskRow icon={<Sunrise/>} name="The Early Bird (Pre-7 AM)" sc={40} onClick={() => addSC(40)} />
              <TaskRow icon={<User/>} name="The Teacher (Feynman Tech)" sc={50} onClick={() => addSC(50)} />
              <TaskRow icon={<Dumbbell/>} name="Physical Buff (20m Exercise)" sc={30} onClick={() => addSC(30)} />
              <TaskRow icon={<Smartphone/>} name="No-Phone Multiplier (4hr+)" sc={20} onClick={() => addSC(20)} />
              <TaskRow icon={<Apple/>} name="Nutrition Boost" sc={10} onClick={() => addSC(10)} />
            </TaskSection>

            {/* 4. HEROIC FEATS [cite: 3] */}
            <TaskSection title="4. Heroic Feats">
              <TaskRow icon={<Sword className="animate-bounce"/>} name="The Full Mock (3hr)" sc={150} onClick={() => addSC(150)} gold />
              <TaskRow icon={<Target/>} name="The Weakness Slayer (2hr)" sc={80} onClick={() => addSC(80)} />
              <TaskRow icon={<AlertTriangle/>} name="The Error Log (10x entries)" sc={60} onClick={() => addSC(60)} />
              <TaskRow icon={<Trophy/>} name="Perfect Week Bonus" sc={250} onClick={() => addSC(250)} gold />
              <TaskRow icon={<FastForward/>} name="Inter-Subject Linkage" sc={70} onClick={() => addSC(70)} />
            </TaskSection>
          </div>
        </main>

        {/* RIGHT: REWARDS 🛍️ */}
        <aside className="lg:col-span-3">
          <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
            <h3 className="text-[10px] font-black text-yellow-500 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]"><ShoppingCart size={14}/> Reward shop</h3>
            <div className="space-y-2">
              <RewardItem name="Coffee Break" cost={50} icon={<Coffee/>} onClick={() => buyItem(50, "Coffee Break")} />
              <RewardItem name="Gaming (1hr)" cost={250} icon={<FastForward/>} onClick={() => buyItem(250, "Gaming Unlock")} />
              <RewardItem name="Cheat Meal" cost={500} icon={<Gift/>} onClick={() => buyItem(500, "Cheat Meal")} />
              <RewardItem name="Early Exit" cost={150} icon={<Moon/>} onClick={() => buyItem(150, "Early Exit")} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// UI HELPER COMPONENTS
function TaskSection({ title, children }: any) {
  return (
    <div>
      <h3 className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.3em] mb-3 ml-2">{title}</h3>
      <div className="space-y-2">{children}</div>
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

function TaskRow({ name, sc, onClick, icon, gold = false }: any) {
  return (
    <motion.div whileHover={{ x: 5 }} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${gold ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/5'}`}>
      <div className="flex items-center gap-3 text-left">
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