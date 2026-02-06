import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Target, CheckCircle } from 'lucide-react';

export default function StudyCredits() {
  const [sc, setSc] = useState(0);
  const [badge, setBadge] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('total_sc');
    if (saved) setSc(parseInt(saved));
    
    const badges = ["🔥 Consistency King", "🧠 Theory Titan", "🧪 Alchemist", "📐 Proof Master", "⚡ Velocity", "🏆 Mock Hero", "🌟 Star Scholar"];
    setBadge(badges[new Date().getDay()]);
  }, []);

  // Notice the ": number" below - that's the fix! 🛠️
  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem('total_sc', total.toString());
    alert(`+${amount} SC Added! 💎`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <div>
            <h1 className="text-3xl font-black text-cyan-400 uppercase tracking-tighter">Study Credits OS</h1>
            <p className="text-sm text-slate-400 font-bold mt-1">Badge: <span className="text-yellow-400">{badge}</span></p>
          </div>
          <div className="text-right">
            <p className="text-6xl font-mono font-bold text-emerald-400">{sc}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total SC Earned</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-blue-400 font-bold uppercase text-sm"><Flame size={18}/> Core Grind</h2>
            <TaskBtn name="Deep Work Hour" points={30} onAdd={() => addSC(30)} />
            <TaskBtn name="Pomodoro Streak" points={50} onAdd={() => addSC(50)} />
            <TaskBtn name="Syllabus Progress" points={40} onAdd={() => addSC(40)} />
            <TaskBtn name="Ultra-Summary" points={35} onAdd={() => addSC(35)} />
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-purple-400 font-bold uppercase text-sm"><Target size={18}/> Heroic Feats</h2>
            <TaskBtn name="The Full Mock (3hrs)" points={150} onAdd={() => addSC(150)} highlight />
            <TaskBtn name="Physics: The Architect" points={30} onAdd={() => addSC(30)} />
            <TaskBtn name="Chem: The Alchemist" points={30} onAdd={() => addSC(30)} />
            <TaskBtn name="Perfect Week Bonus" points={250} onAdd={() => addSC(250)} highlight />
          </section>
        </div>
      </div>
    </div>
  );
}

// Added ": any" here to keep the safety checks happy! ✅
function TaskBtn({ name, points, onAdd, highlight = false }: any) {
  return (
    <div className={`flex justify-between items-center p-4 rounded-xl border transition-all active:scale-95 ${highlight ? 'border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-slate-800 bg-slate-900/40'}`}>
      <div>
        <p className="font-bold text-sm text-slate-200">{name}</p>
        <p className="text-emerald-400 text-xs font-black">+{points} SC</p>
      </div>
      <button 
        onClick={onAdd} 
        className="bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-black px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
      >
        COMPLETE <CheckCircle size={12} />
      </button>
    </div>
  );
}