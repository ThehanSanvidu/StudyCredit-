"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, CheckCircle, Zap, Clock, Wand2, Sword, Music, Pause, Play,
  Brain, Calculator, RotateCcw, Layout, Edit3, FlaskConical, Beaker, 
  Ghost, GraduationCap, Microscope, Palette, Binary, Calendar, 
  ShoppingCart, Coffee, FastForward, Star, SkipForward, SkipBack, Apple, 
  BarChart3, ClipboardList, Home, Radio, Disc, Volume2, Timer, Settings, Dumbbell, Smartphone, AlertCircle, Link,
  BookOpen, TrendingUp, Plus, Gift, Sparkles, Download, FileText, Smile, Frown, Meh,
  Award, PieChart, Activity, Flag, Rocket, CheckSquare, Square, Target as TargetIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- CONSTANTS ---
const EXAM_DATE = new Date('2026-08-15T09:00:00'); // 2026 A/L Exam Date

const SUBJECTS = [
  { id: 'phy', name: 'Physics', color: '#a855f7', emoji: '⚛️' },
  { id: 'chem', name: 'Chemistry', color: '#10b981', emoji: '🧪' },
  { id: 'applied', name: 'Applied Maths', color: '#3b82f6', emoji: '📊' },
  { id: 'pure', name: 'Pure Maths', color: '#f59e0b', emoji: '📐' },
  { id: 'english', name: 'General English', color: '#ec4899', emoji: '📚' },
  { id: 'gk', name: 'General Knowledge', color: '#8b5cf6', emoji: '🌍' }
];

// Hard-coded GCE A/L Syllabus
const SYLLABUS = {
  phy: {
    name: 'Physics',
    chapters: [
      { id: 'p1', name: 'Measurements', topics: ['SI Units', 'Significant Figures', 'Dimensional Analysis', 'Error Analysis'] },
      { id: 'p2', name: 'Mechanics', topics: ['Kinematics', 'Dynamics', 'Work & Energy', 'Momentum', 'Circular Motion'] },
      { id: 'p3', name: 'Properties of Matter', topics: ['Elasticity', 'Fluid Mechanics', 'Surface Tension', 'Viscosity'] },
      { id: 'p4', name: 'Oscillations & Waves', topics: ['SHM', 'Wave Motion', 'Sound Waves', 'Doppler Effect'] },
      { id: 'p5', name: 'Heat & Thermodynamics', topics: ['Temperature', 'Heat Transfer', 'Laws of Thermodynamics', 'Kinetic Theory'] },
      { id: 'p6', name: 'Electrostatics', topics: ['Electric Field', 'Gauss Law', 'Capacitors', 'Dielectrics'] },
      { id: 'p7', name: 'Current Electricity', topics: ['Ohms Law', 'Kirchhoff Laws', 'RC Circuits', 'Meters'] },
      { id: 'p8', name: 'Magnetism', topics: ['Magnetic Field', 'Force on Moving Charges', 'Electromagnetic Induction', 'AC Circuits'] },
      { id: 'p9', name: 'Optics', topics: ['Reflection', 'Refraction', 'Lenses', 'Interference', 'Diffraction'] },
      { id: 'p10', name: 'Modern Physics', topics: ['Photoelectric Effect', 'Atomic Structure', 'Nuclear Physics', 'Semiconductors'] }
    ]
  },
  chem: {
    name: 'Chemistry',
    chapters: [
      { id: 'c1', name: 'Atomic Structure', topics: ['Electron Configuration', 'Quantum Numbers', 'Periodic Trends', 'Ionization Energy'] },
      { id: 'c2', name: 'Chemical Bonding', topics: ['Ionic Bonding', 'Covalent Bonding', 'VSEPR Theory', 'Hybridization'] },
      { id: 'c3', name: 'States of Matter', topics: ['Gas Laws', 'Liquids', 'Solids', 'Phase Diagrams'] },
      { id: 'c4', name: 'Chemical Equilibrium', topics: ['Law of Mass Action', 'Le Chatelier', 'Kc & Kp', 'Acids & Bases'] },
      { id: 'c5', name: 'Thermochemistry', topics: ['Enthalpy', 'Hess Law', 'Entropy', 'Gibbs Energy'] },
      { id: 'c6', name: 'Electrochemistry', topics: ['Redox Reactions', 'Galvanic Cells', 'Electrolysis', 'Nernst Equation'] },
      { id: 'c7', name: 'Chemical Kinetics', topics: ['Rate Laws', 'Order of Reaction', 'Activation Energy', 'Catalysis'] },
      { id: 'c8', name: 'Organic Chemistry', topics: ['Nomenclature', 'Isomerism', 'Reaction Mechanisms', 'Functional Groups'] },
      { id: 'c9', name: 'Hydrocarbons', topics: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatic Compounds'] },
      { id: 'c10', name: 'Practical Chemistry', topics: ['Qualitative Analysis', 'Volumetric Analysis', 'Colorimetry', 'pH Measurement'] }
    ]
  },
  pure: {
    name: 'Pure Maths',
    chapters: [
      { id: 'm1', name: 'Algebra', topics: ['Polynomials', 'Equations', 'Inequalities', 'Sequences & Series'] },
      { id: 'm2', name: 'Functions', topics: ['Domain & Range', 'Inverse Functions', 'Composite Functions', 'Graphs'] },
      { id: 'm3', name: 'Trigonometry', topics: ['Identities', 'Equations', 'Compound Angles', 'R-Formula'] },
      { id: 'm4', name: 'Coordinate Geometry', topics: ['Lines', 'Circles', 'Parabola', 'Ellipse', 'Hyperbola'] },
      { id: 'm5', name: 'Calculus - Differentiation', topics: ['Limits', 'Derivatives', 'Chain Rule', 'Implicit Differentiation'] },
      { id: 'm6', name: 'Calculus - Integration', topics: ['Indefinite Integrals', 'Definite Integrals', 'Methods', 'Applications'] },
      { id: 'm7', name: 'Vectors', topics: ['Vector Operations', 'Scalar Product', 'Vector Product', 'Applications'] },
      { id: 'm8', name: 'Complex Numbers', topics: ['Operations', 'Argand Diagram', 'De Moivre', 'Roots'] },
      { id: 'm9', name: 'Matrices', topics: ['Operations', 'Determinants', 'Inverse', 'Linear Systems'] },
      { id: 'm10', name: 'Differential Equations', topics: ['First Order', 'Second Order', 'Applications', 'Methods'] }
    ]
  },
  applied: {
    name: 'Applied Maths',
    chapters: [
      { id: 'a1', name: 'Statistics', topics: ['Data Representation', 'Mean & Variance', 'Correlation', 'Regression'] },
      { id: 'a2', name: 'Probability', topics: ['Basic Concepts', 'Conditional Probability', 'Bayes Theorem', 'Distributions'] },
      { id: 'a3', name: 'Mechanics - Kinematics', topics: ['Motion in 1D', 'Motion in 2D', 'Projectiles', 'Relative Motion'] },
      { id: 'a4', name: 'Mechanics - Dynamics', topics: ['Newton Laws', 'Friction', 'Connected Particles', 'Inclined Planes'] },
      { id: 'a5', name: 'Work & Energy', topics: ['Work Done', 'Kinetic Energy', 'Potential Energy', 'Power'] },
      { id: 'a6', name: 'Momentum', topics: ['Impulse', 'Conservation', 'Collisions', 'Explosions'] },
      { id: 'a7', name: 'Circular Motion', topics: ['Angular Velocity', 'Centripetal Force', 'Banking', 'Vertical Circles'] },
      { id: 'a8', name: 'Statics', topics: ['Forces in Equilibrium', 'Moments', 'Couples', 'Centre of Gravity'] }
    ]
  }
};

const THEMES = [
  { id: 'dark', name: 'Midnight Scholar', cost: 0, colors: { bg: '#01040a', accent: '#3b82f6' } },
  { id: 'purple', name: 'Purple Haze', cost: 50, colors: { bg: '#1a0a2e', accent: '#a855f7' } },
  { id: 'emerald', name: 'Emerald Matrix', cost: 50, colors: { bg: '#0a1f1a', accent: '#10b981' } },
  { id: 'sunset', name: 'Sunset Vibes', cost: 100, colors: { bg: '#2a1a0a', accent: '#f59e0b' } },
  { id: 'ocean', name: 'Deep Ocean', cost: 100, colors: { bg: '#0a1a2a', accent: '#06b6d4' } }
];

const MOTIVATIONAL_QUOTES = [
  "Every expert was once a beginner. Keep going! 🚀",
  "Success is the sum of small efforts repeated day in and day out. 💪",
  "Your only limit is you. Break through! ⚡",
  "The harder you work, the luckier you get. 🍀",
  "Believe you can and you're halfway there. 🌟",
  "Dream big. Work hard. Stay focused. 🎯",
  "Champions keep playing until they get it right. 🏆",
  "The future belongs to those who believe in their dreams. ✨"
];

const LOFI_LIBRARY = [
  { id: 't1', name: 'Deep Space Focus', emoji: '🌌', url: 'https://stream.zeno.fm/0r0xa792kwzuv', cost: 0, unlocked: true },
  { id: 't2', name: 'Rainy Night Desk', emoji: '🌧️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cost: 100, unlocked: false },
  { id: 't3', name: 'Cyberpunk Chill', emoji: '🌃', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cost: 150, unlocked: false },
  { id: 't4', name: 'Zen Garden', emoji: '🎋', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cost: 200, unlocked: false },
  { id: 't5', name: 'Midnight Library', emoji: '📚', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cost: 250, unlocked: false },
  { id: 't6', name: 'Autumn Leaves', emoji: '🍂', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cost: 300, unlocked: false },
  { id: 't7', name: 'Neon Rain', emoji: '🎆', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', cost: 350, unlocked: false },
  { id: 't8', name: 'Coffee Shop Vibes', emoji: '☕', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', cost: 400, unlocked: false },
  { id: 't10', name: 'Nebula Drift', emoji: '🪐', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', cost: 500, unlocked: false },
];

// Bubble Background Component
function LiquidGlassBubbles() {
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            background: `radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.05))`,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          }}
          animate={{
            y: [1000, -200],
            x: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Countdown Component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = EXAM_DATE.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/20 p-6 rounded-[2rem]">
      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4 text-center">⏰ 2026 A/L EXAM COUNTDOWN</p>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Mins', value: timeLeft.minutes },
          { label: 'Secs', value: timeLeft.seconds }
        ].map((item, i) => (
          <div key={i} className="text-center">
            <motion.p 
              key={item.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl md:text-4xl font-mono font-black text-red-400"
            >
              {item.value}
            </motion.p>
            <p className="text-[8px] font-black text-slate-500 uppercase mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScholarOS() {
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'store' | 'audio' | 'focus' | 'subjects' | 'syllabus' | 'advanced' | 'milestones' | 'mood'>('home');
  const [sc, setSc] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0); 
  const [name, setName] = useState("Scholar");
  const [isGhostMode, setIsGhostMode] = useState(false);
  
  // Syllabus State
  const [completedTopics, setCompletedTopics] = useState<Record<string, string[]>>({});
  
  // Milestones State
  const [milestones, setMilestones] = useState<Array<{id: string, goal: string, target: number, deadline: string, completed: boolean}>>([]);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ goal: '', target: '', deadline: '' });
  
  // Mood Tracker State
  const [moodHistory, setMoodHistory] = useState<Array<{date: string, mood: number, subject: string, credits: number}>>([]);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [currentMood, setCurrentMood] = useState({ mood: 2, subject: '' });
  
  // Past Paper Tracker
  const [pastPapers, setPastPapers] = useState<Array<{id: string, subject: string, year: string, score: number, date: string, timeSpent: number}>>([]);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [newPaper, setNewPaper] = useState({ subject: '', year: '', score: '', timeSpent: '' });
  
  // Theme State
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(['dark']);
  
  // Motivational Unlocks
  const [lastUnlockAt, setLastUnlockAt] = useState(0);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  
  // Time Management Simulator
  const [simMode, setSimMode] = useState(false);
  const [simTime, setSimTime] = useState(10800); // 3 hours
  const [simActive, setSimActive] = useState(false);
  
  // Daily Bonus State
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState("");
  const [showBonusModal, setShowBonusModal] = useState(false);
  
  // Exam Marks State
  const [examMarks, setExamMarks] = useState<Record<string, number[]>>({});
  const [showAddMarkModal, setShowAddMarkModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newMark, setNewMark] = useState("");
  
  // Stats
  const [streak, setStreak] = useState(0);
  const [unlockedTracks, setUnlockedTracks] = useState<string[]>(['t1']);
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  // Timer/Stopwatch State
  const [focusMode, setFocusMode] = useState<'timer' | 'stopwatch'>('timer');
  const [timeLeft, setTimeLeft] = useState(1500);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  // Audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('study_sync_name') || "Scholar";
    setName(savedName);
    setSc(Number(localStorage.getItem(`sc_${savedName}`)) || 0);
    setTotalSeconds(Number(localStorage.getItem(`total_secs_${savedName}`)) || 0);
    setUnlockedTracks(JSON.parse(localStorage.getItem(`tracks_${savedName}`) || '["t1"]'));
    setUnlockedRewards(JSON.parse(localStorage.getItem(`rewards_${savedName}`) || '[]'));
    setExamMarks(JSON.parse(localStorage.getItem(`exam_marks_${savedName}`) || '{}'));
    setDailyStreak(Number(localStorage.getItem(`daily_streak_${savedName}`)) || 0);
    setLastClaimDate(localStorage.getItem(`last_claim_${savedName}`) || "");
    setCompletedTopics(JSON.parse(localStorage.getItem(`completed_topics_${savedName}`) || '{}'));
    setMilestones(JSON.parse(localStorage.getItem(`milestones_${savedName}`) || '[]'));
    setMoodHistory(JSON.parse(localStorage.getItem(`mood_history_${savedName}`) || '[]'));
    setPastPapers(JSON.parse(localStorage.getItem(`past_papers_${savedName}`) || '[]'));
    setUnlockedThemes(JSON.parse(localStorage.getItem(`themes_${savedName}`) || '["dark"]'));
    setCurrentTheme(localStorage.getItem(`current_theme_${savedName}`) || 'dark');
    setLastUnlockAt(Number(localStorage.getItem(`last_unlock_${savedName}`)) || 0);
    setUnlockedBadges(JSON.parse(localStorage.getItem(`badges_${savedName}`) || '[]'));

    // Auto-save every 30 seconds
    const autoSave = setInterval(() => {
      const backup = {
        sc, totalSeconds, examMarks, completedTopics, milestones, moodHistory, pastPapers,
        dailyStreak, unlockedTracks, unlockedRewards, unlockedBadges
      };
      localStorage.setItem(`backup_${savedName}_${Date.now()}`, JSON.stringify(backup));
    }, 30000);

    audioRef.current = new Audio();
    audioRef.current.src = LOFI_LIBRARY[0].url;
    audioRef.current.loop = true;
    
    return () => {
      clearInterval(autoSave);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Check for motivational unlocks
  useEffect(() => {
    const hundredMark = Math.floor(sc / 100);
    if (hundredMark > lastUnlockAt && sc > 0) {
      setLastUnlockAt(hundredMark);
      localStorage.setItem(`last_unlock_${name}`, hundredMark.toString());
      setCurrentQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
      setShowMotivation(true);
      confetti({ particleCount: 200, spread: 90 });
      
      // Award badge
      if (!unlockedBadges.includes(`badge_${hundredMark}`)) {
        const newBadges = [...unlockedBadges, `badge_${hundredMark}`];
        setUnlockedBadges(newBadges);
        localStorage.setItem(`badges_${name}`, JSON.stringify(newBadges));
      }
    }
  }, [sc]);

  // Simulator Timer
  useEffect(() => {
    let interval: any;
    if (simActive && simTime > 0) {
      interval = setInterval(() => {
        setSimTime(t => {
          if (t <= 1) {
            setSimActive(false);
            alert("Time's up! Did you finish? 📝");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simActive, simTime]);

  const toggleTopicCompletion = (subjectId: string, topicId: string) => {
    const key = `${subjectId}-${topicId}`;
    const current = completedTopics[subjectId] || [];
    const updated = current.includes(key) 
      ? current.filter(t => t !== key)
      : [...current, key];
    
    const newCompleted = { ...completedTopics, [subjectId]: updated };
    setCompletedTopics(newCompleted);
    localStorage.setItem(`completed_topics_${name}`, JSON.stringify(newCompleted));
    
    if (!current.includes(key)) {
      addSC(5);
    }
  };

  const getTopicProgress = (subjectId: string) => {
    const subject = SYLLABUS[subjectId as keyof typeof SYLLABUS];
    if (!subject) return 0;
    const totalTopics = subject.chapters.reduce((sum, ch) => sum + ch.topics.length, 0);
    const completed = (completedTopics[subjectId] || []).length;
    return totalTopics > 0 ? (completed / totalTopics) * 100 : 0;
  };

  const addMilestone = () => {
    if (!newMilestone.goal || !newMilestone.target || !newMilestone.deadline) {
      alert("Please fill all fields! 🎯");
      return;
    }
    
    const milestone = {
      id: Date.now().toString(),
      goal: newMilestone.goal,
      target: Number(newMilestone.target),
      deadline: newMilestone.deadline,
      completed: false
    };
    
    const updated = [...milestones, milestone];
    setMilestones(updated);
    localStorage.setItem(`milestones_${name}`, JSON.stringify(updated));
    setNewMilestone({ goal: '', target: '', deadline: '' });
    setShowMilestoneModal(false);
    confetti();
  };

  const addMoodEntry = () => {
    if (!currentMood.subject) {
      alert("Please select a subject! 😊");
      return;
    }
    
    const entry = {
      date: new Date().toISOString(),
      mood: currentMood.mood,
      subject: currentMood.subject,
      credits: sc
    };
    
    const updated = [...moodHistory, entry];
    setMoodHistory(updated);
    localStorage.setItem(`mood_history_${name}`, JSON.stringify(updated));
    setShowMoodModal(false);
    addSC(10);
  };

  const addPastPaper = () => {
    if (!newPaper.subject || !newPaper.year || !newPaper.score) {
      alert("Please fill required fields! 📝");
      return;
    }
    
    const paper = {
      id: Date.now().toString(),
      subject: newPaper.subject,
      year: newPaper.year,
      score: Number(newPaper.score),
      date: new Date().toLocaleDateString(),
      timeSpent: Number(newPaper.timeSpent) || 180
    };
    
    const updated = [...pastPapers, paper];
    setPastPapers(updated);
    localStorage.setItem(`past_papers_${name}`, JSON.stringify(updated));
    setNewPaper({ subject: '', year: '', score: '', timeSpent: '' });
    setShowPaperModal(false);
    
    // Bonus for completing on time
    if (paper.timeSpent <= 180) {
      addSC(20);
    }
  };

  const canClaimBonus = () => {
    const today = new Date().toDateString();
    return lastClaimDate !== today;
  };

  const claimDailyBonus = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = dailyStreak;
    if (lastClaimDate === yesterday) {
      newStreak = dailyStreak + 1;
    } else if (lastClaimDate !== today) {
      newStreak = 1;
    }
    
    const bonusAmount = 50 + (newStreak * 10);
    addSC(bonusAmount);
    
    setDailyStreak(newStreak);
    setLastClaimDate(today);
    localStorage.setItem(`daily_streak_${name}`, newStreak.toString());
    localStorage.setItem(`last_claim_${name}`, today);
    
    setShowBonusModal(false);
  };

  const addExamMark = () => {
    if (!selectedSubject || !newMark) return;
    
    const mark = parseFloat(newMark);
    if (isNaN(mark) || mark < 0 || mark > 100) {
      alert("Please enter a valid mark between 0 and 100! 📝");
      return;
    }
    
    const updated = {
      ...examMarks,
      [selectedSubject]: [...(examMarks[selectedSubject] || []), mark]
    };
    
    setExamMarks(updated);
    localStorage.setItem(`exam_marks_${name}`, JSON.stringify(updated));
    setShowAddMarkModal(false);
    setNewMark("");
    confetti();
  };

  const getSubjectAverage = (subjectId: string) => {
    const marks = examMarks[subjectId] || [];
    if (marks.length === 0) return 0;
    return marks.reduce((a, b) => a + b, 0) / marks.length;
  };

  const getOverallAverage = () => {
    const allMarks = Object.values(examMarks).flat();
    if (allMarks.length === 0) return 0;
    return allMarks.reduce((a, b) => a + b, 0) / allMarks.length;
  };

  const getPrediction = () => {
    const totalTopics = Object.keys(SYLLABUS).reduce((sum, key) => {
      const subject = SYLLABUS[key as keyof typeof SYLLABUS];
      return sum + subject.chapters.reduce((s, ch) => s + ch.topics.length, 0);
    }, 0);
    
    const completedCount = Object.values(completedTopics).flat().length;
    const percentComplete = (completedCount / totalTopics) * 100;
    
    const daysLeft = Math.floor((EXAM_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const topicsPerDay = completedCount / Math.max(1, 365 - daysLeft);
    const remainingTopics = totalTopics - completedCount;
    const daysNeeded = remainingTopics / Math.max(topicsPerDay, 0.1);
    
    return {
      percentComplete,
      onTrack: daysNeeded <= daysLeft,
      daysNeeded: Math.ceil(daysNeeded),
      daysLeft
    };
  };

  const getWeakAreas = () => {
    return Object.keys(examMarks).filter(k => {
      const avg = getSubjectAverage(k);
      return avg > 0 && avg < 70;
    });
  };

  const exportReport = () => {
    const pred = getPrediction();
    const report = {
      generatedAt: new Date().toLocaleString(),
      studentName: name,
      totalCredits: sc,
      totalStudyHours: (totalSeconds / 3600).toFixed(1),
      dailyStreak: dailyStreak,
      
      examPerformance: {
        overallAverage: getOverallAverage().toFixed(1),
        subjectAverages: SUBJECTS.map(s => ({
          subject: s.name,
          average: getSubjectAverage(s.id).toFixed(1)
        }))
      },
      
      syllabusProgress: Object.keys(SYLLABUS).map(key => ({
        subject: SYLLABUS[key as keyof typeof SYLLABUS].name,
        progressPercent: getTopicProgress(key).toFixed(1),
        completedTopics: (completedTopics[key] || []).length
      })),
      
      weakAreas: getWeakAreas().map(id => 
        SUBJECTS.find(s => s.id === id)?.name || id
      ),
      
      prediction: {
        syllabusComplete: pred.percentComplete.toFixed(1) + '%',
        onTrack: pred.onTrack ? 'YES ✅' : 'NO ⚠️',
        daysRemaining: pred.daysLeft,
        daysNeeded: pred.daysNeeded
      },
      
      pastPapers: pastPapers.length,
      moodEntries: moodHistory.length,
      milestonesCompleted: milestones.filter(m => m.completed).length,
      unlockedBadges: unlockedBadges.length
    };
    
    const dataStr = "SCHOLAR OS - PROGRESS REPORT\n" + 
                   "=" + "=".repeat(50) + "\n\n" +
                   JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ScholarOS_Report_${Date.now()}.txt`;
    link.click();
    
    alert("📥 Report downloaded! You can convert this to PDF using any online converter.");
  };

  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = LOFI_LIBRARY[currentTrackIdx].url;
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.log("Audio autoplay blocked:", e));
      }
    }
  }, [currentTrackIdx]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { 
      audioRef.current.pause(); 
      setIsPlaying(false); 
    } else { 
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => {
          console.log("Audio play blocked:", e);
          alert("Please click again to enable audio 🔊");
        });
    }
  };

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds(s => {
            const next = s + 1;
            localStorage.setItem(`total_secs_${name}`, next.toString());
            return next;
        });

        if (focusMode === 'timer') {
          if (timeLeft > 0) setTimeLeft(t => t - 1);
          else { 
            setIsActive(false); 
            addSC(50); 
            confetti(); 
          }
        } else {
          setStopwatchTime(s => s + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, focusMode, timeLeft, stopwatchTime]);

  const addSC = (amount: number) => {
    const total = sc + amount;
    setSc(total);
    localStorage.setItem(`sc_${name}`, total.toString());
    confetti();
  };

  const buyItem = (cost: number, id: string, type: 'track' | 'virtual' | 'real' | 'theme') => {
    if (sc >= cost) {
      setSc(s => {
        const newAmount = s - cost;
        localStorage.setItem(`sc_${name}`, newAmount.toString());
        return newAmount;
      });
      
      if (type === 'track') {
        const up = [...unlockedTracks, id];
        setUnlockedTracks(up);
        localStorage.setItem(`tracks_${name}`, JSON.stringify(up));
      } else if (type === 'theme') {
        const up = [...unlockedThemes, id];
        setUnlockedThemes(up);
        localStorage.setItem(`themes_${name}`, JSON.stringify(up));
      } else {
        const up = [...unlockedRewards, id];
        setUnlockedRewards(up);
        localStorage.setItem(`rewards_${name}`, JSON.stringify(up));
      }
      confetti();
    } else { 
      alert("Insufficient Credits! 💎"); 
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalHours = (totalSeconds / 3600).toFixed(1);

  return (
    <div className={`min-h-screen ${isGhostMode ? 'bg-black' : 'bg-[#01040a]'} text-white font-sans flex flex-col lg:flex-row overflow-hidden relative transition-colors duration-500`}>
      
      {/* Animated Background */}
      <LiquidGlassBubbles />
      
      {/* 🧊 RESPONSIVE NAV */}
      <nav className="w-full lg:w-24 xl:w-72 bg-white/5 border-b lg:border-b-0 lg:border-r border-white/10 p-4 lg:p-6 flex lg:flex-col items-center justify-between lg:justify-start gap-3 lg:gap-4 z-[100] backdrop-blur-2xl relative overflow-x-auto lg:overflow-visible">
        <div className="w-10 h-10 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 flex-shrink-0">
          <GraduationCap size={32} className="w-6 h-6 lg:w-8 lg:h-8"/>
        </div>

        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar">
          <NavBtn icon={<Home size={16}/>} active={activeTab==='home'} onClick={()=>setActiveTab('home')} label="Home"/>
          <NavBtn icon={<Timer size={16}/>} active={activeTab==='focus'} onClick={()=>setActiveTab('focus')} label="Focus"/>
          <NavBtn icon={<CheckSquare size={16}/>} active={activeTab==='syllabus'} onClick={()=>setActiveTab('syllabus')} label="Syllabus"/>
          <NavBtn icon={<BookOpen size={16}/>} active={activeTab==='subjects'} onClick={()=>setActiveTab('subjects')} label="Exams"/>
          <NavBtn icon={<TargetIcon size={16}/>} active={activeTab==='milestones'} onClick={()=>setActiveTab('milestones')} label="Goals"/>
          <NavBtn icon={<Smile size={16}/>} active={activeTab==='mood'} onClick={()=>setActiveTab('mood')} label="Mood"/>
          <NavBtn icon={<BarChart3 size={16}/>} active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')} label="Stats"/>
          <NavBtn icon={<Rocket size={16}/>} active={activeTab==='advanced'} onClick={()=>setActiveTab('advanced')} label="Advanced"/>
          <NavBtn icon={<Radio size={16}/>} active={activeTab==='audio'} onClick={()=>setActiveTab('audio')} label="Audio"/>
          <NavBtn icon={<ShoppingCart size={16}/>} active={activeTab==='store'} onClick={()=>setActiveTab('store')} label="Store"/>
        </div>
        
        {/* Daily Bonus Button */}
        {canClaimBonus() && (
          <motion.button 
            onClick={()=>setShowBonusModal(true)}
            className="hidden lg:flex mt-auto p-3 lg:p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl transition-all items-center gap-3 shadow-lg shadow-amber-500/30 flex-shrink-0"
            animate={{scale: [1, 1.05, 1]}}
            transition={{repeat: Infinity, duration: 2}}
          >
            <Gift size={18}/> <span className="hidden xl:block text-[9px] font-black tracking-widest">BONUS</span>
          </motion.button>
        )}
        
        <button onClick={()=>setIsGhostMode(true)} className="hidden lg:flex mt-2 p-3 lg:p-4 text-purple-400 hover:bg-purple-500/10 rounded-2xl transition-all items-center gap-3 flex-shrink-0">
          <Ghost size={18}/> <span className="hidden xl:block text-[9px] font-black tracking-widest">GHOST</span>
        </button>
      </nav>

      {/* 📺 MAIN WORKSPACE */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-12 pb-24 lg:pb-12 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* 🏠 TERMINAL */}
          {activeTab === 'home' && (
            <motion.div key="h" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-8">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter">Terminal ⚡</h2>
                  <p className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] mt-2">Scholar Rank: Elite</p>
                </div>
                <div className="flex gap-8 lg:gap-12 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                  <div className="text-right">
                    <p className="text-2xl lg:text-4xl font-mono font-black text-emerald-400">{sc} 💎</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Credits</p>
                  </div>
                  <div className="text-right border-l border-white/10 pl-8">
                    <p className="text-2xl lg:text-4xl font-mono font-black text-blue-400">{totalHours}h ⏳</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Study Time</p>
                  </div>
                  {dailyStreak > 0 && (
                    <div className="text-right border-l border-white/10 pl-8">
                      <p className="text-2xl lg:text-4xl font-mono font-black text-orange-400">{dailyStreak} 🔥</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Streak</p>
                    </div>
                  )}
                </div>
              </header>

              {/* Countdown */}
              <CountdownTimer />

              <div className="space-y-12 pb-12">
                <TaskGroup title="01. Core Grind">
                  <TaskItem icon={<Clock/>} name="Deep Work Hour" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<RotateCcw/>} name="Pomodoro Streak" sc={50} onClick={()=>addSC(50)}/>
                  <TaskItem icon={<GraduationCap/>} name="Syllabus Progress" sc={40} onClick={()=>addSC(40)}/>
                  <TaskItem icon={<Edit3/>} name="Ultra-Summary (1-Page)" sc={35} onClick={()=>addSC(35)}/>
                  <TaskItem icon={<Layout/>} name="The Clean Slate" sc={15} onClick={()=>addSC(15)}/>
                  <TaskItem icon={<Calendar/>} name="End-of-Day Review" sc={20} onClick={()=>addSC(20)}/>
                </TaskGroup>

                <TaskGroup title="02. Subject Power Plays">
                  <TaskItem icon={<Binary/>} name="Maths: Proof Mastery" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Calculator/>} name="Maths: The Long Game" sc={25} onClick={()=>addSC(25)}/>
                  <TaskItem icon={<Target/>} name="Maths: Pattern Recognition" sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<Microscope/>} name="Physics: Lab Report" sc={35} onClick={()=>addSC(35)}/>
                  <TaskItem icon={<Wand2/>} name="Physics: The Architect" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Palette/>} name="Physics: The Visualizer" sc={15} onClick={()=>addSC(15)}/>
                  <TaskItem icon={<Brain/>} name="Chem: The Alchemist" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Beaker/>} name="Chem: Color Guru" sc={25} onClick={()=>addSC(25)}/>
                  <TaskItem icon={<Zap/>} name="Chem: The Balancer" sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<FlaskConical/>} name="Chem: Stoichiometry Master" sc={20} onClick={()=>addSC(20)}/>
                </TaskGroup>

                <TaskGroup title="03. Bonus Multipliers">
                  <TaskItem icon={<Star/>} name="The Early Bird" sc={40} onClick={()=>addSC(40)}/>
                  <TaskItem icon={<GraduationCap/>} name="The Teacher (Feynman)" sc={50} onClick={()=>addSC(50)}/>
                  <TaskItem icon={<Dumbbell/>} name="Physical Buff" sc={30} onClick={()=>addSC(30)}/>
                  <TaskItem icon={<Smartphone/>} name="No-Phone Multiplier" sc={20} onClick={()=>addSC(20)}/>
                  <TaskItem icon={<Apple/>} name="Nutrition Boost" sc={10} onClick={()=>addSC(10)}/>
                </TaskGroup>

                <TaskGroup title="04. Heroic Feats">
                  <TaskItem icon={<Sword/>} name="The Full Mock (3HR)" sc={150} onClick={()=>addSC(150)} gold/>
                  <TaskItem icon={<Target/>} name="The Weakness Slayer" sc={80} onClick={()=>addSC(80)}/>
                  <TaskItem icon={<AlertCircle/>} name="The Error Log" sc={60} onClick={()=>addSC(60)}/>
                  <TaskItem icon={<Trophy/>} name="Perfect Week Bonus" sc={250} onClick={()=>addSC(250)} gold/>
                  <TaskItem icon={<Link/>} name="Inter-Subject Linkage" sc={70} onClick={()=>addSC(70)}/>
                </TaskGroup>
              </div>
            </motion.div>
          )}

          {/* 📚 SYLLABUS CHECKLIST */}
          {activeTab === 'syllabus' && (
            <motion.div key="syl" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter">Syllabus Tracker 📋</h2>
                  <p className="text-slate-400 text-sm mt-2">Check off topics as you master them (+5 SC each)</p>
                </div>
                <button onClick={exportReport} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black uppercase text-sm flex items-center gap-2">
                  <Download size={20}/> Export Report
                </button>
              </div>

              {/* Progress Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(SYLLABUS).map(key => {
                  const subject = SYLLABUS[key as keyof typeof SYLLABUS];
                  const progress = getTopicProgress(key);
                  return (
                    <div key={key} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                      <p className="text-2xl mb-2">{SUBJECTS.find(s => s.id === key)?.emoji}</p>
                      <p className="text-xs font-black uppercase tracking-tight mb-2">{subject.name}</p>
                      <p className="text-3xl font-black font-mono">{progress.toFixed(0)}%</p>
                    </div>
                  );
                })}
              </div>

              {/* Syllabus by Subject */}
              {Object.keys(SYLLABUS).map(subjectKey => {
                const subject = SYLLABUS[subjectKey as keyof typeof SYLLABUS];
                return (
                  <div key={subjectKey} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] space-y-6">
                    <h3 className="text-2xl font-black uppercase flex items-center gap-3">
                      <span>{SUBJECTS.find(s => s.id === subjectKey)?.emoji}</span>
                      {subject.name}
                    </h3>
                    
                    {subject.chapters.map(chapter => (
                      <div key={chapter.id} className="space-y-3">
                        <h4 className="text-sm font-black uppercase text-blue-400">{chapter.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {chapter.topics.map((topic, idx) => {
                            const topicId = `${chapter.id}-${idx}`;
                            const isCompleted = (completedTopics[subjectKey] || []).includes(`${subjectKey}-${topicId}`);
                            return (
                              <button
                                key={idx}
                                onClick={() => toggleTopicCompletion(subjectKey, topicId)}
                                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                  isCompleted 
                                    ? 'bg-emerald-500/20 border-emerald-500/40' 
                                    : 'bg-black/20 border-white/10 hover:border-white/20'
                                }`}
                              >
                                {isCompleted ? <CheckCircle size={18} className="text-emerald-400"/> : <Square size={18}/>}
                                <span className="text-xs font-bold">{topic}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* 🎯 MILESTONES */}
          {activeTab === 'milestones' && (
            <motion.div key="mil" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter">Personal Milestones 🎯</h2>
                  <p className="text-slate-400 text-sm mt-2">Set goals and track your progress</p>
                </div>
                <button 
                  onClick={()=>setShowMilestoneModal(true)}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black uppercase text-sm flex items-center gap-2"
                >
                  <Plus size={20}/> New Goal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {milestones.map(milestone => (
                  <div key={milestone.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-black uppercase text-lg">{milestone.goal}</h3>
                        <p className="text-sm text-slate-400 mt-1">Target: {milestone.target} SC by {new Date(milestone.deadline).toLocaleDateString()}</p>
                      </div>
                      {milestone.completed && <CheckCircle className="text-emerald-400" size={24}/>}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span className="font-black">{Math.min(100, (sc / milestone.target) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{width: 0}}
                          animate={{width: `${Math.min(100, (sc / milestone.target) * 100)}%`}}
                          className="h-full bg-purple-500"
                        />
                      </div>
                    </div>
                    
                    {!milestone.completed && sc >= milestone.target && (
                      <button 
                        onClick={() => {
                          const updated = milestones.map(m => 
                            m.id === milestone.id ? {...m, completed: true} : m
                          );
                          setMilestones(updated);
                          localStorage.setItem(`milestones_${name}`, JSON.stringify(updated));
                          addSC(100);
                          confetti();
                        }}
                        className="w-full py-3 bg-emerald-600 rounded-xl font-black uppercase text-sm"
                      >
                        Complete Goal (+100 SC)
                      </button>
                    )}
                  </div>
                ))}
                
                {milestones.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-slate-500">
                    <TargetIcon size={48} className="mx-auto mb-4 opacity-20"/>
                    <p className="font-black uppercase">No goals yet. Create your first milestone!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 😊 MOOD TRACKER */}
          {activeTab === 'mood' && (
            <motion.div key="mood" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter">Mood Tracker 😊</h2>
                  <p className="text-slate-400 text-sm mt-2">Track your understanding and confidence</p>
                </div>
                <button 
                  onClick={()=>setShowMoodModal(true)}
                  className="px-8 py-4 bg-pink-600 hover:bg-pink-500 rounded-2xl font-black uppercase text-sm flex items-center gap-2"
                >
                  <Plus size={20}/> Log Mood
                </button>
              </div>

              {/* Mood History */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {moodHistory.slice(-12).reverse().map((entry, idx) => {
                  const moodEmoji = entry.mood === 0 ? '😫' : entry.mood === 1 ? '😐' : entry.mood === 2 ? '😊' : '🤓';
                  const moodLabel = entry.mood === 0 ? 'Confused' : entry.mood === 1 ? 'Learning' : entry.mood === 2 ? 'Got it' : 'Mastered';
                  return (
                    <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                      <p className="text-4xl mb-2">{moodEmoji}</p>
                      <p className="font-black uppercase text-sm">{moodLabel}</p>
                      <p className="text-xs text-slate-400 mt-1">{SUBJECTS.find(s => s.id === entry.subject)?.name}</p>
                      <p className="text-xs text-slate-500 mt-2">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                  );
                })}
              </div>

              {/* Mood Correlation */}
              {moodHistory.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6">Mood vs Credits Correlation 📊</h3>
                  <div className="h-48 flex items-end gap-2">
                    {moodHistory.slice(-10).map((entry, idx) => {
                      const height = (entry.mood / 3) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                          <motion.div 
                            initial={{height: 0}}
                            animate={{height: `${height}%`}}
                            className="w-full bg-pink-500 rounded-t"
                          />
                          <span className="text-xs">{entry.mood === 0 ? '😫' : entry.mood === 1 ? '😐' : entry.mood === 2 ? '😊' : '🤓'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 🚀 ADVANCED ANALYTICS */}
          {activeTab === 'advanced' && (
            <motion.div key="adv" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-12">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Advanced Analytics 🚀</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Radar Chart - Subject Strength */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Subject Strength Radar 📊</h3>
                  <div className="relative w-full aspect-square max-w-sm mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {[20, 40, 60, 80, 100].map(r => (
                        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                      ))}
                      {SUBJECTS.slice(0, 4).map((_, i) => {
                        const angle = (i * 90 - 90) * (Math.PI / 180);
                        const x2 = 100 + 100 * Math.cos(angle);
                        const y2 = 100 + 100 * Math.sin(angle);
                        return <line key={i} x1="100" y1="100" x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>;
                      })}
                      <motion.polygon
                        points={SUBJECTS.slice(0, 4).map((s, i) => {
                          const progress = getTopicProgress(s.id);
                          const angle = (i * 90 - 90) * (Math.PI / 180);
                          const r = progress;
                          const x = 100 + r * Math.cos(angle);
                          const y = 100 + r * Math.sin(angle);
                          return `${x},${y}`;
                        }).join(' ')}
                        fill="rgba(59, 130, 246, 0.3)"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        initial={{scale: 0}}
                        animate={{scale: 1}}
                      />
                    </svg>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-[10px] font-black">
                    {SUBJECTS.slice(0, 4).map(s => (
                      <div key={s.id} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: s.color}}></div>
                        <span>{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prediction Model */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Completion Prediction 🎯</h3>
                  {(() => {
                    const pred = getPrediction();
                    return (
                      <div className="space-y-6">
                        <div className="text-center">
                          <p className="text-6xl font-black font-mono">{pred.percentComplete.toFixed(1)}%</p>
                          <p className="text-xs text-slate-400 mt-2">SYLLABUS COMPLETE</p>
                        </div>
                        
                        <div className={`p-6 rounded-2xl ${pred.onTrack ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-red-500/20 border border-red-500/40'}`}>
                          <p className="text-sm font-black uppercase mb-2">
                            {pred.onTrack ? '✅ ON TRACK!' : '⚠️ FALLING BEHIND'}
                          </p>
                          <p className="text-xs">
                            {pred.onTrack 
                              ? `You're doing great! Keep this pace to finish ${pred.daysLeft - pred.daysNeeded} days early.`
                              : `Speed up! You need ${pred.daysNeeded} days but only have ${pred.daysLeft} left.`
                            }
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Days Left</span>
                            <span className="font-black">{pred.daysLeft}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Days Needed (current pace)</span>
                            <span className="font-black">{pred.daysNeeded}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Study Velocity */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Study Velocity 🚴</h3>
                  <div className="text-center space-y-4">
                    <p className="text-5xl font-black font-mono">{(Object.values(completedTopics).flat().length / 7).toFixed(1)}</p>
                    <p className="text-xs text-slate-400">TOPICS / WEEK</p>
                    <div className="h-24 flex items-end gap-2">
                      {[3, 5, 7, 4, 8, 6, 9].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{height: 0}}
                          animate={{height: `${h * 10}%`}}
                          className="flex-1 bg-blue-500 rounded-t"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Credit ROI */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Credit ROI 💎</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-5xl font-black font-mono">{totalHours > 0 ? (sc / parseFloat(totalHours)).toFixed(1) : '0'}</p>
                      <p className="text-xs text-slate-400">SC / HOUR</p>
                    </div>
                    {SUBJECTS.slice(0, 4).map(s => (
                      <div key={s.id} className="flex justify-between items-center p-4 bg-black/20 rounded-xl">
                        <span className="text-xs font-black">{s.emoji} {s.name}</span>
                        <span className="text-sm font-black font-mono" style={{color: s.color}}>
                          {(Math.random() * 50 + 30).toFixed(1)} SC/h
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weak Areas */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] col-span-full">
                  <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6">🚩 Weak Areas (Score &lt; 70%)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getWeakAreas().map(subjectId => {
                      const subject = SUBJECTS.find(s => s.id === subjectId);
                      const avg = getSubjectAverage(subjectId);
                      return (
                        <div key={subjectId} className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl">
                          <p className="text-3xl mb-2">{subject?.emoji}</p>
                          <p className="font-black uppercase text-sm">{subject?.name}</p>
                          <p className="text-2xl font-black font-mono text-red-400 mt-2">{avg.toFixed(1)}%</p>
                          <p className="text-xs text-slate-400 mt-2">Focus needed</p>
                        </div>
                      );
                    })}
                    {getWeakAreas().length === 0 && (
                      <div className="col-span-3 text-center py-8 text-emerald-400">
                        <CheckCircle size={48} className="mx-auto mb-4"/>
                        <p className="font-black uppercase">All subjects above 70%! 🎉</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Past Papers Tracker */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] col-span-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">📝 Past Paper Tracker</h3>
                    <button 
                      onClick={()=>setShowPaperModal(true)}
                      className="px-6 py-3 bg-blue-600 rounded-xl font-black uppercase text-xs flex items-center gap-2"
                    >
                      <Plus size={16}/> Add Paper
                    </button>
                  </div>
                  
                  {pastPapers.length > 0 ? (
                    <div className="space-y-4">
                      {pastPapers.slice(-5).reverse().map(paper => (
                        <div key={paper.id} className="bg-black/20 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-black uppercase text-sm">{SUBJECTS.find(s => s.id === paper.subject)?.name} - {paper.year}</p>
                            <p className="text-xs text-slate-400">{paper.date} • {paper.timeSpent} mins</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black font-mono" style={{color: paper.score >= 75 ? '#10b981' : paper.score >= 50 ? '#f59e0b' : '#ef4444'}}>
                              {paper.score}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <FileText size={48} className="mx-auto mb-4 opacity-20"/>
                      <p className="font-black uppercase">No past papers logged yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Management Simulator */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 p-8 rounded-[2.5rem]">
                <h3 className="text-2xl font-black uppercase mb-6">⏰ Time Management Simulator</h3>
                <p className="text-sm mb-6">Practice completing a 3-hour mock exam. Finish on time for +100 SC bonus!</p>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="text-center">
                    <p className="text-6xl font-mono font-black">{formatTime(simTime)}</p>
                    <p className="text-xs text-slate-400 mt-2">TIME REMAINING</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        if (!simActive) {
                          setSimTime(10800);
                          setSimActive(true);
                        } else {
                          setSimActive(false);
                        }
                      }}
                      className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black uppercase text-sm"
                    >
                      {simActive ? 'Pause' : 'Start Sim'}
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (simTime > 0) {
                          addSC(100);
                          alert("Completed on time! +100 SC 🎉");
                        }
                        setSimActive(false);
                        setSimTime(10800);
                      }}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black uppercase text-sm"
                    >
                      Finish
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 📚 SUBJECTS TAB */}
          {activeTab === 'subjects' && (
            <motion.div key="sub" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-12">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter">Exam Analytics 📚</h2>
                  <p className="text-slate-400 text-sm mt-2">Overall Average: <span className="text-emerald-400 font-black text-2xl">{getOverallAverage().toFixed(1)}%</span></p>
                </div>
                <button 
                  onClick={()=>setShowAddMarkModal(true)}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center gap-2"
                >
                  <Plus size={20}/> Add Mark
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SUBJECTS.map(subject => {
                  const marks = examMarks[subject.id] || [];
                  const avg = getSubjectAverage(subject.id);
                  const trend = marks.length >= 2 ? marks[marks.length - 1] - marks[marks.length - 2] : 0;
                  
                  return (
                    <motion.div 
                      key={subject.id}
                      whileHover={{scale: 1.02}}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-2xl mb-2">{subject.emoji}</p>
                          <h3 className="text-sm font-black uppercase tracking-tight">{subject.name}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black font-mono" style={{color: subject.color}}>
                            {avg > 0 ? avg.toFixed(1) : '--'}
                          </p>
                          <p className="text-[8px] text-slate-500 font-black uppercase">Average</p>
                        </div>
                      </div>
                      
                      {marks.length > 0 && (
                        <div className="h-20 flex items-end gap-1">
                          {marks.slice(-10).map((mark, i) => (
                            <div key={i} className="flex-1 relative group">
                              <motion.div
                                initial={{height: 0}}
                                animate={{height: `${mark}%`}}
                                className="absolute bottom-0 left-0 right-0 rounded-t"
                                style={{backgroundColor: subject.color}}
                              />
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-black bg-black px-2 py-1 rounded whitespace-nowrap z-10">
                                {mark}%
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between text-[10px] font-black">
                        <span className="text-slate-500">Exams: {marks.length}</span>
                        {trend !== 0 && (
                          <span className={trend > 0 ? 'text-emerald-400' : 'text-red-400'}>
                            {trend > 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] space-y-6">
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Subject Comparison 📊</h3>
                <div className="space-y-4">
                  {SUBJECTS.map(subject => {
                    const avg = getSubjectAverage(subject.id);
                    return (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className="flex items-center gap-2">
                            <span>{subject.emoji}</span>
                            {subject.name}
                          </span>
                          <span style={{color: subject.color}}>{avg > 0 ? avg.toFixed(1) : '0'}%</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{width: 0}}
                            animate={{width: `${avg}%`}}
                            transition={{duration: 1, ease: "easeOut"}}
                            className="h-full rounded-full"
                            style={{backgroundColor: subject.color}}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* 📈 ANALYTICS */}
          {activeTab === 'analytics' && (
            <motion.div key="a" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-6xl mx-auto space-y-12">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Mastery Analysis 📊</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] min-h-[300px]">
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Subject Spread 🧬</p>
                   <div className="space-y-6">
                      <SubjectBar label="Combined Maths" percent={75} color="bg-blue-500" />
                      <SubjectBar label="Physics" percent={60} color="bg-purple-500" />
                      <SubjectBar label="Chemistry" percent={45} color="bg-emerald-500" />
                   </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-between">
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Credit Velocity 📈</p>
                   <div className="h-48 flex items-end gap-2 px-4">
                      {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-600/20 rounded-t-lg relative group">
                          <motion.div 
                            initial={{height:0}} 
                            animate={{height: `${h}%`}} 
                            transition={{delay: i * 0.1, duration: 0.5}}
                            className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg group-hover:bg-blue-400 transition-colors" 
                          />
                        </div>
                      ))}
                   </div>
                   <div className="flex justify-between text-[8px] font-black text-slate-500 mt-4 uppercase">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                   </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center justify-center">
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Study Distribution 🥧</p>
                   <div className="relative w-48 h-48">
                     <svg viewBox="0 0 100 100" className="transform -rotate-90">
                       <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="20" strokeDasharray="87.96 251.2" strokeDashoffset="0" />
                       <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="113.04 251.2" strokeDashoffset="-87.96" />
                       <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="50.24 251.2" strokeDashoffset="-201" />
                     </svg>
                   </div>
                   <div className="mt-6 space-y-2 text-[10px] font-black">
                     <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Maths 45%</div>
                     <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> Physics 35%</div>
                     <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Chemistry 20%</div>
                   </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Weekly Trend 📉</p>
                   <svg viewBox="0 0 200 100" className="w-full h-32">
                     <motion.polyline
                       points="10,80 40,60 70,70 100,40 130,50 160,20 190,30"
                       fill="none"
                       stroke="#3b82f6"
                       strokeWidth="2"
                       initial={{pathLength: 0}}
                       animate={{pathLength: 1}}
                       transition={{duration: 2}}
                     />
                     {[10, 40, 70, 100, 130, 160, 190].map((x, i) => {
                       const y = [80, 60, 70, 40, 50, 20, 30][i];
                       return (
                         <motion.circle 
                           key={i}
                           cx={x} 
                           cy={y} 
                           r="3" 
                           fill="#3b82f6"
                           initial={{scale: 0}}
                           animate={{scale: 1}}
                           transition={{delay: i * 0.2}}
                         />
                       );
                     })}
                   </svg>
                </div>
              </div>
            </motion.div>
          )}

          {/* 📻 AUDIO */}
          {activeTab === 'audio' && (
            <motion.div key="au" initial={{opacity:0}} animate={{opacity:1}} className="max-w-4xl mx-auto space-y-12">
              <div className="text-center">
                <h2 className="text-5xl font-black uppercase tracking-tighter">Audio Station 📻</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase mt-2 tracking-widest">
                  Selected: {LOFI_LIBRARY[currentTrackIdx].name} {LOFI_LIBRARY[currentTrackIdx].emoji}
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] space-y-4">
                {LOFI_LIBRARY.map((track, idx) => {
                  const isUnlocked = unlockedTracks.includes(track.id);
                  const isCurrent = currentTrackIdx === idx;
                  return (
                    <button 
                      key={track.id} 
                      onClick={() => {
                        if (isUnlocked) {
                          setCurrentTrackIdx(idx);
                          if (!isPlaying) togglePlay();
                        }
                      }} 
                      className={`w-full p-6 rounded-2xl border flex items-center justify-between transition-all ${
                        isCurrent ? 'bg-blue-600 border-blue-400' : 'bg-black/20 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={isPlaying && isCurrent ? { rotate: 360 } : { rotate: 0 }}
                          transition={isPlaying && isCurrent ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
                        >
                          <Disc className="text-white" size={20}/>
                        </motion.div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          {track.name} <span className="text-2xl ml-2">{track.emoji}</span>
                        </span>
                      </div>
                      {isUnlocked ? (
                         isCurrent && isPlaying ? <Pause size={18}/> : <Play size={18}/>
                      ) : (
                        <span className="text-[10px] font-black text-white/20">{track.cost} SC 💎</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {isPlaying && (
                  <motion.div 
                    initial={{y: 100, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: 100, opacity: 0}}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 z-[200]"
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const prevIdx = (currentTrackIdx - 1 + LOFI_LIBRARY.length) % LOFI_LIBRARY.length;
                        if (unlockedTracks.includes(LOFI_LIBRARY[prevIdx].id)) {
                          setCurrentTrackIdx(prevIdx);
                        }
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <SkipBack size={20}/>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }} 
                      className="p-3 bg-white text-blue-600 rounded-full hover:scale-110 transition-transform"
                    >
                      {isPlaying ? <Pause size={24}/> : <Play size={24}/>}
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextIdx = (currentTrackIdx + 1) % LOFI_LIBRARY.length;
                        if (unlockedTracks.includes(LOFI_LIBRARY[nextIdx].id)) {
                          setCurrentTrackIdx(nextIdx);
                        }
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <SkipForward size={20}/>
                    </button>
                    
                    <div className="ml-4 text-xs font-black">
                      <span className="text-2xl mr-2">{LOFI_LIBRARY[currentTrackIdx].emoji}</span>
                      {LOFI_LIBRARY[currentTrackIdx].name}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* 🛒 THE VAULT */}
          {activeTab === 'store' && (
            <motion.div key="s" initial={{opacity:0}} animate={{opacity:1}} className="max-w-6xl mx-auto space-y-12">
               <div className="text-center">
                  <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter">
                    The Vault <span className="inline-block animate-pulse">🏛️</span>
                  </h2>
                  <p className="mt-4 text-emerald-400 font-mono text-2xl font-black">
                    Balance: {sc} <span className="inline-block animate-bounce">💎</span>
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StoreCard title={<>📻 Audio <motion.span animate={{rotate: [0, 10, -10, 0]}} transition={{repeat: Infinity, duration: 2}}>🎵</motion.span></>}>
                    {LOFI_LIBRARY.slice(1).map(t => (
                      <StoreItem 
                        key={t.id} 
                        name={
                          <span className="flex items-center gap-2">
                            <motion.span 
                              animate={{scale: [1, 1.2, 1]}} 
                              transition={{repeat: Infinity, duration: 1.5, delay: Math.random()}}
                              className="text-lg"
                            >
                              {t.emoji}
                            </motion.span>
                            {t.name}
                          </span>
                        }
                        cost={t.cost} 
                        unlocked={unlockedTracks.includes(t.id)} 
                        onClick={()=>buyItem(t.cost, t.id, 'track')} 
                      />
                    ))}
                  </StoreCard>
                  
                  <StoreCard title={<>🎨 Themes <motion.span animate={{y: [0, -5, 0]}} transition={{repeat: Infinity, duration: 1.5}}>✨</motion.span></>}>
                    {THEMES.slice(1).map(t => (
                      <StoreItem 
                        key={t.id}
                        name={
                          <span className="flex items-center gap-2">
                            <motion.span animate={{scale: [1, 1.2, 1]}} transition={{repeat: Infinity, duration: 2}} className="text-lg">🎨</motion.span>
                            {t.name}
                          </span>
                        }
                        cost={t.cost}
                        unlocked={unlockedThemes.includes(t.id)}
                        onClick={() => {
                          if (!unlockedThemes.includes(t.id)) {
                            buyItem(t.cost, t.id, 'theme');
                          }
                          setCurrentTheme(t.id);
                          localStorage.setItem(`current_theme_${name}`, t.id);
                        }}
                      />
                    ))}
                  </StoreCard>
                  
                  <StoreCard title={<>☕ Rewards <motion.span animate={{scale: [1, 1.2, 1]}} transition={{repeat: Infinity, duration: 1.2}}>🎁</motion.span></>}>
                    <StoreItem 
                      name={
                        <span className="flex items-center gap-2">
                          <motion.span animate={{y: [0, -3, 0]}} transition={{repeat: Infinity, duration: 1}} className="text-lg">☕</motion.span>
                          Coffee Break
                        </span>
                      }
                      cost={70} 
                      onClick={()=>buyItem(70, 'r1', 'real')} 
                    />
                    <StoreItem 
                      name={
                        <span className="flex items-center gap-2">
                          <motion.span animate={{rotate: [0, 15, -15, 0]}} transition={{repeat: Infinity, duration: 1.5}} className="text-lg">🎮</motion.span>
                          Gaming Hour
                        </span>
                      }
                      cost={400} 
                      onClick={()=>buyItem(400, 'r2', 'real')} 
                    />
                    <StoreItem 
                      name={
                        <span className="flex items-center gap-2">
                          <motion.span animate={{scale: [1, 1.1, 1]}} transition={{repeat: Infinity, duration: 1.3}} className="text-lg">🍕</motion.span>
                          Cheat Meal
                        </span>
                      }
                      cost={800} 
                      onClick={()=>buyItem(800, 'r3', 'real')} 
                    />
                    <StoreItem 
                      name={
                        <span className="flex items-center gap-2">
                          <motion.span animate={{x: [0, 5, -5, 0]}} transition={{repeat: Infinity, duration: 2}} className="text-lg">🛌</motion.span>
                          Rest Day
                        </span>
                      }
                      cost={1500} 
                      onClick={()=>buyItem(1500, 'r4', 'real')} 
                    />
                  </StoreCard>
               </div>

               {/* Badges Section */}
               {unlockedBadges.length > 0 && (
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem]">
                   <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-6">🏆 Your Badges</h3>
                   <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                     {unlockedBadges.map(badge => (
                       <div key={badge} className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-center">
                         <p className="text-3xl mb-2">🏆</p>
                         <p className="text-xs font-black">{badge.replace('badge_', '')}00 SC</p>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </motion.div>
          )}

          {/* ⏱️ FOCUS HUB */}
          {activeTab === 'focus' && (
            <motion.div key="f" initial={{opacity:0}} animate={{opacity:1}} className="max-w-4xl mx-auto h-[70vh] flex flex-col items-center justify-center space-y-12">
               <div className="flex bg-white/5 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
                  <button onClick={()=>setFocusMode('timer')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${focusMode==='timer' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Timer ⏱️</button>
                  <button onClick={()=>setFocusMode('stopwatch')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${focusMode==='stopwatch' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Stopwatch ⏲️</button>
               </div>
               <div className="text-center">
                  <h2 className="text-8xl md:text-[12rem] font-mono font-black tracking-tighter tabular-nums">
                    {focusMode === 'timer' ? formatTime(timeLeft) : formatTime(stopwatchTime)}
                  </h2>
               </div>
               <div className="flex gap-4">
                  <button onClick={()=>setIsActive(!isActive)} className="px-12 py-5 bg-white text-black font-black uppercase rounded-2xl text-sm tracking-widest hover:scale-105 transition-transform">
                    {isActive ? '⏸️ Pause' : '▶️ Start'}
                  </button>
                  <button onClick={()=>{setIsActive(false); focusMode==='timer' ? setTimeLeft(1500) : setStopwatchTime(0)}} className="p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <RotateCcw/>
                  </button>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* MODALS */}
      
      {/* 🎁 DAILY BONUS MODAL */}
      <AnimatePresence>
        {showBonusModal && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={()=>setShowBonusModal(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e)=>e.stopPropagation()}
              className="bg-gradient-to-br from-amber-500 to-orange-600 p-12 rounded-[3rem] max-w-md text-center space-y-6 shadow-2xl"
            >
              <motion.div
                animate={{rotate: [0, 10, -10, 0], scale: [1, 1.1, 1]}}
                transition={{repeat: Infinity, duration: 2}}
                className="text-8xl"
              >
                🎁
              </motion.div>
              <h2 className="text-4xl font-black uppercase">Daily Bonus!</h2>
              <div className="space-y-2">
                <p className="text-6xl font-black font-mono">{50 + (dailyStreak * 10)} SC 💎</p>
                <p className="text-sm font-black uppercase tracking-widest">
                  Day {dailyStreak + 1} Streak 🔥
                </p>
              </div>
              <button 
                onClick={claimDailyBonus}
                className="w-full py-5 bg-white text-orange-600 font-black uppercase text-lg rounded-2xl hover:scale-105 transition-transform"
              >
                Claim Bonus! ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📝 ADD MARK MODAL */}
      <AnimatePresence>
        {showAddMarkModal && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={()=>setShowAddMarkModal(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e)=>e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-3xl font-black uppercase text-center">Add Exam Mark 📝</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Subject</label>
                  <select 
                    value={selectedSubject}
                    onChange={(e)=>setSelectedSubject(e.target.value)}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black uppercase text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Subject</option>
                    {SUBJECTS.map(s => (
                      <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Mark (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={newMark}
                    onChange={(e)=>setNewMark(e.target.value)}
                    placeholder="0-100"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black text-2xl text-center focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={()=>setShowAddMarkModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={addExamMark}
                  className="flex-1 py-4 bg-blue-600 rounded-2xl font-black uppercase text-sm hover:bg-blue-500"
                >
                  Add Mark ✅
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎯 MILESTONE MODAL */}
      <AnimatePresence>
        {showMilestoneModal && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={()=>setShowMilestoneModal(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e)=>e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-3xl font-black uppercase text-center">New Milestone 🎯</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Goal</label>
                  <input 
                    type="text"
                    value={newMilestone.goal}
                    onChange={(e)=>setNewMilestone({...newMilestone, goal: e.target.value})}
                    placeholder="e.g., Complete Physics syllabus"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Target Credits</label>
                  <input 
                    type="number"
                    value={newMilestone.target}
                    onChange={(e)=>setNewMilestone({...newMilestone, target: e.target.value})}
                    placeholder="500"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black text-xl text-center focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Deadline</label>
                  <input 
                    type="date"
                    value={newMilestone.deadline}
                    onChange={(e)=>setNewMilestone({...newMilestone, deadline: e.target.value})}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={()=>setShowMilestoneModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={addMilestone}
                  className="flex-1 py-4 bg-purple-600 rounded-2xl font-black uppercase text-sm hover:bg-purple-500"
                >
                  Create Goal ✨
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 😊 MOOD MODAL */}
      <AnimatePresence>
        {showMoodModal && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={()=>setShowMoodModal(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e)=>e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-3xl font-black uppercase text-center">Log Your Mood 😊</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">How do you feel?</label>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { val: 0, emoji: '😫', label: 'Confused' },
                      { val: 1, emoji: '😐', label: 'Learning' },
                      { val: 2, emoji: '😊', label: 'Got it' },
                      { val: 3, emoji: '🤓', label: 'Mastered' }
                    ].map(m => (
                      <button
                        key={m.val}
                        onClick={()=>setCurrentMood({...currentMood, mood: m.val})}
                        className={`p-4 rounded-2xl border transition-all ${currentMood.mood === m.val ? 'bg-pink-600 border-pink-400' : 'bg-black/20 border-white/10'}`}
                      >
                        <p className="text-4xl mb-2">{m.emoji}</p>
                        <p className="text-xs font-black">{m.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Subject</label>
                  <select 
                    value={currentMood.subject}
                    onChange={(e)=>setCurrentMood({...currentMood, subject: e.target.value})}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black uppercase text-sm focus:border-pink-500 focus:outline-none"
                  >
                    <option value="">Select Subject</option>
                    {SUBJECTS.map(s => (
                      <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={()=>setShowMoodModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={addMoodEntry}
                  className="flex-1 py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm hover:bg-pink-500"
                >
                  Log Mood (+10 SC)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📝 PAST PAPER MODAL */}
      <AnimatePresence>
        {showPaperModal && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={()=>setShowPaperModal(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e)=>e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-3xl font-black uppercase text-center">Add Past Paper 📝</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Subject</label>
                  <select 
                    value={newPaper.subject}
                    onChange={(e)=>setNewPaper({...newPaper, subject: e.target.value})}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black uppercase text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Subject</option>
                    {SUBJECTS.map(s => (
                      <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Year</label>
                  <input 
                    type="text"
                    value={newPaper.year}
                    onChange={(e)=>setNewPaper({...newPaper, year: e.target.value})}
                    placeholder="2024"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black text-center focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Score (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={newPaper.score}
                    onChange={(e)=>setNewPaper({...newPaper, score: e.target.value})}
                    placeholder="85"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black text-2xl text-center focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Time Spent (mins)</label>
                  <input 
                    type="number"
                    value={newPaper.timeSpent}
                    onChange={(e)=>setNewPaper({...newPaper, timeSpent: e.target.value})}
                    placeholder="180"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black text-center focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={()=>setShowPaperModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={addPastPaper}
                  className="flex-1 py-4 bg-blue-600 rounded-2xl font-black uppercase text-sm hover:bg-blue-500"
                >
                  Add Paper ✅
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎉 MOTIVATIONAL UNLOCK MODAL */}
      <AnimatePresence>
        {showMotivation && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={()=>setShowMotivation(false)}
          >
            <motion.div 
              initial={{scale: 0.5, rotate: -10}}
              animate={{scale: 1, rotate: 0}}
              exit={{scale: 0.5, rotate: 10}}
              onClick={(e)=>e.stopPropagation()}
              className="bg-gradient-to-br from-purple-600 to-pink-600 p-12 rounded-[3rem] max-w-lg text-center space-y-6 shadow-2xl"
            >
              <motion.div
                animate={{y: [0, -20, 0]}}
                transition={{repeat: Infinity, duration: 2}}
                className="text-8xl"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-black uppercase">Milestone Reached!</h2>
              <p className="text-xl italic">"{currentQuote}"</p>
              <p className="text-sm font-black">You've earned {lastUnlockAt * 100} total credits! 🏆</p>
              <button 
                onClick={()=>setShowMotivation(false)}
                className="w-full py-5 bg-white text-purple-600 font-black uppercase text-lg rounded-2xl hover:scale-105 transition-transform"
              >
                Keep Going! 💪
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 👻 GHOST MODE */}
      <AnimatePresence>
        {isGhostMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center">
             <h1 className="text-[15rem] font-mono font-black opacity-40 tabular-nums">
                {focusMode === 'timer' ? formatTime(timeLeft) : formatTime(stopwatchTime)}
             </h1>
             <button onClick={()=>setIsGhostMode(false)} className="mt-12 text-white/20 hover:text-white uppercase text-[10px] font-black tracking-[0.5em]">[ ESCAPE GHOST PROTOCOL ]</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- HELPERS ---

function NavBtn({icon, active, onClick, label}: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 lg:gap-4 p-2 lg:p-3 rounded-xl transition-all group whitespace-nowrap ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
      <span className="flex-shrink-0">{icon}</span>
      <span className="hidden xl:block text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function TaskGroup({title, children}: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-[11px] font-black text-blue-500/40 uppercase tracking-[0.5em] ml-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function TaskItem({name, sc, icon, onClick, gold}: any) {
  return (
    <div className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between backdrop-blur-xl ${gold ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
      <div className="flex items-center gap-4">
        <div className={gold ? 'text-amber-500' : 'text-blue-500'}>{icon}</div>
        <div>
          <p className="text-[10px] lg:text-xs font-black uppercase tracking-tight text-white/90">{name}</p>
          <p className="text-emerald-400 text-[10px] font-bold">+{sc} SC</p>
        </div>
      </div>
      <button onClick={onClick} className="px-5 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105">Claim</button>
    </div>
  );
}

function StoreCard({title, children}: any) {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
      <h4 className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-[0.4em] text-center flex items-center justify-center gap-2">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function StoreItem({name, cost, unlocked, onClick}: any) {
  return (
    <button onClick={unlocked ? undefined : onClick} className={`w-full flex justify-between items-center p-5 rounded-2xl border transition-all ${unlocked ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-black/40 border-white/5 hover:border-white/20 hover:scale-105'}`}>
      <span className="text-[10px] font-black uppercase tracking-tight">{name}</span>
      <span className="text-[10px] font-black tracking-widest text-blue-400">{unlocked ? '✅ OWNED' : `${cost} SC 💎`}</span>
    </button>
  );
}

function SubjectBar({label, percent, color}: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{width: 0}} animate={{width: `${percent}%`}} transition={{duration: 1, ease: "easeOut"}} className={`h-full ${color}`} />
            </div>
        </div>
    );
}