// src/core/questions/questionBank.js
// Procedural question generator — 100 questions, 10 types, 10 worlds
// Decimals Using Convert Fractions (DecimalQuest) — Grade 4
import { BADGES, EQUIV_FRACTIONS } from '../../config/worlds.config.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Formats an integer 1-99 as a hundredths decimal string, always keeping
// the leading zero for single-digit numerators (6 -> "0.06", 23 -> "0.23").
// This IS the classic Grade 4 misconception this module targets directly.
function formatHundredths(n) {
  return n < 10 ? `0.0${n}` : `0.${n}`;
}

// Builds a deduplicated 4-option array: correct answer + as many of the
// given (pedagogically-meaningful) candidate distractors as are unique,
// topped up with fallbackGen() if candidates run short or collide.
function buildOptions(correct, candidates, fallbackGen) {
  const set = new Set([correct]);
  for (const c of candidates) {
    if (set.size >= 4) break;
    if (c !== correct) set.add(c);
  }
  let guard = 0;
  while (set.size < 4 && guard < 50) { set.add(fallbackGen()); guard++; }
  return shuffleArray([...set]);
}

const englishNames = ['Emma', 'James', 'Oliver', 'Mia', 'Lucas', 'Ethan', 'Noah',
  'Ava', 'Sophie', 'Grace', 'Henry', 'Lily', 'Jack', 'Chloe', 'Ravi', 'Ella'];

// Q1: Tenths fraction → decimal
function genQ1(id, diff) {
  const n = randInt(1, 9);
  const correct = `0.${n}`;
  const candidates = [
    `0.0${n}`,                          // place-value swap: treats tenths as hundredths
    `${n}.0`,                           // whole-number confusion
    `0.${n === 9 ? n - 1 : n + 1}`,      // off-by-one
  ];
  const options = buildOptions(correct, candidates, () => `0.${randInt(1, 9)}`);
  return {
    id, type: 'fracToDecTenths', world: 0, difficulty: diff,
    numerator: n, denominator: 10, decimalValue: correct,
    questionText: `Convert the fraction ${n}/10 to a decimal.`,
    visual: 'tenthsGrid',
    hint1: `${n}/10 means ${n} tenths.`,
    hint2: `Write ${n} tenths as 0.${n}.`,
    explanation: `${n}/10 = ${correct}`,
    options, correctAnswer: correct,
  };
}

// Q2: Decimal → tenths fraction
function genQ2(id, diff) {
  const n = randInt(1, 9);
  const decimal = `0.${n}`;
  const correct = `${n}/10`;
  const candidates = [
    `${n}/100`,                                  // wrong denominator
    `${Math.max(1, n - 1)}/10`,                   // off-by-one
    `${Math.min(9, n + 1)}/10`,
  ];
  const options = buildOptions(correct, candidates, () => `${randInt(1, 9)}/10`);
  return {
    id, type: 'decToFracTenths', world: 0, difficulty: diff,
    numerator: n, denominator: 10, decimalValue: decimal,
    questionText: `Write ${decimal} as a fraction.`,
    visual: 'tenthsGrid',
    hint1: `${decimal} means ${n} tenths.`,
    hint2: 'Tenths are written as a fraction over 10.',
    explanation: `${decimal} = ${correct}`,
    options, correctAnswer: correct,
  };
}

// Q3: Hundredths fraction → decimal
function genQ3(id, diff) {
  const n = randInt(1, 99);
  const correct = formatHundredths(n);
  const candidates = [];
  if (n < 10) candidates.push(`0.${n}`);                                  // dropped the leading zero
  else candidates.push(`${Math.floor(n / 10)}.${n % 10}`);                 // whole-number confusion
  const offOne = n === 99 ? n - 1 : n + 1;
  candidates.push(formatHundredths(offOne));
  const offTen = n > 10 ? n - 10 : Math.min(99, n + 10);
  candidates.push(formatHundredths(offTen));
  const options = buildOptions(correct, candidates, () => formatHundredths(randInt(1, 99)));
  return {
    id, type: 'fracToDecHundredths', world: 0, difficulty: diff,
    numerator: n, denominator: 100, decimalValue: correct,
    questionText: `Convert the fraction ${n}/100 to a decimal.`,
    visual: 'hundredthsGrid',
    hint1: `${n}/100 means ${n} hundredths.`,
    hint2: n < 10 ? `Since ${n} is less than 10, add a zero: 0.0${n}.` : `Write ${n} hundredths as 0.${n}.`,
    explanation: `${n}/100 = ${correct}`,
    options, correctAnswer: correct,
  };
}

// Q4: Decimal → hundredths fraction
function genQ4(id, diff) {
  const n = randInt(1, 99);
  const decimal = formatHundredths(n);
  const correct = `${n}/100`;
  const candidates = [`${n}/10`, `${Math.max(1, n - 1)}/100`, `${Math.min(99, n + 1)}/100`];
  if (n < 10) candidates.push(`${n}0/100`); // classic "shift the digits" error
  const options = buildOptions(correct, candidates, () => `${randInt(1, 99)}/100`);
  return {
    id, type: 'decToFracHundredths', world: 0, difficulty: diff,
    numerator: n, denominator: 100, decimalValue: decimal,
    questionText: `Write ${decimal} as a fraction out of 100.`,
    visual: 'hundredthsGrid',
    hint1: `${decimal} means ${n} hundredths.`,
    hint2: 'Hundredths are written as a fraction over 100.',
    explanation: `${decimal} = ${correct}`,
    options, correctAnswer: correct,
  };
}

// Q5: Common equivalent fraction → decimal (halves, quarters, fifths, etc.)
function genQ5(id, diff) {
  const { num, den, dec } = pick(EQUIV_FRACTIONS);
  const correct = dec;
  const cents = Math.round(parseFloat(dec) * 100);
  const offsets = shuffleArray([1, -1, 5, -5, 10, -10]);
  const candidates = offsets.map(o => formatHundredths(Math.min(99, Math.max(1, cents + o))));
  const options = buildOptions(correct, candidates, () => formatHundredths(randInt(1, 99)));
  return {
    id, type: 'equivFracDecimal', world: 0, difficulty: diff,
    numerator: num, denominator: den, decimalValue: correct,
    questionText: `${num}/${den} is equivalent to which decimal?`,
    visual: 'fractionCard',
    hint1: `Think about what ${num}/${den} equals out of 100.`,
    hint2: `${num}/${den} = ${cents}/100`,
    explanation: `${num}/${den} = ${correct}`,
    options, correctAnswer: correct,
  };
}

// Q6: Decimal place value — identify the tenths or hundredths digit
function genQ6(id, diff) {
  const whole = randInt(0, 9);
  const tenths = randInt(0, 9);
  const hundredths = randInt(0, 9);
  const askPlace = pick(['tenths', 'hundredths']);
  const correct = String(askPlace === 'tenths' ? tenths : hundredths);
  const decimalStr = `${whole}.${tenths}${hundredths}`;
  const otherDigits = new Set([String(whole), String(tenths), String(hundredths)]);
  otherDigits.delete(correct);
  const candidates = [...otherDigits, String(randInt(0, 9)), String(randInt(0, 9))];
  const options = buildOptions(correct, candidates, () => String(randInt(0, 9)));
  return {
    id, type: 'placeValueIdentify', world: 0, difficulty: diff,
    decimalValue: decimalStr, askPlace, whole, tenths, hundredths,
    questionText: `In the decimal ${decimalStr}, what digit is in the ${askPlace} place?`,
    visual: 'placeValueChart',
    hint1: askPlace === 'tenths' ? 'The tenths place is the first digit after the decimal point.' : 'The hundredths place is the second digit after the decimal point.',
    hint2: `${decimalStr} → ${whole} ones, ${tenths} tenths, ${hundredths} hundredths.`,
    explanation: `In ${decimalStr}, the ${askPlace} digit is ${correct}.`,
    options, correctAnswer: correct,
  };
}

// Q7: Compare four decimals — find the greatest or smallest
function genQ7(id, diff) {
  const vals = new Set();
  while (vals.size < 4) vals.add(randInt(1, 99));
  const arr = [...vals];
  const decimals = arr.map(formatHundredths);
  const wantMax = Math.random() > 0.5;
  const targetVal = wantMax ? Math.max(...arr) : Math.min(...arr);
  const correct = formatHundredths(targetVal);
  return {
    id, type: 'compareDecimals', world: 0, difficulty: diff, decimalValue: correct,
    questionText: `Which decimal is the ${wantMax ? 'greatest' : 'smallest'}?`,
    visual: 'none',
    hint1: 'Compare the tenths digit first, then the hundredths digit.',
    hint2: wantMax ? 'Look for the largest tenths digit.' : 'Look for the smallest tenths digit.',
    explanation: `${correct} is the ${wantMax ? 'greatest' : 'smallest'} of the four.`,
    options: shuffleArray(decimals), correctAnswer: correct,
  };
}

// Q8: Decimal pattern — what comes next
function genQ8(id, diff) {
  const stepTenths = pick([1, 2]);
  const maxStart = stepTenths === 2 ? 3 : 6;
  const startTenths = randInt(0, maxStart);
  const t = [startTenths, startTenths + stepTenths, startTenths + 2 * stepTenths, startTenths + 3 * stepTenths];
  const seqStrs = t.map(x => `0.${x}`);
  const correct = seqStrs[3];
  const offCandidates = [-1, 1, -2, 2].map(o => `0.${Math.min(9, Math.max(0, t[3] + o))}`);
  const options = buildOptions(correct, offCandidates, () => `0.${randInt(0, 9)}`);
  return {
    id, type: 'sequencePattern', world: 0, difficulty: diff, decimalValue: correct,
    questionText: `What comes next in the pattern: ${seqStrs[0]}, ${seqStrs[1]}, ${seqStrs[2]}, ___?`,
    visual: 'sequenceStrip', sequenceTerms: seqStrs.slice(0, 3), stepTenths,
    hint1: `Each step increases by ${stepTenths === 1 ? 'one tenth (0.1)' : 'two tenths (0.2)'}.`,
    hint2: `${seqStrs[2]} + 0.${stepTenths} = ?`,
    explanation: `The pattern adds 0.${stepTenths} each time, so the next term is ${correct}.`,
    options, correctAnswer: correct,
  };
}

// Q9: True / False — a fraction-to-decimal statement, sometimes altered
function genQ9(id, diff) {
  const useHundredths = Math.random() > 0.5;
  const n = useHundredths ? randInt(1, 99) : randInt(1, 9);
  const den = useHundredths ? 100 : 10;
  const trueDecimal = useHundredths ? formatHundredths(n) : `0.${n}`;
  const isTrue = Math.random() > 0.5;
  let displayedDecimal = trueDecimal;
  if (!isTrue) {
    if (useHundredths && n < 10) displayedDecimal = `0.${n}`;                          // dropped zero
    else if (!useHundredths) displayedDecimal = `0.0${n}`;                              // wrongly padded
    else displayedDecimal = formatHundredths(n === 99 ? n - 1 : n + 1);                 // off-by-one
  }
  return {
    id, type: 'trueFalseDecFrac', world: 0, difficulty: diff,
    numerator: n, denominator: den, decimalValue: displayedDecimal,
    questionText: `True or False: ${n}/${den} = ${displayedDecimal}`,
    visual: useHundredths ? 'hundredthsGrid' : 'tenthsGrid',
    hint1: `Convert ${n}/${den} to a decimal and compare.`,
    hint2: `${n}/${den} actually equals ${trueDecimal}.`,
    explanation: `${n}/${den} = ${trueDecimal}, so the statement is ${isTrue ? 'True ✓' : 'False ✗'}.`,
    options: ['True', 'False'], correctAnswer: isTrue ? 'True' : 'False',
  };
}

// Q10: Mixed review — rotates through the other formats at higher difficulty, fuels Boss Battle
function genQ10(id, diff) {
  const variant = pick(['tenths', 'hundredths', 'compare', 'placeValue']);
  const name = pick(englishNames);

  if (variant === 'tenths') {
    const n = randInt(1, 9);
    const correct = `0.${n}`;
    const options = buildOptions(correct, [`0.0${n}`, `${n}.0`, `0.${n === 9 ? n - 1 : n + 1}`], () => `0.${randInt(1, 9)}`);
    return {
      id, type: 'mixedReviewBoss', world: 0, difficulty: diff,
      numerator: n, denominator: 10, decimalValue: correct,
      questionText: `Boss Challenge: ${name} says ${n}/10 of the pizza is left. Write that as a decimal.`,
      visual: 'mixed', mixedVisual: 'tenthsGrid',
      hint1: `${n}/10 = ${n} tenths.`, hint2: `Write as 0.${n}.`,
      explanation: `${n}/10 = ${correct}`, options, correctAnswer: correct,
    };
  }
  if (variant === 'hundredths') {
    const n = randInt(1, 99);
    const correct = formatHundredths(n);
    const alt = n < 10 ? `0.${n}` : `${Math.floor(n / 10)}.${n % 10}`;
    const options = buildOptions(correct, [alt, formatHundredths(n === 99 ? n - 1 : n + 1)], () => formatHundredths(randInt(1, 99)));
    return {
      id, type: 'mixedReviewBoss', world: 0, difficulty: diff,
      numerator: n, denominator: 100, decimalValue: correct,
      questionText: `Boss Challenge: Convert ${n}/100 to a decimal.`,
      visual: 'mixed', mixedVisual: 'hundredthsGrid',
      hint1: `${n}/100 = ${n} hundredths.`, hint2: n < 10 ? `Add a zero: 0.0${n}.` : `Write as 0.${n}.`,
      explanation: `${n}/100 = ${correct}`, options, correctAnswer: correct,
    };
  }
  if (variant === 'compare') {
    const vals = new Set();
    while (vals.size < 4) vals.add(randInt(1, 99));
    const arr = [...vals];
    const decimals = arr.map(formatHundredths);
    const target = Math.max(...arr);
    const correct = formatHundredths(target);
    return {
      id, type: 'mixedReviewBoss', world: 0, difficulty: diff, decimalValue: correct,
      questionText: 'Boss Challenge: Which decimal is the greatest?',
      visual: 'mixed', mixedVisual: 'none',
      hint1: 'Compare tenths digits first.', hint2: 'Then compare hundredths digits.',
      explanation: `${correct} is the greatest.`,
      options: shuffleArray(decimals), correctAnswer: correct,
    };
  }
  // placeValue
  const whole = randInt(0, 9), tenths = randInt(0, 9), hundredths = randInt(0, 9);
  const askPlace = pick(['tenths', 'hundredths']);
  const correct = String(askPlace === 'tenths' ? tenths : hundredths);
  const decimalStr = `${whole}.${tenths}${hundredths}`;
  const otherDigits = new Set([String(whole), String(tenths), String(hundredths)]);
  otherDigits.delete(correct);
  const options = buildOptions(correct, [...otherDigits, String(randInt(0, 9))], () => String(randInt(0, 9)));
  return {
    id, type: 'mixedReviewBoss', world: 0, difficulty: diff,
    decimalValue: decimalStr, askPlace, whole, tenths, hundredths,
    questionText: `Boss Challenge: In ${decimalStr}, what digit is in the ${askPlace} place?`,
    visual: 'mixed', mixedVisual: 'placeValueChart',
    hint1: askPlace === 'tenths' ? 'First digit after the point.' : 'Second digit after the point.',
    hint2: decimalStr,
    explanation: `The ${askPlace} digit is ${correct}.`,
    options, correctAnswer: correct,
  };
}

const DISTRIBUTION = [
  ['fracToDecTenths',     genQ1,  [5, 3, 2]],
  ['decToFracTenths',     genQ2,  [4, 4, 2]],
  ['fracToDecHundredths', genQ3,  [3, 4, 3]],
  ['decToFracHundredths', genQ4,  [3, 4, 3]],
  ['equivFracDecimal',    genQ5,  [4, 4, 2]],
  ['placeValueIdentify',  genQ6,  [4, 3, 3]],
  ['compareDecimals',     genQ7,  [4, 4, 2]],
  ['sequencePattern',     genQ8,  [3, 4, 3]],
  ['trueFalseDecFrac',    genQ9,  [5, 3, 2]],
  ['mixedReviewBoss',     genQ10, [2, 3, 5]],
];

export function generateSessionQuestions() {
  let all = [];
  let counter = 1;
  for (const [type, genFn, [e, m, h]] of DISTRIBUTION) {
    for (let i = 0; i < e; i++) all.push(genFn(`${type}_${counter++}`, 1));
    for (let i = 0; i < m; i++) all.push(genFn(`${type}_${counter++}`, 2));
    for (let i = 0; i < h; i++) all.push(genFn(`${type}_${counter++}`, 3));
  }
  all = shuffleArray(all);
  all.forEach((q, idx) => { q.world = Math.floor(idx / 10); });
  return all;
}

export const BADGE_TESTS = {
  first_fact:             (s) => s.totalScore > 0,
  hot_streak:              (s) => s.maxStreak >= 5,
  grid_master:        (s) => s.simulateDone,
  decimal_master:   (s) => s.totalQuestions > 0 && s.totalScore / s.totalQuestions >= 0.8,
  perfect_score:           (s) => s.worldResults.some(w => w && w.correct === w.total),
  boss_slayer:             (s) => s.bossWon,
  full_journey:            (s) => s.reflectDone,
};

export function checkBadges(sessionState) {
  return BADGES.filter(b => (BADGE_TESTS[b.id] ? BADGE_TESTS[b.id](sessionState) : false));
}

export function scoreAnswer({ isCorrect, isFirstTry, streak }) {
  if (!isCorrect) return { xp: 0, newStreak: 0 };
  let xp = isFirstTry ? 10 : 5;
  const newStreak = streak + 1;
  if (newStreak >= 5 && newStreak % 5 === 0) xp += 5;
  return { xp, newStreak };
}

export function calcStars(correctCount, totalCount = 10) {
  const pct = totalCount > 0 ? correctCount / totalCount : 0;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function isWorldUnlocked() {
  return true; // direct phase/world switching is allowed throughout
}

// exported for reuse by Simulate stations (Grid Shader, Flip the Decimal, Decimal Sentence)
export { formatHundredths, buildOptions, englishNames, pick, randInt, shuffleArray };
