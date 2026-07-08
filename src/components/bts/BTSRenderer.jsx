import WaveformView from './WaveformView';
import PianoRoll from './PianoRoll';
import EffectChain from './EffectChain';

// Single entry point for the BTS/mini-DAW view (README §4). `kind` picks
// the renderer; everything else is passed straight through so lessons and
// the free-play page share one component instead of each wiring the three
// views separately.
const BTSRenderer = ({ kind, ...props }) => {
  switch (kind) {
    case 'pianoRoll':
      return <PianoRoll kind="chords" {...props} />;
    case 'melodyRoll':
      return <PianoRoll kind="melody" {...props} />;
    case 'effectChain':
      return <EffectChain {...props} />;
    case 'waveform':
    default:
      return <WaveformView {...props} />;
  }
};

export default BTSRenderer;
