// src/config/worlds.config.js
export const WORLDS = [
  { id: 0, name: 'Pizza Party Stand',        emoji: '🍕', accent: '#ff6f61',
    description: 'Convert tenths fractions to decimals',
    skillFocus: 'Tenths → Decimals',
    boss: { name: 'Stand Boss',      emoji: '🍕', reward: 'Pizza Badge 🍕' } },
  { id: 1, name: 'Lemonade Stand',           emoji: '🍋', accent: '#ffca28',
    description: 'Convert decimals back to tenths fractions',
    skillFocus: 'Decimals → Tenths',
    boss: { name: 'Squeeze Boss',    emoji: '🍋', reward: 'Lemonade Badge 🍋' } },
  { id: 2, name: 'Mosaic Art Studio',        emoji: '🎨', accent: '#ab47bc',
    description: 'Convert hundredths fractions to decimals',
    skillFocus: 'Hundredths → Decimals',
    boss: { name: 'Mosaic Boss',     emoji: '🖼️', reward: 'Artist Badge 🎨' } },
  { id: 3, name: "Coin Collector's Club",    emoji: '🪙', accent: '#66bb6a',
    description: 'Convert decimals back to hundredths fractions',
    skillFocus: 'Decimals → Hundredths',
    boss: { name: 'Coin Boss',       emoji: '🪙', reward: 'Collector Badge 🪙' } },
  { id: 4, name: 'Recipe Kitchen',           emoji: '🍰', accent: '#ec407a',
    description: 'Match common fractions to their decimal equivalents',
    skillFocus: 'Equivalent Fractions',
    boss: { name: 'Chef Boss',       emoji: '👨‍🍳', reward: 'Kitchen Badge 🍰' } },
  { id: 5, name: 'Robot Circuit Lab',        emoji: '🤖', accent: '#29b6f6',
    description: 'Identify tenths and hundredths place values',
    skillFocus: 'Place Value',
    boss: { name: 'Circuit Boss',    emoji: '⚙️', reward: 'Robotics Badge 🤖' } },
  { id: 6, name: 'Race Track Timing',        emoji: '🏁', accent: '#5c6bc0',
    description: 'Compare decimals to find the fastest times',
    skillFocus: 'Comparing Decimals',
    boss: { name: 'Finish-Line Boss', emoji: '🏁', reward: 'Racer Badge 🏁' } },
  { id: 7, name: 'Treasure Map Trail',       emoji: '🗺️', accent: '#c0ca33',
    description: 'Follow decimal number patterns to the treasure',
    skillFocus: 'Decimal Patterns',
    boss: { name: 'Map Boss',        emoji: '🧭', reward: 'Explorer Badge 🗺️' } },
  { id: 8, name: 'Grand School Fair',        emoji: '🎡', accent: '#283593',
    description: 'Mixed review of every decimal skill across the fair',
    skillFocus: 'Mixed Review',
    boss: { name: 'Fair Champion',   emoji: '🎪', reward: 'Fair Badge 🎡' } },
  { id: 9, name: "Owl's Decimal Observatory", emoji: '🔭', accent: '#00bcd4',
    description: "Master every decimal-fraction conversion at Tally's observatory",
    skillFocus: 'Mastery Challenge',
    boss: { name: 'Grand Master Owl', emoji: '👑', reward: 'Decimal Master Badge 👑' } },
];

// ── Play modes (within each world) ──
export const PLAY_MODES = [
  {
    id: 'guided',
    name: 'Guided Practice',
    icon: '🧭',
    desc: '5 questions with hints, no time pressure',
    questionCount: 5,
    hints: true,
    timed: false,
    lives: false,
  },
  {
    id: 'independent',
    name: 'Independent Practice',
    icon: '✍️',
    desc: '10 questions, no hints, full XP',
    questionCount: 10,
    hints: false,
    timed: false,
    lives: false,
  },
  {
    id: 'timed',
    name: 'Timed Challenge',
    icon: '⏱️',
    desc: '8 questions in 60 seconds, bonus XP',
    questionCount: 8,
    hints: false,
    timed: true,
    timeLimit: 60,
    lives: false,
  },
  {
    id: 'boss',
    name: 'Boss Battle',
    icon: '👑',
    desc: '5 questions, 3 lives — defeat the boss!',
    questionCount: 5,
    hints: false,
    timed: false,
    lives: true,
  },
];

// ── Badges ──
export const BADGES = [
  { id: 'first_fact',        name: 'First Conversion',    icon: '🏅', desc: 'First correct decimal-fraction answer' },
  { id: 'hot_streak',        name: 'Hot Streak',          icon: '🔥', desc: '5 consecutive correct' },
  { id: 'grid_master',  name: 'Grid Master',         icon: '🥈', desc: 'Completed Simulate' },
  { id: 'decimal_master', name: 'Decimal Master',  icon: '🥇', desc: '80%+ correct overall' },
  { id: 'perfect_score',     name: 'Perfect World',       icon: '💎', desc: 'A perfect world score' },
  { id: 'boss_slayer',       name: 'Boss Slayer',         icon: '👑', desc: 'Defeated a boss battle' },
  { id: 'full_journey',      name: 'Full Journey',        icon: '🌟', desc: 'Completed every phase' },
];

// ── XP economy ──
export const XP_REWARDS = {
  CORRECT: 10,
  STREAK_BONUS: 15, // on 5+ streak (replaces base)
  STATION_COMPLETE: 20,
  WORLD_COMPLETE: 50,
  BOSS_WIN: 100,
};

// ── Common fraction/decimal equivalents this module covers (MOE P4 scope) ──
export const EQUIV_FRACTIONS = [
  { num: 1, den: 2,  dec: '0.5' },
  { num: 1, den: 4,  dec: '0.25' },
  { num: 3, den: 4,  dec: '0.75' },
  { num: 1, den: 5,  dec: '0.2' },
  { num: 2, den: 5,  dec: '0.4' },
  { num: 3, den: 5,  dec: '0.6' },
  { num: 4, den: 5,  dec: '0.8' },
  { num: 1, den: 20, dec: '0.05' },
  { num: 3, den: 20, dec: '0.15' },
  { num: 1, den: 25, dec: '0.04' },
  { num: 1, den: 50, dec: '0.02' },
];
