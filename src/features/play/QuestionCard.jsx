// src/features/play/QuestionCard.jsx
import React from 'react';
import HintBubble from '../../components/HintBubble.jsx';
import DecimalGrid from '../../components/DecimalGrid.jsx';
import PlaceValueChart from '../../components/PlaceValueChart.jsx';

/**
 * Renders a single question card with topic badge, visual aid,
 * question text, option grid, optional hint, and mascot row.
 */
export default function QuestionCard({
  question,
  selected,
  confirmed,
  onSelect,
  showHint,
  worldAccent,
}) {
  const { type, questionText, visual, mixedVisual, options, correctAnswer, explanation,
    numerator, denominator, askPlace, whole, tenths, hundredths } = question;

  const topicLabel = type.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
  const effectiveVisual = visual === 'mixed' ? mixedVisual : visual;

  return (
    <div className="question-card glass-card">
      {/* Topic badge */}
      <div className="topic-badge" style={{ borderColor: `${worldAccent}66`, color: worldAccent }}>
        {topicLabel}
      </div>

      {/* Question text */}
      <p className="question-text">{questionText}</p>

      {/* Visual aid */}
      {effectiveVisual === 'tenthsGrid' && (
        <div className="question-visual">
          <DecimalGrid mode="tenths" shaded={numerator} />
        </div>
      )}
      {effectiveVisual === 'hundredthsGrid' && (
        <div className="question-visual">
          <DecimalGrid mode="hundredths" shaded={numerator} compact />
        </div>
      )}
      {effectiveVisual === 'placeValueChart' && (
        <div className="question-visual">
          <PlaceValueChart whole={whole} tenths={tenths} hundredths={hundredths} highlight={askPlace} />
        </div>
      )}
      {effectiveVisual === 'fractionCard' && (
        <div className="question-visual">
          <div className="fraction-card">
            <span className="fraction-num">{numerator}</span>
            <span className="fraction-bar" />
            <span className="fraction-den">{denominator}</span>
          </div>
        </div>
      )}
      {effectiveVisual === 'sequenceStrip' && (
        <div className="question-visual">
          <div className="sequence-strip">
            {question.sequenceTerms.map((t, i) => (
              <div key={i} className="sequence-chip">{t}</div>
            ))}
            <div className="sequence-chip sequence-chip-blank">?</div>
          </div>
        </div>
      )}

      {/* Hint */}
      {showHint && !confirmed && (
        <HintBubble>{question.hint1}</HintBubble>
      )}

      {/* Options */}
      <div className="options-grid">
        {options.map((opt) => {
          let cls = 'option-btn';
          if (confirmed) {
            if (opt === correctAnswer) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else cls += ' disabled';
          } else if (selected === opt) {
            cls += ' selected';
          }
          return (
            <button key={opt} className={cls} onClick={() => onSelect(opt)} disabled={confirmed}>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation shown after confirmation */}
      {confirmed && explanation && (
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.8)',
        }}>
          💡 {explanation}
        </div>
      )}

      {/* Mascot */}
      <div className="mascot-container" style={{ marginTop: 16 }}>
        <span className="mascot" aria-hidden="true">🦉</span>
        <div className="speech-bubble">
          {confirmed
            ? selected === correctAnswer
              ? "Brilliant! You got it! 🎉"
              : "Keep trying! You'll get it! 💪"
            : "Think about tenths and hundredths…"}
        </div>
      </div>
    </div>
  );
}
