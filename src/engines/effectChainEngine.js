import * as Tone from 'tone';

// Builds a real Tone.js effect chain from an ordered list of effect
// blocks + params, and runs a short test loop through it so changes are
// audible immediately. Rebuilding the whole chain on every param tweak is
// the simplest approach that stays correct — Tone.js effects like Reverb
// don't all support live-updating every parameter in place.
let nodes = [];
let source = null;
let loop = null;
let started = false;

async function ensureStarted() {
  if (!started) {
    await Tone.start();
    started = true;
  }
}

function buildNode(effectId, params) {
  switch (effectId) {
    case 'eq':
      return new Tone.EQ3({ low: params.low, mid: params.mid, high: params.high });
    case 'compression':
      return new Tone.Compressor(params.threshold, params.ratio);
    case 'reverb': {
      const rv = new Tone.Reverb(params.decay);
      rv.wet.value = params.wet;
      return rv;
    }
    case 'delay': {
      const dl = new Tone.FeedbackDelay(params.delayTime, params.feedback);
      dl.wet.value = params.wet;
      return dl;
    }
    default:
      return null;
  }
}

// chain: [{ id, params }], in signal-flow order
export async function previewChain(chain) {
  await ensureStarted();
  disposeChain();

  nodes = chain.map(({ id, params }) => buildNode(id, params)).filter(Boolean);
  source = new Tone.MembraneSynth({ envelope: { attack: 0.001, decay: 0.3, sustain: 0 } });

  let last = source;
  nodes.forEach((node) => {
    last.connect(node);
    last = node;
  });
  last.toDestination();

  loop = new Tone.Sequence(
    (time, note) => {
      if (note) source.triggerAttackRelease(note, '8n', time);
    },
    ['C2', null, 'C2', null, 'C2', null, 'C2', null],
    '8n'
  );
  loop.start(0);
  Tone.Transport.start();
}

export function disposeChain() {
  if (loop) {
    loop.stop();
    loop.dispose();
    loop = null;
  }
  Tone.Transport.stop();
  Tone.Transport.cancel();
  nodes.forEach((n) => n.dispose());
  nodes = [];
  if (source) {
    source.dispose();
    source = null;
  }
}

export function isChainPlaying() {
  return loop !== null;
}
