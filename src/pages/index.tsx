import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Target, CheckCircle, RefreshCw, User, Star, ShoppingCart, Gamepad2, Pizza, Coffee, Play } from 'lucide-react';

export default function StudyCreditsOS() {
  const [sc, setSc] = useState(0);
  const [name, setName] = useState("");
  const [badge, setBadge] = useState("");

  // Level Logic: 500 SC per Level 🆙
  const level = Math.floor(sc / 500) + 1;
  const progressToNextLevel = ((sc % 500) / 500) * 100;

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (!savedName) {
      const inputName = prompt("Welcome, Hero! Enter your name to begin:");
      localStorage.setItem('user_name', inputName || "Study Hero");
      setName(inputName || "Study Hero");
    } else {
      setName(savedName);
    }

    const savedSc = localStorage.getItem('total_sc');
    if (savedSc) setSc(parseInt(savedSc));
    
    const badges = ["🔥 Consistency King", "🧠 Theory Titan", "🧪 Alchemist", "📐 Proof Master", "⚡ Velocity", "🏆 Mock Hero", "🌟 Star Scholar"];
    setBadge(badges[new Date().getDay()]);
  }, []);

  // Function to EARN SC 📈
  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem('total_sc', total.toString());
  };

  // Function to SPEND SC 🛒
  const spendSC = (cost: number, rewardName: string) => {
    if (sc >= cost) {
      const total = sc - cost;
      setSc(total);
      localStorage.setItem('total_sc', total.toString());
      alert(`Enjoy your ${rewardName}! 🎁 -${cost} SC deducted.`);
    } else {
      alert(`Not enough credits! You need ${cost - sc} more SC. Keep grinding! 💪`);
    }
  };

  const resetGame = () => {
    if (confirm("Reset everything?")) {
      setSc(0);
      localStorage.setItem('total_sc', "0");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white p-4 font-sans">
      {/* 🌌 ANIMATED BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-bounce" style={{animationDuration: '10s'}}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* HEADER AREA */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-2xl">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/50 text-cyan-400">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter">Hero: {name}</h1>
              <p className="text-xs text-cyan-400 font-bold uppercase">{badge}</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="flex items-baseline gap-2 justify-center md:justify-end">
              <span className="text-5xl font-mono font-bold text-emerald-400">{sc}</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter text-left">Total<br/>Credits</span>
            </div>
            <div className="mt-2 w-48 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mx-auto md:ml-auto md:mr-0">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000" style={{width: `${progressToNextLevel}%`}}></div>
            </div>
            <p className="text-[10px] mt-1 text-slate-400 font-bold uppercase">Level {level} Master</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* EARN COLUMN 1 */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-blue-400 font-bold uppercase text-xs tracking-widest"><Flame size={16}/> Core Grind</h2>
            <TaskBtn name="Deep Work Hour" sc={30} onClick={() => addSC(30)} />
            <TaskBtn name="Pomodoro Streak" sc={50} onClick={() => addSC(50)} />
            <TaskBtn name="The Teacher (Feynman)" sc={50} onClick={() => addSC(50)} />
          </div>

          {/* EARN COLUMN 2 */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-purple-400 font-bold uppercase text-xs tracking-widest"><Star size={16}/> Big Wins</h2>
            <TaskBtn name="The Full Mock" sc={150} onClick={() => addSC(150)} highlight />
            <TaskBtn name="Physics Architect" sc={30} onClick={() => addSC(30)} />
            <TaskBtn name="Chemistry Alchemist" sc={30} onClick={() => addSC(30)} />
          </div>

          {/* 🛒 THE STORE COLUMN */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-yellow-500 font-bold uppercase text-xs tracking-widest"><ShoppingCart size={16}/> Reward Store</h2>
            <StoreBtn name="1 Hour Gaming" sc={150} icon={<Gamepad2 size={16}/>} onClick={() => spendSC(150, "Gaming Hour")} />
            <StoreBtn name="Cheat Meal" sc={300} icon={<Pizza size={16}/>} onClick={() => spendSC(300, "Cheat Meal")} />
            <StoreBtn name="20m YouTube" sc={50} icon={<Play size={16}/>} onClick={() => spendSC(50, "YouTube Break")} />
            <StoreBtn name="Coffee / Snack" sc={40} icon={<Coffee size={16}/>} onClick={() => spendSC(40, "Snack")} />
          </div>
        </div>

        <footer className="mt-12 flex justify-center">
          <button onClick={resetGame} className="flex items-center gap-2 text-[10px] text-slate-600 hover:text-red-400 font-bold uppercase transition-colors">
            <RefreshCw size={12} /> Reset Study Progress
          </button>
        </footer>
      </div>
    </div>
  );
}

// 🏷️ REUSABLE EARN BUTTON
function TaskBtn({ name, sc, onClick, highlight = false }: any) {
  return (
    <div className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${highlight ? 'border-yellow-500/30 bg-yellow-500/5 shadow-lg shadow-yellow-900/10' : 'border-slate-800 bg-slate-900/40'}`}>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-200">{name}</span>
        <span className="text-emerald-400 text-[10px] font-black">+{sc} SC</span>
      </div>
      <button onClick={onClick} className="bg-slate-800 hover:bg-cyan-600 px-3 py-1.5 rounded-lg text-[9px] font-bold border border-slate-700 active:scale-90 transition-all">COMPLETE</button>
    </div>
  );
}

// 🏷️ REUSABLE STORE BUTTON
function StoreBtn({ name, sc, icon, onClick }: any) {
  return (
    <div className="flex justify-between items-center p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/50 transition-all">
      <div className="flex items-center gap-3">
        <div className="text-yellow-500">{icon}</div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-200">{name}</span>
          <span className="text-yellow-500 text-[10px] font-black">-{sc} SC</span>
        </div>
      </div>
      <button onClick={onClick} className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1.5 rounded-lg text-[9px] font-bold text-black active:scale-90 transition-all">BUY</button>
    </div>
  );
}