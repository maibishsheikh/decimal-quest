// src/features/story/CharacterDialogue.jsx
import React from 'react';
import { CHARACTERS } from '../../config/characters.config.js';

// Map slide index → character (Ethan → Mia → Tally the Owl → Ethan)
const SLIDE_CHARACTERS = ['ethan', 'mia', 'tally', 'ethan'];

export default function CharacterDialogue({ slideIndex, text }) {
  const charKey = SLIDE_CHARACTERS[slideIndex] || 'flip';
  const char = CHARACTERS[charKey];

  return (
    <div className="mascot-container" style={{ marginTop: 16 }}>
      <span className="mascot" role="img" aria-label={char.name}>{char.emoji}</span>
      <div className="speech-bubble" style={{ borderColor: `${char.colour}44` }}>
        {text}
      </div>
    </div>
  );
}
