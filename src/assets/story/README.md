# Story slide art — "The Great Pizza Decimal Challenge"

This folder currently ships with 4 **placeholder** illustrations (simple flat
vector graphics) so the app builds and runs out of the box. Swap them out for
your final artwork whenever it's ready — no code changes needed, just replace
the files.

## Required size

**1672 × 941 px** (16:9 landscape) — this exactly matches the reference
module's (`equal-groups-main`) story images, so the existing `.story-image` /
`.story-image-full` CSS (object-fit: cover, responsive height steps at
768px/480px breakpoints) will frame your artwork identically with zero CSS
changes.

## File names & content brief

Name your 4 files to match `STORY_SLIDES` order in
`src/features/story/storyScripts/slides.js`:

| File   | Scene |
|--------|-------|
| `1.png` | Ethan at the school fun fair pizza stall — a pizza cut into 10 equal slices, 7 already sold, looking puzzled at a digital order screen that only accepts decimals. |
| `2.png` | Mia confidently pointing at the pizza slices, showing that 7/10 = 0.7 — no counting needed. |
| `3.png` | Tally the Owl introducing a 10×10 grid (hundredths) alongside the pizza, connecting fractions over 100 to two-decimal-place numbers. |
| `4.png` | Ethan celebrating at the stall — order screen showing "0.7", fair bustling happily in the background. |

Suggested style: bright, flat/vector children's-book illustration (matching
the warm, colourful tone of the reference module's artwork), on a background
that reads well behind the dark navy UI chrome.

## Fallback behaviour

If a file is ever missing or fails to load at runtime, `SlideImage` in
`StoryPhase.jsx` automatically falls back to a placeholder frame (🖼️ "Image
coming soon") — the app never hard-errors, it just looks plainer until you
drop in the real art.
