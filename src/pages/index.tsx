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
  Award, PieChart, Activity, Flag, Rocket, CheckSquare, Square, Target as TargetIcon, Save, Upload
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

const DAILY_QUOTES = [
  "The secret of getting ahead is getting started. 💫",
  "Don't watch the clock; do what it does. Keep going. ⏰",
  "Success is not final, failure is not fatal. 🎯",
  "The only way to do great work is to love what you do. ❤️",
  "Believe in yourself and all that you are. 🌟",
  "Your limitation—it's only your imagination. 🚀",
  "Great things never come from comfort zones. 💪",
  "Dream it. Wish it. Do it. ✨",
  "Success doesn't just find you. You have to go out and get it. 🔥",
  "The harder you work for something, the greater you'll feel when you achieve it. 🏆",
  "Every expert was once a beginner. Keep going! 🚀",
  "Your only limit is you. Break through! ⚡",
  "The harder you work, the luckier you get. 🍀",
  "Believe you can and you're halfway there. 🌟",
  "Dream big. Work hard. Stay focused. 🎯"
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

const VIRTUAL_REWARDS = [
  { id: 'v1', name: 'Scholar Prime', emoji: '🎖️', cost: 300 },
  { id: 'v2', name: 'Maths Deity', emoji: '📐', cost: 600 },
  { id: 'v3', name: 'Physics Master', emoji: '⚛️', cost: 800 },
  { id: 'v4', name: 'Chemistry King', emoji: '🧪', cost: 1000 },
  { id: 'v5', name: 'Study Legend', emoji: '👑', cost: 1500 },
  { id: 'v6', name: 'Time Lord', emoji: '⏳', cost: 2000 },
  { id: 'v7', name: 'Focus Ninja', emoji: '🥷', cost: 2500 },
  { id: 'v8', name: 'Brain Champion', emoji: '🧠', cost: 3000 },
  { id: 'v9', name: 'Exam Destroyer', emoji: '💥', cost: 4000 },
  { id: 'v10', name: 'Ultimate Scholar', emoji: '🌟', cost: 5000 },
  { id: 'v11', name: 'Knowledge Guru', emoji: '🔮', cost: 6000 },
  { id: 'v12', name: 'Academic Titan', emoji: '⚔️', cost: 8000 },
  { id: 'v13', name: 'Study Samurai', emoji: '🗡️', cost: 10000 },
  { id: 'v14', name: 'Einstein Jr.', emoji: '🧑‍🔬', cost: 15000 },
  { id: 'v15', name: 'Legendary A+ God', emoji: '👾', cost: 20000 }
];

const BADGE_TIERS = [
  { day: 1, emoji: '🌱', name: 'Seedling' },
  { day: 3, emoji: '🔥', name: 'Ignited' },
  { day: 7, emoji: '⭐', name: 'Rising Star' },
  { day: 14, emoji: '💎', name: 'Diamond' },
  { day: 30, emoji: '👑', name: 'Crowned' },
  { day: 50, emoji: '🚀', name: 'Rocket' },
  { day: 100, emoji: '🏆', name: 'Champion' },
  { day: 365, emoji: '🌟', name: 'Legend' }
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
  const [completedTopics, setCompletedTopics] = useState<Record<string, string[]>>({});
  const [milestones, setMilestones] = useState<Array<{id: string, goal: string, target: number, deadline: string, completed: boolean}>>([]);
  const [moodHistory, setMoodHistory] = useState<Array<{date: string, mood: number, subject: string, credits: number}>>([]);
  const [pastPapers, setPastPapers] = useState<Array<{id: string, subject: string, year: string, score: number, date: string, timeSpent: number}>>([]);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(['dark']);
  const [lastUnlockAt, setLastUnlockAt] = useState(0);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [simMode, setSimMode] = useState(false);
  const [simTime, setSimTime] = useState(10800);
  const [simActive, setSimActive] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState("");
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [examMarks, setExamMarks] = useState<Record<string, number[]>>({});
  const [showAddMarkModal, setShowAddMarkModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newMark, setNewMark] = useState("");
  const [streak, setStreak] = useState(0);
  const [unlockedTracks, setUnlockedTracks] = useState<string[]>(['t1']);
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [focusMode, setFocusMode] = useState<'timer' | 'stopwatch'>('timer');
  const [timeLeft, setTimeLeft] = useState(1500);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);

  // NEW FEATURES - Theme Customizer
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#a855f7',
    accent: '#10b981'
  });

  // NEW FEATURES - Daily Quote
  const [dailyQuote, setDailyQuote] = useState("");

  // NEW FEATURES - Daily Badge
  const [dailyBadge, setDailyBadge] = useState({ show: false, badge: '', emoji: '', day: 0 });

  // NEW FEATURES - Pomodoro Customization
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    cycles: 4
  });
  const [showPomodoroCustomizer, setShowPomodoroCustomizer] = useState(false);
  const [pomodoroCycle, setPomodoroCycle] = useState(0);
  const [pomodoroPhase, setPomodoroPhase] = useState<'work' | 'short' | 'long'>('work');

  // NEW FEATURES - Timer Save/Load
  const [savedTimers, setSavedTimers] = useState<Array<{id: string, name: string, time: number, type: 'timer' | 'stopwatch'}>>([]);
  const [showSaveTimerModal, setShowSaveTimerModal] = useState(false);
  const [timerName, setTimerName] = useState("");

  // Modals
  const [showNewMilestone, setShowNewMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ goal: '', target: '', deadline: '' });
  const [showMoodLog, setShowMoodLog] = useState(false);
  const [currentMood, setCurrentMood] = useState(3);
  const [moodSubject, setMoodSubject] = useState('');
  const [moodCredits, setMoodCredits] = useState('');
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [newPaper, setNewPaper] = useState({ subject: '', year: '', score: '', timeSpent: '' });

  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize daily quote and badge
  useEffect(() => {
    const today = new Date().toDateString();
    const quoteIndex = new Date().getDate() % DAILY_QUOTES.length;
    setDailyQuote(DAILY_QUOTES[quoteIndex]);

    // Check daily badge
    const lastBadgeDate = localStorage.getItem(`last_badge_${name}`);
    if (lastBadgeDate !== today) {
      const currentStreak = dailyStreak > 0 ? dailyStreak : 1;
      const badge = BADGE_TIERS.reverse().find(b => currentStreak >= b.day) || BADGE_TIERS[0];
      setDailyBadge({ 
        show: true, 
        badge: badge.name, 
        emoji: badge.emoji,
        day: currentStreak 
      });
      localStorage.setItem(`last_badge_${name}`, today);
      
      // Hide badge after 5 seconds
      setTimeout(() => {
        setDailyBadge(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  }, [dailyStreak, name]);

  // Load data from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('scholar_name');
    const savedSc = localStorage.getItem('scholar_sc');
    const savedSeconds = localStorage.getItem('scholar_totalSeconds');
    const savedCompleted = localStorage.getItem('scholar_completedTopics');
    const savedMilestones = localStorage.getItem('scholar_milestones');
    const savedMoods = localStorage.getItem('scholar_moodHistory');
    const savedPapers = localStorage.getItem('scholar_pastPapers');
    const savedTheme = localStorage.getItem('scholar_currentTheme');
    const savedUnlockedThemes = localStorage.getItem('scholar_unlockedThemes');
    const savedLastUnlock = localStorage.getItem('scholar_lastUnlockAt');
    const savedSimMode = localStorage.getItem('scholar_simMode');
    const savedSimTime = localStorage.getItem('scholar_simTime');
    const savedStreak = localStorage.getItem('scholar_dailyStreak');
    const savedLastClaim = localStorage.getItem('scholar_lastClaimDate');
    const savedMarks = localStorage.getItem('scholar_examMarks');
    const savedUnlockedTracks = localStorage.getItem('scholar_unlockedTracks');
    const savedUnlockedRewards = localStorage.getItem('scholar_unlockedRewards');
    const savedUnlockedBadges = localStorage.getItem('scholar_unlockedBadges');
    const savedCustomColors = localStorage.getItem(`custom_colors_${savedName || 'Scholar'}`);
    const savedPomodoroSettings = localStorage.getItem(`pomodoro_settings_${savedName || 'Scholar'}`);
    const savedTimersList = localStorage.getItem(`saved_timers_${savedName || 'Scholar'}`);

    if (savedName) setName(savedName);
    if (savedSc) setSc(parseInt(savedSc));
    if (savedSeconds) setTotalSeconds(parseInt(savedSeconds));
    if (savedCompleted) setCompletedTopics(JSON.parse(savedCompleted));
    if (savedMilestones) setMilestones(JSON.parse(savedMilestones));
    if (savedMoods) setMoodHistory(JSON.parse(savedMoods));
    if (savedPapers) setPastPapers(JSON.parse(savedPapers));
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedUnlockedThemes) setUnlockedThemes(JSON.parse(savedUnlockedThemes));
    if (savedLastUnlock) setLastUnlockAt(parseInt(savedLastUnlock));
    if (savedSimMode) setSimMode(savedSimMode === 'true');
    if (savedSimTime) setSimTime(parseInt(savedSimTime));
    if (savedStreak) setDailyStreak(parseInt(savedStreak));
    if (savedLastClaim) setLastClaimDate(savedLastClaim);
    if (savedMarks) setExamMarks(JSON.parse(savedMarks));
    if (savedUnlockedTracks) setUnlockedTracks(JSON.parse(savedUnlockedTracks));
    if (savedUnlockedRewards) setUnlockedRewards(JSON.parse(savedUnlockedRewards));
    if (savedUnlockedBadges) setUnlockedBadges(JSON.parse(savedUnlockedBadges));
    if (savedCustomColors) setCustomColors(JSON.parse(savedCustomColors));
    if (savedPomodoroSettings) setPomodoroSettings(JSON.parse(savedPomodoroSettings));
    if (savedTimersList) setSavedTimers(JSON.parse(savedTimersList));

    // Check daily streak
    const today = new Date().toDateString();
    if (savedLastClaim !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (savedLastClaim === yesterday) {
        // Continue streak
      } else if (savedLastClaim !== today) {
        // Reset streak
        setDailyStreak(0);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('scholar_name', name);
    localStorage.setItem('scholar_sc', sc.toString());
    localStorage.setItem('scholar_totalSeconds', totalSeconds.toString());
    localStorage.setItem('scholar_completedTopics', JSON.stringify(completedTopics));
    localStorage.setItem('scholar_milestones', JSON.stringify(milestones));
    localStorage.setItem('scholar_moodHistory', JSON.stringify(moodHistory));
    localStorage.setItem('scholar_pastPapers', JSON.stringify(pastPapers));
    localStorage.setItem('scholar_currentTheme', currentTheme);
    localStorage.setItem('scholar_unlockedThemes', JSON.stringify(unlockedThemes));
    localStorage.setItem('scholar_lastUnlockAt', lastUnlockAt.toString());
    localStorage.setItem('scholar_simMode', simMode.toString());
    localStorage.setItem('scholar_simTime', simTime.toString());
    localStorage.setItem('scholar_dailyStreak', dailyStreak.toString());
    localStorage.setItem('scholar_lastClaimDate', lastClaimDate);
    localStorage.setItem('scholar_examMarks', JSON.stringify(examMarks));
    localStorage.setItem('scholar_unlockedTracks', JSON.stringify(unlockedTracks));
    localStorage.setItem('scholar_unlockedRewards', JSON.stringify(unlockedRewards));
    localStorage.setItem('scholar_unlockedBadges', JSON.stringify(unlockedBadges));
    localStorage.setItem(`custom_colors_${name}`, JSON.stringify(customColors));
    localStorage.setItem(`pomodoro_settings_${name}`, JSON.stringify(pomodoroSettings));
    localStorage.setItem(`saved_timers_${name}`, JSON.stringify(savedTimers));
  }, [name, sc, totalSeconds, completedTopics, milestones, moodHistory, pastPapers, currentTheme, unlockedThemes, lastUnlockAt, simMode, simTime, dailyStreak, lastClaimDate, examMarks, unlockedTracks, unlockedRewards, unlockedBadges, customColors, pomodoroSettings, savedTimers]);

  // Timer/Stopwatch logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        if (focusMode === 'timer') {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setIsActive(false);
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchTime(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, focusMode]);

  // Simulator timer
  useEffect(() => {
    let simInterval: NodeJS.Timeout;
    if (simActive && simMode) {
      simInterval = setInterval(() => {
        setSimTime(prev => {
          if (prev <= 1) {
            setSimActive(false);
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(simInterval);
  }, [simActive, simMode]);

  // Pomodoro auto-switch
  useEffect(() => {
    if (focusMode === 'timer' && timeLeft === 0 && isActive) {
      // Pomodoro cycle complete
      if (pomodoroPhase === 'work') {
        const newCycle = pomodoroCycle + 1;
        setPomodoroCycle(newCycle);
        
        if (newCycle % pomodoroSettings.cycles === 0) {
          // Long break
          setPomodoroPhase('long');
          setTimeLeft(pomodoroSettings.longBreak * 60);
        } else {
          // Short break
          setPomodoroPhase('short');
          setTimeLeft(pomodoroSettings.shortBreak * 60);
        }
      } else {
        // Back to work
        setPomodoroPhase('work');
        setTimeLeft(pomodoroSettings.workTime * 60);
      }
      
      setIsActive(false);
    }
  }, [timeLeft, isActive, focusMode, pomodoroPhase, pomodoroCycle, pomodoroSettings]);

  const claimTask = (credits: number) => {
    setSc(prev => prev + credits);
    setTotalSeconds(prev => prev + 3600);
    confetti({ particleCount: 50, spread: 60 });
    
    // Check for unlock
    const newSc = sc + credits;
    const checkpoints = [100, 300, 500, 1000, 2000, 3000, 5000];
    const nextUnlock = checkpoints.find(cp => newSc >= cp && sc < cp);
    
    if (nextUnlock && nextUnlock !== lastUnlockAt) {
      setLastUnlockAt(nextUnlock);
      setCurrentQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
      setShowMotivation(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalHours = (totalSeconds / 3600).toFixed(1);

  const buyItem = (cost: number, itemId: string, type: 'theme' | 'track' | 'reward' | 'badge' | 'virtual') => {
    if (sc >= cost) {
      setSc(prev => prev - cost);
      
      if (type === 'theme') {
        setUnlockedThemes(prev => [...prev, itemId]);
        setCurrentTheme(itemId);
      } else if (type === 'track') {
        setUnlockedTracks(prev => [...prev, itemId]);
      } else if (type === 'reward' || type === 'virtual') {
        setUnlockedRewards(prev => [...prev, itemId]);
      } else if (type === 'badge') {
        setUnlockedBadges(prev => [...prev, itemId]);
      }
      
      confetti({ particleCount: 100, spread: 70 });
    } else {
      alert(`Need ${cost - sc} more SC! 💎`);
    }
  };

  const toggleTopic = (subjectId: string, topic: string) => {
    setCompletedTopics(prev => {
      const current = prev[subjectId] || [];
      const isCompleted = current.includes(topic);
      
      if (isCompleted) {
        return { ...prev, [subjectId]: current.filter(t => t !== topic) };
      } else {
        claimTask(5);
        return { ...prev, [subjectId]: [...current, topic] };
      }
    });
  };

  const addMilestone = () => {
    if (newMilestone.goal && newMilestone.target && newMilestone.deadline) {
      const milestone = {
        id: Date.now().toString(),
        goal: newMilestone.goal,
        target: parseInt(newMilestone.target),
        deadline: newMilestone.deadline,
        completed: false
      };
      setMilestones(prev => [...prev, milestone]);
      setNewMilestone({ goal: '', target: '', deadline: '' });
      setShowNewMilestone(false);
      claimTask(10);
    }
  };

  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        if (!m.completed) claimTask(m.target);
        return { ...m, completed: !m.completed };
      }
      return m;
    }));
  };

  const addMoodLog = () => {
    if (moodSubject && moodCredits) {
      const log = {
        date: new Date().toLocaleDateString(),
        mood: currentMood,
        subject: moodSubject,
        credits: parseInt(moodCredits)
      };
      setMoodHistory(prev => [...prev, log]);
      setMoodSubject('');
      setMoodCredits('');
      setShowMoodLog(false);
      claimTask(5);
    }
  };

  const addPastPaper = () => {
    if (newPaper.subject && newPaper.year && newPaper.score && newPaper.timeSpent) {
      const paper = {
        id: Date.now().toString(),
        subject: newPaper.subject,
        year: newPaper.year,
        score: parseInt(newPaper.score),
        date: new Date().toLocaleDateString(),
        timeSpent: parseInt(newPaper.timeSpent)
      };
      setPastPapers(prev => [...prev, paper]);
      setNewPaper({ subject: '', year: '', score: '', timeSpent: '' });
      setShowPaperModal(false);
      claimTask(parseInt(newPaper.score) / 2);
    }
  };

  const claimDailyBonus = () => {
    const today = new Date().toDateString();
    if (lastClaimDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = lastClaimDate === yesterday ? dailyStreak + 1 : 1;
      setDailyStreak(newStreak);
      setLastClaimDate(today);
      
      const bonus = 50 + (newStreak * 10);
      claimTask(bonus);
      setShowBonusModal(false);
      confetti({ particleCount: 100, spread: 70 });
    }
  };

  const addExamMark = () => {
    if (selectedSubject && newMark) {
      setExamMarks(prev => ({
        ...prev,
        [selectedSubject]: [...(prev[selectedSubject] || []), parseInt(newMark)]
      }));
      setSelectedSubject('');
      setNewMark('');
      setShowAddMarkModal(false);
      claimTask(parseInt(newMark) / 2);
      confetti({ particleCount: 100, spread: 70 });
    }
  };

  const exportReport = () => {
    const report = {
      name,
      sc,
      totalHours,
      dailyStreak,
      completedTopics,
      milestones,
      moodHistory,
      pastPapers,
      examMarks,
      unlockedRewards,
      unlockedBadges,
      date: new Date().toLocaleDateString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ScholarOS_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    a.click();
  };

  // Audio Controls
  const playTrack = (idx: number) => {
    setCurrentTrackIdx(idx);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = LOFI_LIBRARY.find(t => unlockedTracks.includes(t.id))?.url || LOFI_LIBRARY[0].url;
      audioRef.current.play();
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    const unlockedList = LOFI_LIBRARY.filter(t => unlockedTracks.includes(t.id));
    const nextIdx = (currentTrackIdx + 1) % unlockedList.length;
    playTrack(nextIdx);
  };

  const prevTrack = () => {
    const unlockedList = LOFI_LIBRARY.filter(t => unlockedTracks.includes(t.id));
    const prevIdx = (currentTrackIdx - 1 + unlockedList.length) % unlockedList.length;
    playTrack(prevIdx);
  };

  // NEW FEATURE: Save Timer
  const saveCurrentTimer = () => {
    setShowSaveTimerModal(true);
  };

  const confirmSaveTimer = () => {
    if (!timerName.trim()) {
      alert("Please enter a timer name!");
      return;
    }

    const timer = {
      id: Date.now().toString(),
      name: timerName,
      time: focusMode === 'timer' ? timeLeft : stopwatchTime,
      type: focusMode
    };
    
    setSavedTimers(prev => [...prev, timer]);
    setTimerName("");
    setShowSaveTimerModal(false);
    alert("Timer saved! 💾");
  };

  const loadSavedTimer = (timer: any) => {
    setFocusMode(timer.type);
    if (timer.type === 'timer') {
      setTimeLeft(timer.time);
    } else {
      setStopwatchTime(timer.time);
    }
    setIsActive(false);
  };

  const deleteSavedTimer = (timerId: string) => {
    setSavedTimers(prev => prev.filter(t => t.id !== timerId));
  };

  // Calculate subject progress
  const getSubjectProgress = (subjectId: string) => {
    const subject = SYLLABUS[subjectId as keyof typeof SYLLABUS];
    if (!subject) return 0;
    
    const totalTopics = subject.chapters.reduce((acc, ch) => acc + ch.topics.length, 0);
    const completed = completedTopics[subjectId]?.length || 0;
    
    return Math.round((completed / totalTopics) * 100);
  };

  const themeColors = THEMES.find(t => t.id === currentTheme)?.colors || THEMES[0].colors;

  return (
    <div 
      className="min-h-screen text-white font-sans flex flex-col lg:flex-row overflow-hidden relative transition-colors duration-500"
      style={{ 
        backgroundColor: themeColors.bg,
        background: `linear-gradient(135deg, ${themeColors.bg} 0%, ${themeColors.bg}dd 100%)`
      }}
    >
      <LiquidGlassBubbles />
      
      <audio ref={audioRef} loop />

      {/* 🎯 SIDEBAR NAV */}
      <nav className="lg:w-24 xl:w-32 bg-black/40 backdrop-blur-xl border-r border-white/5 flex lg:flex-col justify-around lg:justify-start items-center p-3 lg:p-6 gap-3 lg:gap-6 z-50 sticky top-0 lg:relative">
        <div className="hidden lg:block text-center mb-8">
          <h1 className="text-2xl xl:text-3xl font-black">🎓</h1>
          <p className="text-[7px] xl:text-[8px] font-black text-blue-500/60 uppercase tracking-widest mt-2">Scholar OS</p>
        </div>

        <NavBtn icon={<Home size={18}/>} active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Home" />
        <NavBtn icon={<Target size={18}/>} active={activeTab === 'milestones'} onClick={() => setActiveTab('milestones')} label="Goals" />
        <NavBtn icon={<BookOpen size={18}/>} active={activeTab === 'syllabus'} onClick={() => setActiveTab('syllabus')} label="Syllabus" />
        <NavBtn icon={<BarChart3 size={18}/>} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Stats" />
        <NavBtn icon={<Timer size={18}/>} active={activeTab === 'focus'} onClick={() => setActiveTab('focus')} label="Focus" />
        <NavBtn icon={<Music size={18}/>} active={activeTab === 'audio'} onClick={() => setActiveTab('audio')} label="Audio" />
        <NavBtn icon={<ShoppingCart size={18}/>} active={activeTab === 'store'} onClick={() => setActiveTab('store')} label="Store" />
        <NavBtn icon={<Smile size={18}/>} active={activeTab === 'mood'} onClick={() => setActiveTab('mood')} label="Mood" />
        <NavBtn icon={<Settings size={18}/>} active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')} label="Advanced" />

        <button 
          onClick={() => setShowThemeCustomizer(true)}
          className="hidden lg:flex p-3 lg:p-4 text-purple-400 hover:bg-purple-500/10 rounded-2xl transition-all items-center gap-3 flex-shrink-0"
        >
          <Palette size={18}/> <span className="hidden xl:block text-[9px] font-black tracking-widest">THEME</span>
        </button>

        <button 
          onClick={() => setIsGhostMode(true)} 
          className="hidden lg:flex p-3 lg:p-4 text-slate-600 hover:text-white hover:bg-white/5 rounded-2xl transition-all items-center gap-3 flex-shrink-0"
        >
          <Ghost size={18}/> <span className="hidden xl:block text-[9px] font-black tracking-widest">GHOST</span>
        </button>
      </nav>

      {/* 📱 MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* 🏠 HOME TAB */}
          {activeTab === 'home' && (
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="space-y-8">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                  <div>
                    <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter">Terminal ⚡</h2>
                    <p className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] mt-2">Scholar Rank: Elite</p>
                  </div>

                  {/* Daily Badge Display */}
                  <AnimatePresence>
                    {dailyBadge.show && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="relative"
                      >
                        <motion.div
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 2,
                            ease: "easeInOut"
                          }}
                          className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-3xl shadow-2xl border-4 border-amber-400"
                        >
                          <div className="text-6xl mb-2">{dailyBadge.emoji}</div>
                          <div className="text-white font-black text-lg">{dailyBadge.badge}</div>
                          <div className="text-amber-200 text-xs font-bold">Day {dailyBadge.day} Streak!</div>
                        </motion.div>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 bg-amber-500 rounded-3xl blur-xl -z-10"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CountdownTimer />
                
                {/* Daily Motivational Quote */}
                <motion.div 
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 p-8 rounded-[2rem] flex flex-col justify-center"
                >
                  <div className="text-4xl mb-4 text-center">💪</div>
                  <p className="text-xl md:text-2xl font-black italic text-center leading-relaxed">&ldquo;{dailyQuote}&rdquo;</p>
                  <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest text-center">Daily Motivation</p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SUBJECTS.map((subj, idx) => {
                  const progress = getSubjectProgress(subj.id);
                  return (
                    <motion.div 
                      key={subj.id}
                      initial={{opacity: 0, scale: 0.9}}
                      animate={{opacity: 1, scale: 1}}
                      transition={{delay: idx * 0.1}}
                      className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{subj.emoji}</span>
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-tight">{subj.name}</h3>
                            <p className="text-[10px] text-slate-500 font-bold">{progress}% Complete</p>
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{width: 0}} 
                          animate={{width: `${progress}%`}}
                          transition={{duration: 1, ease: "easeOut"}}
                          className="h-full rounded-full"
                          style={{backgroundColor: subj.color}}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <TaskGroup title="📚 Daily Tasks">
                <TaskItem name="Complete 10 Topics" sc={50} icon={<CheckCircle/>} onClick={() => claimTask(50)} />
                <TaskItem name="Study for 2 Hours" sc={100} icon={<Clock/>} onClick={() => claimTask(100)} />
                <TaskItem name="Solve 5 Past Papers" sc={150} icon={<FileText/>} onClick={() => claimTask(150)} />
                <TaskItem name="Daily Streak Bonus" sc={50 + (dailyStreak * 10)} icon={<Flame/>} onClick={() => setShowBonusModal(true)} gold />
              </TaskGroup>

              <TaskGroup title="⚡ Quick Actions">
                <TaskItem name="Log Today's Mood" sc={20} icon={<Smile/>} onClick={() => setShowMoodLog(true)} />
                <TaskItem name="Set New Milestone" sc={30} icon={<Target/>} onClick={() => setShowNewMilestone(true)} />
                <TaskItem name="Add Past Paper Result" sc={25} icon={<Award/>} onClick={() => setShowPaperModal(true)} />
                <TaskItem name="Add Exam Mark" sc={15} icon={<BarChart3/>} onClick={() => setShowAddMarkModal(true)} />
                <TaskItem name="Export Progress Report" sc={0} icon={<Download/>} onClick={exportReport} />
              </TaskGroup>
            </motion.div>
          )}

          {/* 🎯 MILESTONES TAB */}
          {activeTab === 'milestones' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black uppercase">🎯 Milestones</h2>
                <button 
                  onClick={() => setShowNewMilestone(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-sm flex items-center gap-2"
                >
                  <Plus size={16}/> New Goal
                </button>
              </div>

              <div className="grid gap-6">
                {milestones.map(milestone => (
                  <motion.div 
                    key={milestone.id}
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    className={`p-6 rounded-[2rem] backdrop-blur-xl border ${milestone.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-black mb-2">{milestone.goal}</h3>
                        <div className="flex gap-4 text-sm text-slate-400">
                          <span>🎯 Target: {milestone.target} SC</span>
                          <span>📅 Deadline: {milestone.deadline}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleMilestone(milestone.id)}
                        className={`px-6 py-3 rounded-xl font-black uppercase text-sm ${milestone.completed ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'}`}
                      >
                        {milestone.completed ? '✅ Done' : 'Complete'}
                      </button>
                    </div>
                  </motion.div>
                ))}

                {milestones.length === 0 && (
                  <div className="text-center py-20 text-slate-500">
                    <Target size={64} className="mx-auto mb-4 opacity-20"/>
                    <p className="text-lg font-bold">No milestones yet. Create your first goal!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 📚 SYLLABUS TAB */}
          {activeTab === 'syllabus' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-8">
              <h2 className="text-4xl font-black uppercase">📚 GCE A/L Syllabus</h2>

              {Object.entries(SYLLABUS).map(([subjectId, subject]) => (
                <div key={subjectId} className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">{SUBJECTS.find(s => s.id === subjectId)?.emoji}</span>
                    <h3 className="text-2xl font-black uppercase">{subject.name}</h3>
                    <span className="ml-auto text-sm font-black text-blue-400">{getSubjectProgress(subjectId)}%</span>
                  </div>

                  <div className="space-y-6">
                    {subject.chapters.map(chapter => (
                      <div key={chapter.id} className="bg-black/20 p-6 rounded-2xl">
                        <h4 className="text-lg font-black mb-4 text-blue-400">{chapter.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {chapter.topics.map(topic => {
                            const isCompleted = completedTopics[subjectId]?.includes(topic);
                            return (
                              <button
                                key={topic}
                                onClick={() => toggleTopic(subjectId, topic)}
                                className={`p-4 rounded-xl text-left transition-all ${isCompleted ? 'bg-emerald-500/20 border-2 border-emerald-500' : 'bg-white/5 border-2 border-transparent hover:border-white/20'}`}
                              >
                                <div className="flex items-center gap-3">
                                  {isCompleted ? <CheckCircle size={18} className="text-emerald-400"/> : <Square size={18} className="text-slate-600"/>}
                                  <span className="text-sm font-bold">{topic}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 📊 ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black uppercase">📊 Analytics</h2>
                <button 
                  onClick={() => setShowAddMarkModal(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-sm flex items-center gap-2"
                >
                  <Plus size={16}/> Add Mark
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
                  <Trophy className="text-amber-400 mb-4" size={32}/>
                  <p className="text-4xl font-mono font-black text-amber-400">{sc}</p>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2">Total Credits</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
                  <Clock className="text-blue-400 mb-4" size={32}/>
                  <p className="text-4xl font-mono font-black text-blue-400">{totalHours}h</p>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2">Study Hours</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
                  <Flame className="text-orange-400 mb-4" size={32}/>
                  <p className="text-4xl font-mono font-black text-orange-400">{dailyStreak}</p>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2">Day Streak</p>
                </div>
              </div>

              {/* Overall Exam Performance */}
              {Object.keys(examMarks).length > 0 && (() => {
                const allMarks = Object.values(examMarks).flat();
                const overallAvg = allMarks.reduce((a, b) => a + b, 0) / allMarks.length;
                const totalExams = allMarks.length;
                const bestMark = Math.max(...allMarks);
                const aGrades = allMarks.filter(m => m >= 75).length;
                
                return (
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-blue-500/20">
                    <h3 className="text-2xl font-black mb-6 uppercase flex items-center gap-3">
                      <Award className="text-amber-400" size={32}/>
                      Overall Exam Performance
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-5xl font-mono font-black text-blue-400">{overallAvg.toFixed(1)}%</p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Average</p>
                      </div>
                      <div className="text-center">
                        <p className="text-5xl font-mono font-black text-emerald-400">{bestMark}%</p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Best Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-5xl font-mono font-black text-purple-400">{totalExams}</p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Total Exams</p>
                      </div>
                      <div className="text-center">
                        <p className="text-5xl font-mono font-black text-amber-400">{aGrades}</p>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">A Grades</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
                <h3 className="text-2xl font-black mb-6 uppercase">Subject Progress</h3>
                <div className="space-y-6">
                  {SUBJECTS.map(subj => (
                    <SubjectBar 
                      key={subj.id}
                      label={`${subj.emoji} ${subj.name}`}
                      percent={getSubjectProgress(subj.id)}
                      color={`bg-gradient-to-r from-blue-500 to-purple-500`}
                    />
                  ))}
                </div>
              </div>

              {/* Exam Marks Chart */}
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black uppercase">📊 Exam Marks Progress</h3>
                  <button 
                    onClick={() => setShowAddMarkModal(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-sm flex items-center gap-2"
                  >
                    <Plus size={16}/> Add Mark
                  </button>
                </div>
                
                {Object.keys(examMarks).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SUBJECTS.map(subj => {
                      const marks = examMarks[subj.name] || [];
                      if (marks.length === 0) return null;
                      
                      const avgMark = marks.reduce((a, b) => a + b, 0) / marks.length;
                      const maxMark = Math.max(...marks);
                      const minMark = Math.min(...marks);
                      const trend = marks.length > 1 ? marks[marks.length - 1] - marks[marks.length - 2] : 0;
                      
                      return (
                        <div key={subj.id} className="bg-black/40 p-6 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{subj.emoji}</span>
                            <div className="flex-1">
                              <h4 className="font-black">{subj.name}</h4>
                              <p className="text-xs text-slate-500">{marks.length} exams</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Average:</span>
                              <span className="font-black text-blue-400">{avgMark.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Best:</span>
                              <span className="font-black text-emerald-400">{maxMark}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Lowest:</span>
                              <span className="font-black text-orange-400">{minMark}%</span>
                            </div>
                            {marks.length > 1 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Trend:</span>
                                <span className={`font-black ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                  {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend).toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Mini Chart */}
                          <div className="h-24 flex items-end gap-1">
                            {marks.map((mark, idx) => (
                              <div 
                                key={idx}
                                className="flex-1 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t relative group"
                                style={{ height: `${mark}%` }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {mark}%
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-2 text-[9px] text-slate-500 font-bold">
                            <span>Exam 1</span>
                            <span>Exam {marks.length}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-500">
                    <BarChart3 size={64} className="mx-auto mb-4 opacity-20"/>
                    <p className="text-lg font-bold mb-2">No exam marks recorded yet</p>
                    <p className="text-sm mb-6">Start tracking your progress by adding your first exam mark!</p>
                    <button 
                      onClick={() => setShowAddMarkModal(true)}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-sm inline-flex items-center gap-2"
                    >
                      <Plus size={18}/> Add Your First Mark
                    </button>
                  </div>
                )}
              </div>

              {pastPapers.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
                  <h3 className="text-2xl font-black mb-6 uppercase">📄 Past Paper Results</h3>
                  <div className="space-y-4">
                    {pastPapers.map(paper => (
                      <div key={paper.id} className="flex justify-between items-center p-4 bg-black/20 rounded-xl">
                        <div>
                          <p className="font-black">{paper.subject} - {paper.year}</p>
                          <p className="text-xs text-slate-500">{paper.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-mono font-black text-emerald-400">{paper.score}%</p>
                          <p className="text-xs text-slate-500">{paper.timeSpent} mins</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ⏲️ FOCUS TAB */}
          {activeTab === 'focus' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-8">
              <h2 className="text-4xl font-black uppercase">⏲️ Focus Hub</h2>

              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 max-w-2xl mx-auto">
                <div className="flex justify-center gap-4 mb-8">
                  <button 
                    onClick={() => setFocusMode('timer')}
                    className={`px-8 py-4 rounded-2xl font-black uppercase text-sm transition-all ${focusMode === 'timer' ? 'bg-blue-600' : 'bg-white/5'}`}
                  >
                    Timer ⏱️
                  </button>
                  <button 
                    onClick={() => setFocusMode('stopwatch')}
                    className={`px-8 py-4 rounded-2xl font-black uppercase text-sm transition-all ${focusMode === 'stopwatch' ? 'bg-purple-600' : 'bg-white/5'}`}
                  >
                    Stopwatch ⏲️
                  </button>
                </div>

                <div className="text-center mb-8">
                  <p className="text-8xl font-mono font-black tabular-nums">
                    {focusMode === 'timer' ? formatTime(timeLeft) : formatTime(stopwatchTime)}
                  </p>
                  {pomodoroPhase !== 'work' && focusMode === 'timer' && (
                    <p className="text-sm font-black text-emerald-400 mt-4 uppercase">
                      {pomodoroPhase === 'short' ? '☕ Short Break' : '🎉 Long Break'} - Cycle {pomodoroCycle}
                    </p>
                  )}
                </div>

                <div className="flex justify-center gap-4 mb-8">
                  <button 
                    onClick={() => setIsActive(!isActive)}
                    className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black uppercase text-lg"
                  >
                    {isActive ? '⏸️ Pause' : '▶️ Start'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsActive(false);
                      if (focusMode === 'timer') {
                        setTimeLeft(pomodoroSettings.workTime * 60);
                        setPomodoroPhase('work');
                        setPomodoroCycle(0);
                      } else {
                        setStopwatchTime(0);
                      }
                    }}
                    className="px-12 py-5 bg-red-600 hover:bg-red-500 rounded-2xl font-black uppercase text-lg"
                  >
                    ↻ Reset
                  </button>
                </div>

                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => setShowPomodoroCustomizer(true)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black uppercase text-sm"
                  >
                    ⚙️ Pomodoro
                  </button>
                  
                  <button 
                    onClick={saveCurrentTimer}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-2xl font-black uppercase text-sm flex items-center gap-2"
                  >
                    <Save size={16}/> Save
                  </button>
                </div>

                {/* Saved Timers List */}
                {savedTimers.length > 0 && (
                  <div className="mt-8 space-y-2">
                    <h3 className="text-sm font-black uppercase text-center mb-4">💾 Saved Timers</h3>
                    {savedTimers.map(timer => (
                      <div
                        key={timer.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                      >
                        <div className="flex-1">
                          <p className="font-black">{timer.name}</p>
                          <p className="text-xs text-slate-500">{timer.type === 'timer' ? '⏱️ Timer' : '⏲️ Stopwatch'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-mono font-bold text-blue-400">{formatTime(timer.time)}</p>
                          <button
                            onClick={() => loadSavedTimer(timer)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-xs"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteSavedTimer(timer.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-xs"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {focusMode === 'timer' && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-sm font-black uppercase text-center">⏱️ Quick Timers</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: '5 min', time: 300 },
                        { label: '15 min', time: 900 },
                        { label: '25 min', time: 1500 },
                        { label: '30 min', time: 1800 },
                        { label: '45 min', time: 2700 },
                        { label: '60 min', time: 3600 }
                      ].map(preset => (
                        <button
                          key={preset.time}
                          onClick={() => {
                            setTimeLeft(preset.time);
                            setIsActive(false);
                          }}
                          className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 🎵 AUDIO TAB */}
          {activeTab === 'audio' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-8">
              <h2 className="text-4xl font-black uppercase">🎵 Audio Station</h2>

              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <p className="text-6xl mb-4">🎧</p>
                  <h3 className="text-2xl font-black mb-2">
                    {LOFI_LIBRARY.filter(t => unlockedTracks.includes(t.id))[currentTrackIdx]?.name || 'No Track'}
                  </h3>
                  <p className="text-sm text-slate-500">Lofi Hip Hop Radio</p>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                  <button onClick={prevTrack} className="p-4 bg-white/5 hover:bg-white/10 rounded-full">
                    <SkipBack size={24}/>
                  </button>
                  <button onClick={togglePlay} className="p-6 bg-blue-600 hover:bg-blue-500 rounded-full">
                    {isPlaying ? <Pause size={32}/> : <Play size={32}/>}
                  </button>
                  <button onClick={nextTrack} className="p-4 bg-white/5 hover:bg-white/10 rounded-full">
                    <SkipForward size={24}/>
                  </button>
                </div>

                <div className="space-y-3">
                  {LOFI_LIBRARY.map((track, idx) => {
                    const unlocked = unlockedTracks.includes(track.id);
                    return (
                      <button
                        key={track.id}
                        onClick={() => unlocked ? playTrack(idx) : buyItem(track.cost, track.id, 'track')}
                        className={`w-full flex justify-between items-center p-4 rounded-xl transition-all ${unlocked ? 'bg-white/10 hover:bg-white/15' : 'bg-black/40 hover:bg-black/60'}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{track.emoji}</span>
                          <span className="font-black text-sm">{track.name}</span>
                        </div>
                        <span className="text-xs font-black text-blue-400">
                          {unlocked ? (currentTrackIdx === idx && isPlaying ? '🔊 Playing' : '✅ Owned') : `${track.cost} SC 🔒`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* 🛒 STORE TAB */}
          {activeTab === 'store' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black uppercase">🛒 Scholar Store</h2>
                <div className="px-8 py-4 bg-emerald-600 rounded-2xl font-black text-2xl">
                  {sc} SC 💎
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <StoreCard title={<>🎨 Themes <Sparkles className="inline" size={16}/></>}>
                  {THEMES.map(theme => (
                    <StoreItem 
                      key={theme.id}
                      name={theme.name}
                      cost={theme.cost}
                      unlocked={unlockedThemes.includes(theme.id)}
                      onClick={() => buyItem(theme.cost, theme.id, 'theme')}
                    />
                  ))}
                </StoreCard>

                <StoreCard title={<>🎵 Audio Tracks <Music className="inline" size={16}/></>}>
                  {LOFI_LIBRARY.map(track => (
                    <StoreItem 
                      key={track.id}
                      name={`${track.emoji} ${track.name}`}
                      cost={track.cost}
                      unlocked={unlockedTracks.includes(track.id)}
                      onClick={() => buyItem(track.cost, track.id, 'track')}
                    />
                  ))}
                </StoreCard>

                <StoreCard title={<>👑 Prestige Titles <motion.span animate={{scale: [1, 1.1, 1]}} transition={{repeat: Infinity, duration: 1.5}}>✨</motion.span></>}>
                  {VIRTUAL_REWARDS.map(reward => (
                    <StoreItem 
                      key={reward.id}
                      name={
                        <span className="flex items-center gap-2">
                          <motion.span animate={{scale: [1, 1.15, 1]}} transition={{repeat: Infinity, duration: 2, delay: Math.random()}} className="text-lg">
                            {reward.emoji}
                          </motion.span>
                          {reward.name}
                        </span>
                      }
                      cost={reward.cost}
                      unlocked={unlockedRewards.includes(reward.id)}
                      onClick={() => buyItem(reward.cost, reward.id, 'virtual')}
                    />
                  ))}
                </StoreCard>

                <StoreCard title={<>🎁 Real World Rewards <Gift className="inline" size={16}/></>}>
                  <StoreItem name="☕ Coffee Break" cost={500} unlocked={unlockedBadges.includes('coffee')} onClick={() => buyItem(500, 'coffee', 'badge')} />
                  <StoreItem name="🍕 Pizza Party" cost={1000} unlocked={unlockedBadges.includes('pizza')} onClick={() => buyItem(1000, 'pizza', 'badge')} />
                  <StoreItem name="🎮 Gaming Session" cost={1500} unlocked={unlockedBadges.includes('game')} onClick={() => buyItem(1500, 'game', 'badge')} />
                  <StoreItem name="🎬 Movie Night" cost={2000} unlocked={unlockedBadges.includes('movie')} onClick={() => buyItem(2000, 'movie', 'badge')} />
                  <StoreItem name="🛍️ Shopping Spree" cost={5000} unlocked={unlockedBadges.includes('shop')} onClick={() => buyItem(5000, 'shop', 'badge')} />
                </StoreCard>
              </div>
            </motion.div>
          )}

          {/* 😊 MOOD TAB */}
          {activeTab === 'mood' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black uppercase">😊 Mood Tracker</h2>
                <button 
                  onClick={() => setShowMoodLog(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-sm flex items-center gap-2"
                >
                  <Plus size={16}/> Log Mood
                </button>
              </div>

              {moodHistory.length > 0 ? (
                <div className="grid gap-4">
                  {moodHistory.map((log, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{opacity: 0, x: -20}}
                      animate={{opacity: 1, x: 0}}
                      transition={{delay: idx * 0.05}}
                      className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">
                            {log.mood === 5 ? '😄' : log.mood === 4 ? '😊' : log.mood === 3 ? '😐' : log.mood === 2 ? '😕' : '😢'}
                          </span>
                          <div>
                            <p className="font-black">{log.subject}</p>
                            <p className="text-xs text-slate-500">{log.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-mono font-black text-emerald-400">{log.credits} SC</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500">
                  <Smile size={64} className="mx-auto mb-4 opacity-20"/>
                  <p className="text-lg font-bold">No mood logs yet. Track your first study session!</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ⚙️ ADVANCED TAB */}
          {activeTab === 'advanced' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-8">
              <h2 className="text-4xl font-black uppercase">⚙️ Advanced Settings</h2>

              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
                <h3 className="text-2xl font-black mb-6">Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2 block">Display Name</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
                <h3 className="text-2xl font-black mb-6">🎬 Exam Time Simulator</h3>
                <p className="text-sm text-slate-400 mb-6">Simulate exam conditions with a 3-hour countdown timer</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => setSimMode(!simMode)}
                    className={`px-8 py-4 rounded-2xl font-black uppercase text-sm ${simMode ? 'bg-emerald-600' : 'bg-white/10'}`}
                  >
                    {simMode ? '✅ Enabled' : 'Enable Simulator'}
                  </button>
                  
                  {simMode && (
                    <div className="flex-1 text-center">
                      <p className="text-6xl font-mono font-black tabular-nums text-red-400">
                        {formatTime(simTime)}
                      </p>
                      <div className="flex gap-4 justify-center mt-4">
                        <button 
                          onClick={() => setSimActive(!simActive)}
                          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-black uppercase"
                        >
                          {simActive ? 'Pause' : 'Start'}
                        </button>
                        <button 
                          onClick={() => {
                            setSimActive(false);
                            setSimTime(10800);
                          }}
                          className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-black uppercase"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
                <h3 className="text-2xl font-black mb-6">📊 Data Management</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={exportReport}
                    className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-2"
                  >
                    <Download size={18}/> Export Data
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('⚠️ This will delete all your progress. Are you sure?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-black uppercase text-sm"
                  >
                    Reset All Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* 🎨 THEME CUSTOMIZER MODAL */}
      <AnimatePresence>
        {showThemeCustomizer && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={() => setShowThemeCustomizer(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-3xl font-black uppercase text-center">🎨 Theme Customizer</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Primary Color</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color"
                      value={customColors.primary}
                      onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                      className="w-16 h-16 rounded-xl cursor-pointer border-2 border-white/20"
                    />
                    <input 
                      type="text"
                      value={customColors.primary}
                      onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                      className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Secondary Color</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color"
                      value={customColors.secondary}
                      onChange={(e) => setCustomColors({...customColors, secondary: e.target.value})}
                      className="w-16 h-16 rounded-xl cursor-pointer border-2 border-white/20"
                    />
                    <input 
                      type="text"
                      value={customColors.secondary}
                      onChange={(e) => setCustomColors({...customColors, secondary: e.target.value})}
                      className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Accent Color</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color"
                      value={customColors.accent}
                      onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                      className="w-16 h-16 rounded-xl cursor-pointer border-2 border-white/20"
                    />
                    <input 
                      type="text"
                      value={customColors.accent}
                      onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                      className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="bg-black/40 p-6 rounded-2xl">
                  <p className="text-xs font-black uppercase text-slate-400 mb-3">Preview</p>
                  <div className="flex gap-3">
                    <div className="flex-1 h-12 rounded-xl" style={{backgroundColor: customColors.primary}}></div>
                    <div className="flex-1 h-12 rounded-xl" style={{backgroundColor: customColors.secondary}}></div>
                    <div className="flex-1 h-12 rounded-xl" style={{backgroundColor: customColors.accent}}></div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setShowThemeCustomizer(false);
                  confetti({ particleCount: 100, spread: 70 });
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-black uppercase hover:scale-105 transition-transform"
              >
                Save Theme ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🍅 POMODORO CUSTOMIZER MODAL */}
      <AnimatePresence>
        {showPomodoroCustomizer && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={() => setShowPomodoroCustomizer(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-3xl font-black uppercase text-center">🍅 Pomodoro Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Work Time (minutes)</label>
                  <input 
                    type="number"
                    value={pomodoroSettings.workTime}
                    onChange={(e) => setPomodoroSettings({...pomodoroSettings, workTime: Number(e.target.value)})}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black text-center text-2xl focus:border-purple-500 focus:outline-none"
                    min="1"
                    max="120"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Short Break (minutes)</label>
                  <input 
                    type="number"
                    value={pomodoroSettings.shortBreak}
                    onChange={(e) => setPomodoroSettings({...pomodoroSettings, shortBreak: Number(e.target.value)})}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black text-center text-2xl focus:border-purple-500 focus:outline-none"
                    min="1"
                    max="30"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Long Break (minutes)</label>
                  <input 
                    type="number"
                    value={pomodoroSettings.longBreak}
                    onChange={(e) => setPomodoroSettings({...pomodoroSettings, longBreak: Number(e.target.value)})}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black text-center text-2xl focus:border-purple-500 focus:outline-none"
                    min="1"
                    max="60"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Cycles before long break</label>
                  <input 
                    type="number"
                    value={pomodoroSettings.cycles}
                    onChange={(e) => setPomodoroSettings({...pomodoroSettings, cycles: Number(e.target.value)})}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-black text-center text-2xl focus:border-purple-500 focus:outline-none"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setShowPomodoroCustomizer(false);
                  setTimeLeft(pomodoroSettings.workTime * 60);
                  setPomodoroPhase('work');
                  setPomodoroCycle(0);
                  confetti({ particleCount: 100, spread: 70 });
                }}
                className="w-full py-4 bg-purple-600 rounded-2xl font-black uppercase hover:bg-purple-500"
              >
                Save Settings ✅
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💾 SAVE TIMER MODAL */}
      <AnimatePresence>
        {showSaveTimerModal && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={() => setShowSaveTimerModal(false)}
          >
            <motion.div 
              initial={{scale: 0.8}}
              animate={{scale: 1}}
              exit={{scale: 0.8}}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-2xl font-black uppercase text-center">💾 Save Timer</h2>
              
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Timer Name</label>
                <input 
                  type="text"
                  value={timerName}
                  onChange={(e) => setTimerName(e.target.value)}
                  placeholder="e.g., Deep Focus Session"
                  className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && confirmSaveTimer()}
                />
              </div>

              <div className="bg-black/40 p-4 rounded-xl">
                <p className="text-sm text-slate-400 mb-2">Saving:</p>
                <p className="font-mono font-black text-2xl text-blue-400">
                  {formatTime(focusMode === 'timer' ? timeLeft : stopwatchTime)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {focusMode === 'timer' ? '⏱️ Timer' : '⏲️ Stopwatch'}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSaveTimerModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmSaveTimer}
                  className="flex-1 py-4 bg-emerald-600 rounded-2xl font-black uppercase hover:bg-emerald-500"
                >
                  Save ✅
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎯 NEW MILESTONE MODAL */}
      <AnimatePresence>
        {showNewMilestone && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={() => setShowNewMilestone(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-3xl font-black uppercase text-center">🎯 New Milestone</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Goal</label>
                  <input 
                    type="text"
                    value={newMilestone.goal}
                    onChange={(e) => setNewMilestone({...newMilestone, goal: e.target.value})}
                    placeholder="e.g., Complete Physics Syllabus"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Target SC</label>
                  <input 
                    type="number"
                    value={newMilestone.target}
                    onChange={(e) => setNewMilestone({...newMilestone, target: e.target.value})}
                    placeholder="500"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Deadline</label>
                  <input 
                    type="date"
                    value={newMilestone.deadline}
                    onChange={(e) => setNewMilestone({...newMilestone, deadline: e.target.value})}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowNewMilestone(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={addMilestone}
                  className="flex-1 py-4 bg-blue-600 rounded-2xl font-black uppercase hover:bg-blue-500"
                >
                  Create Goal ✨
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 😊 MOOD LOG MODAL */}
      <AnimatePresence>
        {showMoodLog && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={() => setShowMoodLog(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-3xl font-black uppercase text-center">😊 Log Your Mood</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 block">How are you feeling?</label>
                  <div className="flex justify-around">
                    {[
                      { value: 5, emoji: '😄', label: 'Great' },
                      { value: 4, emoji: '😊', label: 'Good' },
                      { value: 3, emoji: '😐', label: 'Okay' },
                      { value: 2, emoji: '😕', label: 'Meh' },
                      { value: 1, emoji: '😢', label: 'Bad' }
                    ].map(mood => (
                      <button
                        key={mood.value}
                        onClick={() => setCurrentMood(mood.value)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${currentMood === mood.value ? 'bg-blue-600 scale-110' : 'bg-white/5 hover:bg-white/10'}`}
                      >
                        <span className="text-3xl">{mood.emoji}</span>
                        <span className="text-xs font-bold">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Subject</label>
                  <select
                    value={moodSubject}
                    onChange={(e) => setMoodSubject(e.target.value)}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select subject...</option>
                    {SUBJECTS.map(subj => (
                      <option key={subj.id} value={subj.name}>{subj.emoji} {subj.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">SC Earned</label>
                  <input 
                    type="number"
                    value={moodCredits}
                    onChange={(e) => setMoodCredits(e.target.value)}
                    placeholder="50"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowMoodLog(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={addMoodLog}
                  className="flex-1 py-4 bg-blue-600 rounded-2xl font-black uppercase hover:bg-blue-500"
                >
                  Log Mood ✅
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📄 ADD PAST PAPER MODAL */}
      <AnimatePresence>
        {showPaperModal && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={() => setShowPaperModal(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-3xl font-black uppercase text-center">📄 Add Past Paper</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Subject</label>
                  <select
                    value={newPaper.subject}
                    onChange={(e) => setNewPaper({...newPaper, subject: e.target.value})}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select subject...</option>
                    {SUBJECTS.map(subj => (
                      <option key={subj.id} value={subj.name}>{subj.emoji} {subj.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Year</label>
                  <input 
                    type="text"
                    value={newPaper.year}
                    onChange={(e) => setNewPaper({...newPaper, year: e.target.value})}
                    placeholder="2024"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Score (%)</label>
                  <input 
                    type="number"
                    value={newPaper.score}
                    onChange={(e) => setNewPaper({...newPaper, score: e.target.value})}
                    placeholder="85"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Time Spent (minutes)</label>
                  <input 
                    type="number"
                    value={newPaper.timeSpent}
                    onChange={(e) => setNewPaper({...newPaper, timeSpent: e.target.value})}
                    placeholder="180"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPaperModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={addPastPaper}
                  className="flex-1 py-4 bg-blue-600 rounded-2xl font-black uppercase hover:bg-blue-500"
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
            onClick={() => setShowMotivation(false)}
          >
            <motion.div 
              initial={{scale: 0.5, rotate: -10}}
              animate={{scale: 1, rotate: 0}}
              exit={{scale: 0.5, rotate: 10}}
              onClick={(e) => e.stopPropagation()}
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
              <p className="text-xl italic">&ldquo;{currentQuote}&rdquo;</p>
              <p className="text-sm font-black">You've earned {lastUnlockAt} total credits! 🏆</p>
              <button 
                onClick={() => setShowMotivation(false)}
                className="w-full py-5 bg-white text-purple-600 font-black uppercase text-lg rounded-2xl hover:scale-105 transition-transform"
              >
                Keep Going! 💪
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📊 ADD EXAM MARK MODAL */}
      <AnimatePresence>
        {showAddMarkModal && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={() => setShowAddMarkModal(false)}
          >
            <motion.div 
              initial={{scale: 0.8, y: 50}}
              animate={{scale: 1, y: 0}}
              exit={{scale: 0.8, y: 50}}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] max-w-md w-full space-y-6"
            >
              <h2 className="text-3xl font-black uppercase text-center">📊 Add Exam Mark</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select subject...</option>
                    {SUBJECTS.map(subj => (
                      <option key={subj.id} value={subj.name}>{subj.emoji} {subj.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Mark (%)</label>
                  <input 
                    type="number"
                    value={newMark}
                    onChange={(e) => setNewMark(e.target.value)}
                    placeholder="85"
                    className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white font-bold focus:border-blue-500 focus:outline-none text-center text-3xl"
                    min="0"
                    max="100"
                  />
                  <div className="flex justify-between mt-2 px-2">
                    <span className="text-xs text-slate-500">0%</span>
                    <span className="text-xs text-slate-500">100%</span>
                  </div>
                </div>

                {/* Grade Preview */}
                {newMark && (
                  <div className="bg-black/40 p-6 rounded-2xl text-center">
                    <p className="text-xs font-black uppercase text-slate-400 mb-2">Grade</p>
                    <p className="text-5xl font-black">
                      {parseInt(newMark) >= 75 ? (
                        <span className="text-emerald-400">A</span>
                      ) : parseInt(newMark) >= 65 ? (
                        <span className="text-blue-400">B</span>
                      ) : parseInt(newMark) >= 55 ? (
                        <span className="text-purple-400">C</span>
                      ) : parseInt(newMark) >= 45 ? (
                        <span className="text-orange-400">S</span>
                      ) : (
                        <span className="text-red-400">W</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setShowAddMarkModal(false);
                    setSelectedSubject('');
                    setNewMark('');
                  }}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase hover:bg-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={addExamMark}
                  className="flex-1 py-4 bg-blue-600 rounded-2xl font-black uppercase hover:bg-blue-500"
                >
                  Add Mark ✅
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎁 DAILY BONUS MODAL */}
      <AnimatePresence>
        {showBonusModal && (
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
            onClick={() => setShowBonusModal(false)}
          >
            <motion.div 
              initial={{scale: 0.8, rotate: -5}}
              animate={{scale: 1, rotate: 0}}
              exit={{scale: 0.8, rotate: 5}}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-amber-500 to-orange-500 p-12 rounded-[3rem] max-w-md text-center space-y-6 shadow-2xl"
            >
              <motion.div
                animate={{rotate: [0, 10, -10, 0]}}
                transition={{repeat: Infinity, duration: 2}}
                className="text-8xl"
              >
                🎁
              </motion.div>
              <h2 className="text-3xl font-black uppercase text-white">Daily Bonus!</h2>
              <div className="bg-white/20 p-6 rounded-2xl">
                <p className="text-6xl font-mono font-black text-white">{50 + (dailyStreak * 10)} SC</p>
                <p className="text-sm font-bold text-white/80 mt-2">🔥 {dailyStreak} Day Streak</p>
              </div>
              <button 
                onClick={claimDailyBonus}
                className="w-full py-5 bg-white text-amber-600 font-black uppercase text-lg rounded-2xl hover:scale-105 transition-transform"
                disabled={lastClaimDate === new Date().toDateString()}
              >
                {lastClaimDate === new Date().toDateString() ? '✅ Claimed Today' : 'Claim Bonus! 🎉'}
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
             <button onClick={() => setIsGhostMode(false)} className="mt-12 text-white/20 hover:text-white uppercase text-[10px] font-black tracking-[0.5em]">[ ESCAPE GHOST PROTOCOL ]</button>
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