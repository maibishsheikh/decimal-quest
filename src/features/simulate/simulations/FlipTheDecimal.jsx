// src/features/simulate/simulations/FlipTheDecimal.jsx
//
// Learning goal: the SAME amount can be written as different fractions —
// and they all convert to the same decimal. Three-phase flow per round:
//   1. KNOW IT   — display a fraction and its decimal clearly
//   2. FLIP IT   — show an equivalent fraction in a different form and ask
//                  for its decimal (a blank + 4 option buttons)
//   3. FAMILY    — reveal both fraction forms side-by-side, same decimal
//
// Rounds rotate through three skills: expanding tenths to hundredths,
// doubling a common fraction, and reducing hundredths back to tenths.
// Large, clear text cards and big tap targets throughout (Simulate phase
// font sizes are intentionally larger).

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import { sounds } from '../../../utils/audio.js';
import { formatHundredths, buildOptions, pick, randInt, shuffleArray } from '../../../core/questions/questionBank.js';
import { EQUIV_FRACTIONS } from '../../../config/worlds.config.js';

const ROUNDS = 3;

// Each round rotates the "which flip to ask" pattern:
//   0 → tenthsExpand:    n/10 → (10n)/100          (same decimal, hundredths form)
//   1 → commonDouble:    a common fraction doubled  (same decimal, still equal)
//   2 → hundredthsReduce: a multiple-of-10 hundredths → its tenths form
const PATTERNS = ['tenthsExpand', 'commonDouble', 'hundredthsReduce'];

function genRound(roundIdx) {
  const pattern = PATTERNS[roundIdx % PATTERNS.length];

  if (pattern === 'tenthsExpand') {
    const n = randInt(1, 9);
    const knownFrac = `${n}/10`;
    const knownDec = `0.${n}`;
    const m = n * 10;
    const flipFrac = `${m}/100`;
    const answer = formatHundredths(m);
    const candidates = shuffleArray([1, -1, 5, -5]).map(o => formatHundredths(Math.min(99, Math.max(1, m + o))));
    const options = buildOptions(answer, candidates, () => formatHundredths(randInt(1, 99)));
    return { pattern, knownFrac, knownDec, flipFrac, question: `${flipFrac} = ?`, answer, options };
  }

  if (pattern === 'commonDouble') {
    const pool = EQUIV_FRACTIONS.filter(f => f.den <= 5);
    const f = pick(pool);
    const knownFrac = `${f.num}/${f.den}`;
    const knownDec = f.dec;
    const flipFrac = `${f.num * 2}/${f.den * 2}`;
    const cents = Math.round(parseFloat(f.dec) * 100);
    const candidates = shuffleArray([5, -5, 10, -10, 15, -15]).map(o => formatHundredths(Math.min(99, Math.max(1, cents + o))));
    const options = buildOptions(knownDec, candidates, () => formatHundredths(randInt(1, 99)));
    return { pattern, knownFrac, knownDec, flipFrac, question: `${flipFrac} = ?`, answer: knownDec, options };
  }

  // hundredthsReduce
  const t = randInt(1, 9);
  const m = t * 10;
  const knownFrac = `${m}/100`;
  const knownDec = formatHundredths(m);
  const flipFrac = `${t}/10`;
  const answer = `0.${t}`;
  const candidates = [`0.0${t}`, `${t}.0`, `0.${t === 9 ? t - 1 : t + 1}`];
  const options = buildOptions(answer, candidates, () => `0.${randInt(1, 9)}`);
  return { pattern, knownFrac, knownDec, flipFrac, question: `${flipFrac} = ?`, answer, options };
}

// ── Visual helpers ──────────────────────────────────────────────────────────

function FractionFactCard({ frac, dec }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(74,144,217,0.22), rgba(124,92,191,0.22))',
      border: '2px solid rgba(74,144,217,0.45)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)',
        fontFamily: 'var(--font-display)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        🔟  Fraction Fact
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: '2.3rem', letterSpacing: '0.05em', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
      }}>
        <span style={{ color: '#4A90D9' }}>{frac}</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.6rem' }}>=</span>
        <span style={{ color: 'var(--gold)' }}>{dec}</span>
      </div>
    </div>
  );
}

function FamilyReveal({ knownFrac, knownDec, flipFrac, answer }) {
  const facts = [
    { txt: `${knownFrac} = ${knownDec}`, highlight: false },
    { txt: `${flipFrac} = ${answer}`, highlight: true },
  ];
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 18px',
    }}>
      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)',
        fontFamily: 'var(--font-display)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        🧩 Same Amount, Two Fractions
      </div>
      {facts.map((f, i) => (
        <div key={i} style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: '1.2rem', padding: '5px 0',
          color: f.highlight ? 'var(--gold)' : 'rgba(255,255,255,0.75)',
          borderBottom: i < facts.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{f.txt}</span>
          {f.highlight && <span style={{ fontSize: '0.95rem' }}>✓</span>}
        </div>
      ))}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function FlipTheDecimal({ onComplete }) {
  const [round, setRound]         = useState(0);
  const [setup, setSetup]         = useState(null);
  const [step, setStep]           = useState('know');  // 'know' | 'flip' | 'family'
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore]         = useState(0);

  const newRound = (idx) => {
    setSetup(genRound(idx));
    setStep('know');
    setSelected(null);
    setConfirmed(false);
  };

  useEffect(() => { newRound(0); }, []);
  if (!setup) return null;

  const isCorrect = selected === setup.answer;

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    if (isCorrect) { sounds.correct(); setScore(s => s + 1); } else { sounds.wrong(); }
  };

  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS) { onComplete?.(score); return; }
    setRound(next);
    newRound(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 10 }}>

      {/* ── Round header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        fontSize: '0.9rem', color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0 }}>
        <span>Round {round + 1} / {ROUNDS}</span>
        <span>Score: {score} / {round}</span>
      </div>

      {/* ── STEP 1: KNOW IT ── */}
      {step === 'know' && (
        <AnimatePresence mode="wait">
          <motion.div key="know" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: '1.02rem', color: 'rgba(255,255,255,0.65)' }}>
              🦉 First, learn this fact:
            </div>
            <FractionFactCard frac={setup.knownFrac} dec={setup.knownDec} />
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)',
              padding: '12px 16px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-display)', fontWeight: 600, textAlign: 'center',
            }}>
              Remember this fact — the same amount can look like a different fraction!
            </div>
            <Button variant="primary" size="sm" onClick={() => setStep('flip')}
              style={{ width: '100%' }}>
              Got it! Now flip it 🔁
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── STEP 2: FLIP IT ── */}
      {step === 'flip' && (
        <AnimatePresence mode="wait">
          <motion.div key="flip" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Fraction fact reference — smaller */}
            <div style={{
              background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.25)',
              borderRadius: 'var(--radius-md)', padding: '9px 16px',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem',
              color: 'rgba(255,255,255,0.55)', textAlign: 'center',
            }}>
              🔟 You know: {setup.knownFrac} = {setup.knownDec}
            </div>

            {/* Arrow */}
            <div style={{ textAlign: 'center', fontSize: '1.35rem' }}>🔁 Same amount, new fraction!</div>

            {/* Challenge — large */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,138,80,0.18), rgba(255,193,7,0.14))',
              border: '2px solid rgba(255,138,80,0.45)',
              borderRadius: 'var(--radius-lg)', padding: '18px 22px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                🎨  Equivalent Fraction
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.3rem',
                color: '#fff', letterSpacing: '0.04em',
              }}>
                {setup.question}
              </div>
            </div>

            {/* Option buttons — large tap targets */}
            <div className="options-grid">
              {setup.options.map(opt => (
                <button
                  key={opt}
                  className={`option-btn${
                    confirmed
                      ? opt === setup.answer ? ' correct' : opt === selected ? ' wrong' : ' disabled'
                      : selected === opt ? ' selected' : ''
                  }`}
                  onClick={() => { if (!confirmed) setSelected(opt); }}
                  disabled={confirmed}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Confirm / result */}
            {!confirmed && (
              <Button variant="primary" size="sm" onClick={handleConfirm}
                disabled={!selected} style={{ width: '100%' }}>
                Check ✓
              </Button>
            )}

            {confirmed && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{
                  padding: '11px 16px', borderRadius: 'var(--radius-md)', marginBottom: 8,
                  background: isCorrect ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)',
                  border: `1.5px solid ${isCorrect ? 'rgba(0,230,118,0.4)' : 'rgba(255,82,82,0.4)'}`,
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.02rem', textAlign: 'center',
                }}>
                  {isCorrect ? `🎉 Correct! ${setup.question.replace('?', setup.answer)}` : `❌ Answer: ${setup.answer}`}
                </div>
                <Button variant="outline" size="sm" onClick={() => setStep('family')}
                  style={{ width: '100%' }}>
                  See both fractions 🧩
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── STEP 3: FAMILY REVEAL ── */}
      {step === 'family' && (
        <AnimatePresence mode="wait">
          <motion.div key="family" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: '1.02rem', color: 'rgba(255,255,255,0.65)' }}>
              🦉 Different fractions, same decimal!
            </div>
            <FamilyReveal knownFrac={setup.knownFrac} knownDec={setup.knownDec} flipFrac={setup.flipFrac} answer={setup.answer} />
            <Button variant="primary" size="sm" onClick={handleNext} style={{ width: '100%' }}>
              {round + 1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}
