// src/utils/speechText.js
//
// Converts on-screen fraction notation (e.g. "7/10") into a spoken-friendly
// form (e.g. "7 by 10") before text is sent to ElevenLabs for narration.
//
// This is a SPEECH-ONLY transform. It must never be applied to text that is
// displayed on screen or used as an audioMap.js lookup key — those must stay
// exactly as written (e.g. "7/10") so students see standard fraction
// notation and static audio still resolves correctly. Only the string
// actually sent to the TTS engine goes through this function, so narration
// reads fractions the way they're taught in class ("seven by ten"), not
// literally ("seven slash ten").

/**
 * Rewrite "N/M" fraction notation as "N by M" for text-to-speech input.
 * Leaves decimals (0.7), multiplication (10×10), and everything else as-is —
 * only a digit, a slash, and another digit are matched.
 */
export function toSpokenText(text) {
  if (!text) return text;
  return text.replace(/(\d+)\s*\/\s*(\d+)/g, '$1 by $2');
}
