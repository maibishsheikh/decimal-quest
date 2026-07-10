// src/utils/narration.js
//
// Semantic helper functions wrap narration text with an ElevenLabs
// "style" tag. Every string here MUST exactly match the on-screen
// text shown in UI components (1:1 parity) and the `phrases` array
// in scripts/generate_audio.js, so audioMap.js lookups succeed.

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'encouragement' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct  = (text) => ({ text, style: 'instruction' });

export {
  VOICE_SETTINGS,
  VOICE_ID,
  VOICE_MODEL,
} from '../config/audio.config.js';

// ─── INTRO ────────────────────────────────────────────────────────────────
export function introNarration() {
  return [cheer("Let's turn fractions into decimals, all the way from tenths to hundredths!")];
}

// ─── WONDER ──────────────────────────────────────────────────────────────
// Narrates the EXACT question + subtext shown on screen (built from the
// WONDER_QUESTIONS entry itself) so audio/visual text can never drift apart.
export function wonderHookNarration(wonder) {
  if (!wonder) return [];
  return [
    cheer(`Hmm, I wonder! ${wonder.question}`),
    think(wonder.subtext),
  ];
}

// ─── STORY — "The Great Pizza Decimal Challenge" ──────────────────────────
// Each entry is the single narrated segment for that slide and is set to be
// word-for-word identical to that slide's story-body paragraph (every slide
// is read aloud in full, word-for-word matching the body text).
export const storyNarrations = {
  decimalFacts: [
    say("Ethan is running the pizza stall at the school fun fair. Each pizza is cut into 10 equal slices, and he's sold 7 of them. The digital order screen only accepts decimal numbers, not fractions. \"7 out of 10 slices... how do I write that as a decimal?\" he wonders."),
    say('Mia grins. "Easy! 7 out of 10 slices is the fraction 7/10. And 7/10 is exactly the same amount as the decimal 0.7 — seven tenths! Whenever the bottom number is 10, it just slides into the first spot after the decimal point."'),
    say('Tally the Owl swoops down. "Every fraction over 10 becomes tenths in a decimal! And if you cut into 100 equal pieces instead, each tiny piece is one hundredth — written 0.01. So 23 out of 100 pieces is 0.23!"'),
    celebrate('Ethan types 0.7 into the screen — order logged! By the end of the fair, he\'s converting every fraction to a decimal in his head. "Fractions and decimals are just two ways to write the exact same amount!"'),
  ],
};

// ─── SIMULATE ────────────────────────────────────────────────────────────
const SIMULATION_NARRATIONS = [
  [instruct('Station one — Grid Shader! Tap to shade squares and build a fraction. Once you\'re done shading, tell us the matching decimal. Let\'s go!')],
  [instruct('Station two — Flip the Decimal! Look at the known fraction and its decimal. Find the missing number to complete its flipped or equivalent form. Look carefully!')],
  [instruct('Final station — Decimal Sentence! You will see a fraction-decimal sentence with one blank. Think of the matching value first, then use the number pad to fill it in. You\'ve got this!')],
];

export function simulationStationNarration(stationIndex) {
  return SIMULATION_NARRATIONS[stationIndex] ?? [];
}

// ─── PLAY ─────────────────────────────────────────────────────────────────
export const CORRECT_NARRATIONS = [
  cheer("Excellent! You've got it!"),
  cheer('Brilliant! Keep going!'),
  cheer("That's exactly right! Well done!"),
];

export const WRONG_NARRATIONS = [
  think('Not quite, but good try! Remember your tenths and hundredths.'),
  think('Almost! Check the place value carefully and try again.'),
];

export function bossBattleNarration() {
  return [emphasize('The Boss Battle begins! Answer the questions correctly to defeat the boss and claim your Decimal Master trophy!')];
}

export function bossWinNarration() {
  return [celebrate('You defeated the boss! The Golden Decimal Trophy is yours!')];
}

// ─── REFLECT ────────────────────────────────────────────────────────────
export function reflectIntroNarration() {
  return [say("Let's see how far you've come on your decimals journey!")];
}
