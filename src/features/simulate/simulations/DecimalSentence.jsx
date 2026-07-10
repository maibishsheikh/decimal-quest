// src/features/simulate/simulations/DecimalSentence.jsx
//
// Fill-in-the-blank tenths sentences using the number pad. Kept to tenths
// only (single-digit blanks) so digit entry is always unambiguous — no
// "is 6 the same as 06" confusion. Hundredths conversions are covered
// visually in Grid Shader and via MCQ in Flip the Decimal instead.

import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button.jsx';
import NumberPad from '../../../components/NumberPad.jsx';
import { sounds } from '../../../utils/audio.js';
import { randInt } from '../../../core/questions/questionBank.js';

const ROUNDS = 3;
const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const VARIANTS = ['fracToDec', 'decToFrac', 'wordToDec'];

function genRound(roundIdx) {
  const variant = VARIANTS[roundIdx % VARIANTS.length];
  const n = randInt(1, 9);
  return { variant, n, answer: n };
}

export default function DecimalSentence({ onComplete }) {
  const [round, setRound]         = useState(0);
  const [setup, setSetup]         = useState(null);
  const [value, setValue]         = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore]         = useState(0);

  const newRound = (idx) => { setSetup(genRound(idx)); setValue(''); setConfirmed(false); };
  useEffect(() => { newRound(0); }, []);
  if (!setup) return null;

  const isCorrect = Number(value) === setup.answer;
  const { variant, n } = setup;

  const handleSubmit = () => {
    if (!value || confirmed) return;
    setConfirmed(true);
    if (isCorrect) { sounds.correct(); setScore((s) => s + 1); } else { sounds.wrong(); }
  };
  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS) { onComplete?.(score); return; }
    setRound(next); newRound(next);
  };

  const instructionLine = variant === 'wordToDec'
    ? `${n === 1 ? 'One' : NUM_WORDS[n][0].toUpperCase() + NUM_WORDS[n].slice(1)} tenths — fill in the blank!`
    : 'Fill in the blank!';

  const hintLine = variant === 'fracToDec'
    ? `💡 Think: ${n}/10 = 0.?`
    : variant === 'decToFrac'
      ? `💡 Think: 0.${n} = ?/10`
      : `💡 "${NUM_WORDS[n]} tenths" = 0.?`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flex: 1, minHeight: 0 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6,
        fontSize: '0.9rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        <span>Round {round + 1} / {ROUNDS}</span>
        <span>Score: {score}/{round}</span>
      </div>

      <p className="sim-instruction">{instructionLine}</p>

      {/* ── Hint line — nudges toward the answer BEFORE the student
           answers (always visible, not hint-gated) ── */}
      <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: 8, textAlign: 'center' }}>
        {hintLine}
      </p>

      {/* ── Fraction/decimal sentence ── */}
      {variant === 'fracToDec' && (
        <div className="number-sentence">
          <span className="ns-num">{n}</span>
          <span className="ns-op">/</span>
          <span className="ns-num">10</span>
          <span className="ns-op">=</span>
          <span className="ns-num">0.</span>
          <span className="ns-blank">{value || '?'}</span>
        </div>
      )}
      {variant === 'decToFrac' && (
        <div className="number-sentence">
          <span className="ns-num">0.{n}</span>
          <span className="ns-op">=</span>
          <span className="ns-blank">{value || '?'}</span>
          <span className="ns-op">/</span>
          <span className="ns-num">10</span>
        </div>
      )}
      {variant === 'wordToDec' && (
        <div className="number-sentence">
          <span className="ns-num">0.</span>
          <span className="ns-blank">{value || '?'}</span>
        </div>
      )}

      {/* ── Number pad (hidden after confirm) ── */}
      {!confirmed && <NumberPad value={value} onChange={setValue} onSubmit={handleSubmit} />}

      {/* ── Action — always at bottom ── */}
      <div style={{ marginTop: 'auto', paddingTop: 8, flexShrink: 0 }}>
        {!confirmed ? (
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!value} style={{ width: '100%' }}>
            Check Answer ✓
          </Button>
        ) : (
          <>
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: 8,
              background: isCorrect ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)',
              border: `1px solid ${isCorrect ? 'rgba(0,230,118,0.4)' : 'rgba(255,82,82,0.4)'}`,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem', textAlign: 'center',
            }}>
              {isCorrect ? '🎉 Correct! You completed the sentence!' : `❌ Answer: ${setup.answer}`}
            </div>
            <Button variant="primary" size="sm" onClick={handleNext} style={{ width: '100%' }}>
              {round + 1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
