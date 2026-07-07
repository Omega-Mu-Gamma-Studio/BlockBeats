import { AnimatePresence, motion } from 'framer-motion';

// Escalating hints shown after failed attempts (see useLesson's
// hintsShown counter). Nothing shows until the first miss.
const HintSystem = ({ hints, hintsShown }) => {
  if (!hints?.length || hintsShown === 0) return null;
  const visible = hints.slice(0, hintsShown);

  return (
    <div className="w-full space-y-2">
      <AnimatePresence>
        {visible.map((hint, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 rounded-xl border border-amber/30 bg-amber/5 px-4 py-2.5 text-xs text-ink-soft"
          >
            <i className="ti ti-bulb text-amber flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{hint}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HintSystem;
