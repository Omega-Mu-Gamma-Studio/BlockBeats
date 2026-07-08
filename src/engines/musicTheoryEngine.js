// Small pitch-comparison helpers shared by the piano roll and (later)
// Unit 3+'s "musically correct" validation mode (README §3 — accepting
// any valid diatonic substitute, not just the one scripted answer).
const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Converts a Tone.js-style note name ("C4", "F#3") to a single sortable
// integer, so PianoRoll can lay out arbitrary notes in the right vertical
// order without hardcoding a lane list.
export function noteToMidi(note) {
  const match = /^([A-G]#?)(-?\d+)$/.exec(note);
  if (!match) return 0;
  const [, pitch, octave] = match;
  return NOTE_ORDER.indexOf(pitch) + (Number(octave) + 1) * 12;
}

export function sortNotesLowToHigh(notes) {
  return [...notes].sort((a, b) => noteToMidi(a) - noteToMidi(b));
}

// Diatonic triad qualities in a major key, by scale degree — the seed for
// "musically correct" chord validation once lessons need it (e.g. accepting
// any minor chord where the target was specifically `ii`, `iii`, or `vi`).
export const DIATONIC_QUALITIES = {
  I: 'major', ii: 'minor', iii: 'minor', IV: 'major', V: 'major', vi: 'minor', viidim: 'diminished',
};

export function isSameChordQuality(chordIdA, chordIdB) {
  return DIATONIC_QUALITIES[chordIdA] === DIATONIC_QUALITIES[chordIdB];
}
