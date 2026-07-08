import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Companion from '../character/Companion';

// The explanation phase's core mechanic (README §5): both twins speak
// back to back on the same concept. Melody always goes first with the
// feeling/metaphor, then Harmony follows with the structure/mechanics.
// Revealed one line at a time so it reads as a conversation, not a wall
// of text from two people at once.
const TwinBanter = ({ melodyLine, harmonyLine, onContinue, continueLabel = 'show me' }) => {
  const [revealed, setRevealed] = useState(1); // 1 = Melody only, 2 = both

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Companion twin="melody" size="sm" showBubble={false} align="left" />
        <div
          className="rounded-2xl border px-5 py-4 text-sm text-ink-soft leading-relaxed flex-1"
          style={{ borderColor: '#FF6B9D55' }}
        >
          <p className="text-[11px] font-medium mb-1" style={{ color: '#FF6B9D' }}>
            Melody
          </p>
          {melodyLine}
        </div>
      </div>

      <AnimatePresence>
        {revealed >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-3 flex-row-reverse"
          >
            <Companion twin="harmony" size="sm" showBubble={false} align="right" />
            <div
              className="rounded-2xl border px-5 py-4 text-sm text-ink-soft leading-relaxed flex-1"
              style={{ borderColor: '#00D4FF55' }}
            >
              <p className="text-[11px] font-medium mb-1 text-right" style={{ color: '#00D4FF' }}>
                Harmony
              </p>
              {harmonyLine}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-1">
        {revealed < 2 ? (
          <button
            onClick={() => setRevealed(2)}
            className="rounded-full border border-studio-border text-ink-soft text-sm font-medium px-5 py-2 hover:border-amber/50 transition-colors flex items-center gap-1"
          >
            and Harmony says... <i className="ti ti-arrow-right" aria-hidden="true" />
          </button>
        ) : (
          <button
            onClick={onContinue}
            className="rounded-full bg-amber text-studio-bg text-sm font-medium px-6 py-2 hover:bg-amber-soft transition-colors flex items-center gap-1"
          >
            {continueLabel} <i className="ti ti-arrow-right" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TwinBanter;
