// src/features/story/storyScripts/slides.js
//
// All 4 story slides for "The Great Pizza Decimal Challenge".
// Drop matching artwork into src/assets/story/ as 1.png – 4.png, sized
// 1672×941px (16:9), replacing the placeholder images shipped with this
// module. See the SlideImage fallback in StoryPhase.jsx — if a file is
// ever missing at runtime, it degrades gracefully to a placeholder frame.

export const STORY_SLIDES = [
  {
    title: 'The Great Pizza Decimal Challenge 🍕',
    text: "Ethan is running the pizza stall at the school fun fair. Each pizza is cut into 10 equal slices, and he's sold 7 of them. The digital order screen only accepts decimal numbers, not fractions. \"7 out of 10 slices... how do I write that as a decimal?\" he wonders.",
    highlight: '🤔  7/10 slices sold — how do I write that as a decimal?',
    answer: null,
    narrationIdx: 0,
  },
  {
    title: 'Mia Knows the Trick! 🔟',
    text: 'Mia grins. "Easy! 7 out of 10 slices is the fraction 7/10. And 7/10 is exactly the same amount as the decimal 0.7 — seven tenths! Whenever the bottom number is 10, it just slides into the first spot after the decimal point."',
    highlight: '🔟  7/10 = 0.7',
    answer: null,
    narrationIdx: 1,
  },
  {
    title: 'Tally Reveals the Grid! 🦉',
    text: 'Tally the Owl swoops down. "Every fraction over 10 becomes tenths in a decimal! And if you cut into 100 equal pieces instead, each tiny piece is one hundredth — written 0.01. So 23 out of 100 pieces is 0.23!"',
    highlight: '🎨  23/100 = 0.23',
    answer: null,
    narrationIdx: 2,
  },
  {
    title: 'Ethan Never Gets Stuck Again 🍕',
    text: 'Ethan types 0.7 into the screen — order logged! By the end of the fair, he\'s converting every fraction to a decimal in his head. "Fractions and decimals are just two ways to write the exact same amount!"',
    highlight: '🚀  Fractions and decimals — the same amount, two ways to write it!',
    answer: null,
    narrationIdx: 3,
  },
];
