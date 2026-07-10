// src/features/simulate/simulations/GridShader.jsx
//
// Learning goal: SEE the fraction being built (tenths or hundredths), then
// connect it to its decimal. Students tap cells to shade a target amount,
// then identify the matching decimal — the concrete, visual reverse of
// what Flip the Decimal / Decimal Sentence teach symbolically.

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import DecimalGrid from '../../../components/DecimalGrid.jsx';
import { sounds } from '../../../utils/audio.js';
import { formatHundredths, buildOptions, pick, randInt, shuffleArray } from '../../../core/questions/questionBank.js';

const ROUNDS = 3;

function genRound() {
  const mode = pick(['tenths', 'hundredths']);
  const target = mode === 'tenths' ? randInt(1, 9) : randInt(1, 99);
  const correct = mode === 'tenths' ? `0.${target}` : formatHundredths(target);
  return { mode, target, correct };
}

export default function GridShader({ onComplete }) {
  const [round, setRound]         = useState(0);
  const [setup, setSetup]         = useState(null);
  const [shadedSet, setShadedSet] = useState(new Set());
  const [phase, setPhase]         = useState('shading'); // 'shading' | 'answering'
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [options, setOptions]     = useState([]);
  const [score, setScore]         = useState(0);

  const startRound = () => {
    const s = genRound();
    setSetup(s);
    setShadedSet(new Set());
    setPhase('shading');
    setSelected(null);
    setConfirmed(false);
    const cents = s.mode === 'tenths' ? s.target * 10 : s.target;
    const candidates = shuffleArray([1, -1, 5, -5, 10, -10]).map(o => formatHundredths(Math.min(99, Math.max(1, cents + o))));
    setOptions(buildOptions(s.correct, candidates, () => formatHundredths(randInt(1, 99))));
  };

  useEffect(() => { startRound(); }, []);
  if (!setup) return null;

  const total = setup.mode === 'tenths' ? 10 : 100;
  const shadedCount = shadedSet.size;
  const readyToConvert = shadedCount === setup.target;
  const isCorrect = selected === setup.correct;

  const toggleCell = (i) => {
    if (phase !== 'shading') return;
    sounds.click();
    setShadedSet(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };
  const shadeExact = () => {
    const next = new Set();
    for (let i = 0; i < setup.target; i++) next.add(i);
    setShadedSet(next);
    sounds.click();
  };
  const clearAll = () => setShadedSet(new Set());

  const handleConfirmAnswer = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    if (isCorrect) { sounds.correct(); setScore(s => s + 1); } else { sounds.wrong(); }
  };
  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS) { onComplete?.(score); return; }
    setRound(next);
    startRound();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>

      {/* Round header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        fontSize: '0.9rem', color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        <span>Round {round + 1} / {ROUNDS}</span>
        <span>Score: {score} / {round}</span>
      </div>

      {phase === 'shading' && (
        <>
          <div style={{
            background: 'rgba(124,92,191,0.14)', border: '1px solid rgba(124,92,191,0.3)',
            borderRadius: 'var(--radius-md)', padding: '10px 16px',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem', textAlign: 'center',
          }}>
            Shade {setup.target} out of {total} squares ({setup.mode})
          </div>

          <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
            Shaded: <span style={{ color: 'var(--gold)', fontSize: '1.15rem' }}>{shadedCount}</span> / {setup.target}
          </div>

          <DecimalGrid mode={setup.mode} shadedIndices={shadedSet} interactive onToggle={toggleCell} />

          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={clearAll} style={{ flex: 1 }}>Clear</Button>
            <Button variant="outline" size="sm" onClick={shadeExact} style={{ flex: 1 }}>Shade for Me</Button>
          </div>
          <Button variant="primary" size="sm" onClick={() => setPhase('answering')}
            disabled={!readyToConvert} style={{ width: '100%' }}>
            {readyToConvert ? "That's it! Convert to a decimal →" : `Shade ${setup.target - shadedCount} more to continue`}
          </Button>
        </>
      )}

      {phase === 'answering' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DecimalGrid mode={setup.mode} shaded={setup.target} compact />
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>
            {setup.target}/{total} as a decimal is…
          </p>
          {!confirmed && (
            <>
              <div className="options-grid">
                {options.map(opt => (
                  <button key={opt}
                    className={`option-btn${selected === opt ? ' selected' : ''}`}
                    onClick={() => setSelected(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
              <Button variant="primary" size="sm" onClick={handleConfirmAnswer}
                disabled={!selected} style={{ width: '100%' }}>
                Confirm ✓
              </Button>
            </>
          )}
          {confirmed && (
            <>
              <div style={{
                padding: '11px 16px', borderRadius: 'var(--radius-md)', marginBottom: 4,
                background: isCorrect ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)',
                border: `1.5px solid ${isCorrect ? 'rgba(0,230,118,0.4)' : 'rgba(255,82,82,0.4)'}`,
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem', textAlign: 'center',
              }}>
                {isCorrect
                  ? `🎉 Correct! ${setup.target}/${total} = ${setup.correct}`
                  : `❌ It's ${setup.correct}! ${setup.target}/${total} = ${setup.correct}.`}
              </div>
              <Button variant="primary" size="sm" onClick={handleNext} style={{ width: '100%' }}>
                {round + 1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
              </Button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
