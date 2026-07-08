// Pitched block definitions for the piano roll (Unit 3 chords, Unit 4
// melody). Same shape as data/blockTypes.js (id, label, color, + notes
// instead of a sample) so PianoRoll can reuse the same lane/palette
// pattern WaveformView uses for drums.

// Diatonic triads in C major — default chord palette (Unit 3 / free-play).
export const CHORD_BLOCKS = {
  I: { id: 'I', label: 'I', shortLabel: 'I', name: 'C major', notes: ['C4', 'E4', 'G4'], color: '#e8973a' },
  ii: { id: 'ii', label: 'ii', shortLabel: 'ii', name: 'D minor', notes: ['D4', 'F4', 'A4'], color: '#d4574a' },
  iii: { id: 'iii', label: 'iii', shortLabel: 'iii', name: 'E minor', notes: ['E4', 'G4', 'B4'], color: '#4fae8e' },
  IV: { id: 'IV', label: 'IV', shortLabel: 'IV', name: 'F major', notes: ['F4', 'A4', 'C5'], color: '#6e8fb8' },
  V: { id: 'V', label: 'V', shortLabel: 'V', name: 'G major', notes: ['G4', 'B4', 'D5'], color: '#c98fd6' },
  vi: { id: 'vi', label: 'vi', shortLabel: 'vi', name: 'A minor', notes: ['A4', 'C5', 'E5'], color: '#f0b56e' },
  viidim: { id: 'viidim', label: 'vii°', shortLabel: 'vii°', name: 'B diminished', notes: ['B4', 'D5', 'F5'], color: '#8f9bb3' },
};
export const CHORD_ORDER = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viidim'];

// One octave of the C major scale — default melody palette (Unit 4 / free-play).
export const MELODY_BLOCKS = {
  C4: { id: 'C4', label: 'C', shortLabel: 'C', notes: ['C4'], color: '#e8973a' },
  D4: { id: 'D4', label: 'D', shortLabel: 'D', notes: ['D4'], color: '#d4574a' },
  E4: { id: 'E4', label: 'E', shortLabel: 'E', notes: ['E4'], color: '#4fae8e' },
  F4: { id: 'F4', label: 'F', shortLabel: 'F', notes: ['F4'], color: '#6e8fb8' },
  G4: { id: 'G4', label: 'G', shortLabel: 'G', notes: ['G4'], color: '#c98fd6' },
  A4: { id: 'A4', label: 'A', shortLabel: 'A', notes: ['A4'], color: '#f0b56e' },
  B4: { id: 'B4', label: 'B', shortLabel: 'B', notes: ['B4'], color: '#8f9bb3' },
  C5: { id: 'C5', label: "C'", shortLabel: "C'", notes: ['C5'], color: '#e8973a' },
};
export const MELODY_ORDER = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4']; // high to low, piano-roll style
