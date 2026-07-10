// scripts/generate_audio.js
//
// Pre-generates all known narration phrases as .mp3 files into
// public/assets/audio/ and writes src/utils/audioMap.js.
//
// Usage: npm run generate-audio
// Requires: VITE_ELEVENLABS_API_KEY in .env.local

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...vals] = line.split('=');
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  }
}
loadEnv();

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌  VITE_ELEVENLABS_API_KEY not set in .env.local');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const VOICE_MODEL = 'eleven_multilingual_v2';
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const MAP_PATH  = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50 },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60 },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20 },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40 },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80 },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
};

// ── Phrases to pre-generate ────────────────────────────────────────────────
// Every string here must exactly match the text passed to playNarration()
// in src/utils/narration.js, so audioMap.js lookups succeed at runtime.
// Generated from the segments actually fired by the app — keep this in
// sync whenever narration.js changes.
const phrases = [
  // INTRO
  { text: "Let's turn fractions into decimals, all the way from tenths to hundredths!", style: 'encouragement' },
  // WONDER — narrated text is built from each WONDER_QUESTIONS entry
  // (question + subtext), so it always matches the on-screen card exactly.
  { text: "Hmm, I wonder! If Ethan has sold 7 out of 10 slices of a pizza, how would you write that amount as a decimal?", style: 'encouragement' },
  { text: "Fractions and decimals can describe the exact same amount!", style: 'thinking' },
  { text: "Hmm, I wonder! Why does 0.06 mean something completely different from 0.6, even though they use the same digits?", style: 'encouragement' },
  { text: "Where a digit sits after the decimal point changes its value!", style: 'thinking' },
  { text: "Hmm, I wonder! If a mosaic has 100 tiles and 23 are painted gold, what decimal describes the gold tiles?", style: 'encouragement' },
  { text: "A 10×10 grid is a perfect picture of hundredths!", style: 'thinking' },
  { text: "Hmm, I wonder! Who finished faster: a runner who took 0.6 of a lap, or one who took 0.45 of a lap?", style: 'encouragement' },
  { text: "Comparing decimals is just like comparing fractions!", style: 'thinking' },
  { text: "Hmm, I wonder! Is there a quick way to tell that 1/2, 5/10, and 0.5 are all exactly the same amount?", style: 'encouragement' },
  { text: "Fractions and decimals are just two ways of writing the same number!", style: 'thinking' },
  // STORY — The Great Pizza Decimal Challenge
  { text: "Ethan is running the pizza stall at the school fun fair. Each pizza is cut into 10 equal slices, and he's sold 7 of them. The digital order screen only accepts decimal numbers, not fractions. \"7 out of 10 slices... how do I write that as a decimal?\" he wonders.", style: 'statement' },
  { text: 'Mia grins. "Easy! 7 out of 10 slices is the fraction 7/10. And 7/10 is exactly the same amount as the decimal 0.7 — seven tenths! Whenever the bottom number is 10, it just slides into the first spot after the decimal point."', style: 'statement' },
  { text: 'Tally the Owl swoops down. "Every fraction over 10 becomes tenths in a decimal! And if you cut into 100 equal pieces instead, each tiny piece is one hundredth — written 0.01. So 23 out of 100 pieces is 0.23!"', style: 'statement' },
  { text: 'Ethan types 0.7 into the screen — order logged! By the end of the fair, he\'s converting every fraction to a decimal in his head. "Fractions and decimals are just two ways to write the exact same amount!"', style: 'celebration' },
  // SIMULATE — Grid Shader / Flip the Decimal / Decimal Sentence
  { text: "Station one — Grid Shader! Tap to shade squares and build a fraction. Once you're done shading, tell us the matching decimal. Let's go!", style: 'instruction' },
  { text: "Station two — Flip the Decimal! Look at the known fraction and its decimal. Find the missing number to complete its flipped or equivalent form. Look carefully!", style: 'instruction' },
  { text: "Final station — Decimal Sentence! You will see a fraction-decimal sentence with one blank. Think of the matching value first, then use the number pad to fill it in. You've got this!", style: 'instruction' },
  // PLAY — Boss Battle
  { text: "The Boss Battle begins! Answer the questions correctly to defeat the boss and claim your Decimal Master trophy!", style: 'emphasis' },
  { text: "You defeated the boss! The Golden Decimal Trophy is yours!", style: 'celebration' },
  // REFLECT
  { text: "Let's see how far you've come on your decimals journey!", style: 'statement' },
];


// ── Helpers ───────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 55);
}

// ── CLI args ──────────────────────────────────────────────────────────────
// node scripts/generate_audio.js --index 4
// node scripts/generate_audio.js --text "Hello there!" --style celebration
// node scripts/generate_audio.js --list                (show all phrases + indices)
function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--index') out.index = parseInt(args[++i], 10);
    if (args[i] === '--text') out.text = args[++i];
    if (args[i] === '--style') out.style = args[++i];
    if (args[i] === '--list') out.list = true;
  }
  return out;
}

async function generateAudio(text, style) {
  const settings = VOICE_SETTINGS[style] ?? VOICE_SETTINGS.statement;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
      body: JSON.stringify({ text, model_id: VOICE_MODEL, voice_settings: settings }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  const { index, text: cliText, style: cliStyle, list } = parseArgs();

  if (list) {
    phrases.forEach((p, i) => console.log(`[${i}] (${p.style}) ${p.text.slice(0, 70)}…`));
    return;
  }

  if (cliText) {
    const style = cliStyle || 'statement';
    const filename = `audio_${slugify(cliText)}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating single statement (${style}): "${cliText.slice(0, 60)}…"`);
    const buf = await generateAudio(cliText, style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    return;
  }

  if (Number.isInteger(index)) {
    const phrase = phrases[index];
    if (!phrase) {
      console.error(`❌  No phrase at index ${index}. Run with --list to see valid indices.`);
      return;
    }
    const filename = `audio_${slugify(phrase.text)}_${index}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating [${index}] ${phrase.style}: "${phrase.text.slice(0, 60)}…"`);
    const buf = await generateAudio(phrase.text, phrase.style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    console.log(`ℹ️   This single run does NOT rewrite audioMap.js — run without flags to regenerate the full map.`);
    return;
  }

  // No flags: full batch generation
  const audioMapEntries = [];
  let generated = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = `audio_${slugify(text)}_${i}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    const assetPath = `assets/audio/${filename}`;

    audioMapEntries.push([text, assetPath]);

    if (fs.existsSync(filePath)) {
      console.log(`⏭  Skipping (exists): ${filename}`);
      continue;
    }

    try {
      process.stdout.write(`🎙  Generating [${i + 1}/${phrases.length}] ${style}: "${text.slice(0, 48)}…" `);
      const buf = await generateAudio(text, style);
      fs.writeFileSync(filePath, buf);
      console.log(`✓ ${filename}`);
      generated++;
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`\n❌  Failed: ${err.message}`);
    }
  }

  const mapContent = `// src/utils/audioMap.js
// AUTO-GENERATED by scripts/generate_audio.js — do not edit by hand.
// Run \`npm run generate-audio\` to regenerate.

export const audioMap = {
${audioMapEntries.map(([text, p]) => `  ${JSON.stringify(text)}: ${JSON.stringify(p)},`).join('\n')}
};
`;
  fs.writeFileSync(MAP_PATH, mapContent);

  console.log(`\n✅  Done. Generated ${generated} new files. audioMap.js updated (${audioMapEntries.length} entries).`);
})();
