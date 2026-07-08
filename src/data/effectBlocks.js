// Effect block definitions for the EffectChain BTS view (Unit 6 mixing).
// Each block maps to a real Tone.js effect node so the chain actually
// processes audio, plus a `params` list describing the sliders the UI
// should render (key must match the Tone.js node's settable property).
export const EFFECT_TYPES = {
  eq: {
    id: 'eq',
    label: 'EQ',
    shortLabel: 'EQ',
    color: '#e8973a',
    description: 'Shape the tone — cut or boost low, mid, and high.',
    params: [
      { key: 'low', label: 'Low', min: -24, max: 24, step: 1, default: 0, unit: 'dB' },
      { key: 'mid', label: 'Mid', min: -24, max: 24, step: 1, default: 0, unit: 'dB' },
      { key: 'high', label: 'High', min: -24, max: 24, step: 1, default: 0, unit: 'dB' },
    ],
  },
  compression: {
    id: 'compression',
    label: 'Compression',
    shortLabel: 'Comp',
    color: '#d4574a',
    description: 'Even out the loud and quiet parts.',
    params: [
      { key: 'threshold', label: 'Threshold', min: -60, max: 0, step: 1, default: -24, unit: 'dB' },
      { key: 'ratio', label: 'Ratio', min: 1, max: 20, step: 1, default: 4, unit: ':1' },
    ],
  },
  reverb: {
    id: 'reverb',
    label: 'Reverb',
    shortLabel: 'Verb',
    color: '#4fae8e',
    description: 'Add space — a room, a hall, a cave.',
    params: [
      { key: 'decay', label: 'Decay', min: 0.1, max: 8, step: 0.1, default: 2, unit: 's' },
      { key: 'wet', label: 'Mix', min: 0, max: 1, step: 0.05, default: 0.3, unit: '' },
    ],
  },
  delay: {
    id: 'delay',
    label: 'Delay',
    shortLabel: 'Delay',
    color: '#6e8fb8',
    description: 'Repeat the sound, fading each echo.',
    params: [
      { key: 'delayTime', label: 'Time', min: 0.05, max: 1, step: 0.05, default: 0.25, unit: 's' },
      { key: 'feedback', label: 'Feedback', min: 0, max: 0.9, step: 0.05, default: 0.3, unit: '' },
      { key: 'wet', label: 'Mix', min: 0, max: 1, step: 0.05, default: 0.3, unit: '' },
    ],
  },
};
export const EFFECT_ORDER = ['eq', 'compression', 'reverb', 'delay'];
