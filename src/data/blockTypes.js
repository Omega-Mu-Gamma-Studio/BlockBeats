// Drum block definitions for Unit 1 (rhythm). Each block maps to a real
// sample in public/audio/drums so the sequencer can actually play.
export const BLOCK_TYPES = {
  kick: {
    id: 'kick',
    label: 'Kick',
    shortLabel: 'K',
    color: '#e8973a', // amber
    sample: '/audio/drums/kick.wav',
    description: 'The low thump. Anchors the pulse.',
  },
  snare: {
    id: 'snare',
    label: 'Snare',
    shortLabel: 'S',
    color: '#d4574a', // coral
    sample: '/audio/drums/snare.wav',
    description: 'The crack on the backbeat.',
  },
  hihat: {
    id: 'hihat',
    label: 'Hi-hat',
    shortLabel: 'H',
    color: '#4fae8e', // teal
    sample: '/audio/drums/hihat.wav',
    description: 'Fills the space between kick and snare.',
  },
};

export const BLOCK_ORDER = ['kick', 'snare', 'hihat'];
