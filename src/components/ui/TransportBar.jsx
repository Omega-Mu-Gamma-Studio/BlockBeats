import { motion } from 'framer-motion';

// Play/stop control + bpm readout for a pattern preview or test grid.
const TransportBar = ({ isPlaying, onPlay, onStop, bpm }) => (
  <div className="flex items-center justify-center gap-4">
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={isPlaying ? onStop : onPlay}
      className="w-11 h-11 rounded-full bg-amber text-studio-bg flex items-center justify-center hover:bg-amber-soft transition-colors"
    >
      <i className={`ti ${isPlaying ? 'ti-player-stop' : 'ti-player-play'} text-lg`} aria-hidden="true" />
    </motion.button>
    <span className="text-xs text-ink-muted font-mono">{bpm} bpm</span>
  </div>
);

export default TransportBar;
