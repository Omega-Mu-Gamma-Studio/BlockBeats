import * as Tone from 'tone';

// PolySynth-driven counterpart to audioEngine.js — same pattern-sequencer
// shape, but triggers synthesized notes (chords or single pitches) instead
// of drum samples, for the PianoRoll BTS view.
let synth = null;
let sequence = null;
let started = false;

async function ensureStarted() {
  if (!started) {
    await Tone.start();
    started = true;
  }
}

function ensureSynth() {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      envelope: { attack: 0.01, decay: 0.15, sustain: 0.25, release: 0.6 },
    }).toDestination();
  }
  return synth;
}

export function previewNotes(notes) {
  ensureSynth().triggerAttackRelease(notes, '8n');
}

// pattern: { [blockId]: Set<stepIndex> }, blockTypes: { [blockId]: { notes: [...] } }
export async function playPitchedPattern(pattern, blockTypes, { stepCount, bpm = 100, onStep } = {}) {
  await ensureStarted();
  ensureSynth();
  stopPitchedPattern();

  Tone.Transport.bpm.value = bpm;

  sequence = new Tone.Sequence(
    (time, s) => {
      Object.keys(pattern).forEach((blockId) => {
        if (pattern[blockId]?.has(s)) {
          const notes = blockTypes[blockId]?.notes;
          if (notes) synth.triggerAttackRelease(notes, '8n', time);
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

export function stopPitchedPattern() {
  if (sequence) {
    sequence.stop();
    sequence.dispose();
    sequence = null;
  }
  Tone.Transport.stop();
  Tone.Transport.cancel();
}
