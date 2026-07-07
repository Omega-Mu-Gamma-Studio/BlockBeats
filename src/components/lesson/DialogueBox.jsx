import { motion, AnimatePresence } from 'framer-motion';

// Text card for the current phase's line. Separate from the Companion
// sprite/bubble so the lesson layout can place them independently.
const DialogueBox = ({ dialogue, onContinue, continueLabel = 'continue' }) => (
  <div className="rounded-2xl border border-studio-border bg-studio-panel px-6 py-5">
    <AnimatePresence mode="wait">
      <motion.p
        key={dialogue}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="text-ink-soft text-sm md:text-base leading-relaxed"
      >
        {dialogue}
      </motion.p>
    </AnimatePresence>
    {onContinue && (
      <button
        onClick={onContinue}
        className="mt-4 rounded-full bg-amber text-studio-bg text-sm font-medium px-5 py-2 hover:bg-amber-soft transition-colors flex items-center gap-1"
      >
        {continueLabel} <i className="ti ti-arrow-right" aria-hidden="true" />
      </button>
    )}
  </div>
);

export default DialogueBox;
