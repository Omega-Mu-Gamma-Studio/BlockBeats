import * as Tone from 'tone';
import { BLOCK_TYPES } from '../data/blockTypes';

// Thin singleton around Tone.js. Loads one player per drum sample and
// exposes a step-sequencer scheduled against Tone.Transport, so every
// lesson that needs "play this pattern" can share one audio context.
let players = null;
let sequence = null;
let started = false;

async function ensureStarted() {
  if (!started) {
    await Tone.start();
    started = true;
  }
}

function ensurePlayers() {
  if (players) return players;
  players = {};
  Object.values(BLOCK_TYPES).forEach((block) => {
    players[block.id] = new Tone.Player({
      url: block.sample,
      fadeOut: 0.02,
    }).toDestination();
  });
  return players;
}

export function triggerSample(blockId) {
  const p = ensurePlayers()[blockId];
  if (p && p.loaded) {
    p.start();
  }
}

// pattern: { kick: Set<stepIndex>, snare: Set<stepIndex>, hihat: Set<stepIndex> }
// stepCount: total steps in the loop (e.g. 8 for eighth notes across 1 bar of 4/4)
export async function playPattern(pattern, { stepCount, bpm = 100, onStep } = {}) {
  await ensureStarted();
  ensurePlayers();
  stopPattern();

  Tone.Transport.bpm.value = bpm;

  sequence = new Tone.Sequence(
    (time, s) => {
      Object.keys(pattern).forEach((blockId) => {
        if (pattern[blockId]?.has(s)) {
          const p = players[blockId];
          // Sample files are still 0-byte placeholders (public/audio/drums),
          // same as the sprite PNGs — same guard triggerSample() uses below,
          // just missing here. Without it this throws instead of just
          // staying silent once real samples are missing.
          if (p?.loaded) p.start(time);
        }
      });
      Tone.Draw.schedule(() => onStep?.(s), time);
    },
    Array.from({ length: stepCount }, (_, i) => i),
    '8n'
  );

  sequence.start(0);
  Tone.Transport.start();
  return true;
}

export function stopPattern() {
  if (sequence) {
    sequence.stop();
    sequence.dispose();
    sequence = null;
  }
  Tone.Transport.stop();
  Tone.Transport.cancel();
}

export function isReady() {
  return players ? Object.values(players).every((p) => p.loaded) : false;
}
