import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLessonStore from '../../store/lessonStore';

// 8 sprites total, 4 per twin (README §5) — locked names/paths, art not
// painted yet. Files exist as empty placeholders in public/sprites so the
// import paths are already correct once real art lands; until then the
// <img> fails to load and Companion falls back to a CSS avatar below.
const SPRITES = {
  melody: {
    neutral: '/sprites/melody-neutral.png',
    teaching: '/sprites/melody-teaching.png',
    excited: '/sprites/melody-excited.png',
    thinking: '/sprites/melody-thinking.png',
  },
  harmony: {
    neutral: '/sprites/harmony-neutral.png',
    teaching: '/sprites/harmony-teaching.png',
    intrigued: '/sprites/harmony-intrigued.png',
    analyzing: '/sprites/harmony-analyzing.png',
  },
};

const ACCENT = {
  melody: '#FF6B9D',
  harmony: '#00D4FF',
};

const INITIAL = {
  melody: 'M',
  harmony: 'H',
};

// Renders one twin's portrait + optional dialogue bubble. `twin` picks
// which of Melody/Harmony this instance is — the explanation phase renders
// two Companions side by side (see TwinBanter.jsx) for the back-and-forth;
// everywhere else a single Companion speaks alone.
const Companion = ({ twin = 'melody', size = 'lg', showBubble = true, align = 'right' }) => {
  const { expressions, activeTwin, dialogue } = useLessonStore();
  const [artMissing, setArtMissing] = useState(false);

  const expression = expressions[twin] || 'neutral';
  const sprites = SPRITES[twin] || SPRITES.melody;
  const src = sprites[expression] || sprites.neutral;
  const accent = ACCENT[twin];
  const dims = size === 'lg' ? 'w-40 h-40 md:w-52 md:h-52' : 'w-20 h-20';
  const showThisBubble = showBubble && dialogue && activeTwin === twin;

  return (
    <div className={`flex items-end gap-3 ${align === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
      <AnimatePresence mode="wait">
        {artMissing ? (
          // Fallback avatar — no illustrated sprite yet, so keep the UI
          // looking intentional (not a broken-image icon) until the real
          // ink-wash portraits (§5) are painted in.
          <motion.div
            key={`${twin}-fallback`}
            className={`${dims} rounded-full flex items-center justify-center select-none border-2`}
            style={{
              borderColor: accent,
              background: `radial-gradient(circle at 35% 30%, ${accent}33, transparent 70%)`,
              color: accent,
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-display text-3xl md:text-4xl">{INITIAL[twin]}</span>
          </motion.div>
        ) : (
          <motion.img
            key={src}
            src={src}
            alt={twin === 'melody' ? 'Melody' : 'Harmony'}
            className={`${dims} object-contain drop-shadow-xl select-none`}
            draggable={false}
            onError={() => setArtMissing(true)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {showThisBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs rounded-2xl bg-studio-panel/90 border px-4 py-3 text-sm text-ink-soft backdrop-blur-sm"
          style={{ borderColor: `${accent}55` }}
        >
          {dialogue}
        </motion.div>
      )}
    </div>
  );
};

export default Companion;
