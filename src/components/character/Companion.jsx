import { motion, AnimatePresence } from 'framer-motion';
import useLessonStore from '../../store/lessonStore';

const SPRITES = {
  idle: '/sprites/teaching.png',
  'idle-sleeping': '/sprites/idle-sleeping.png',
  teaching: '/sprites/teaching.png',
  thinking: '/sprites/thinking.png',
  excited: '/sprites/excited.png',
  frustrated: '/sprites/frustrated.png',
  oops: '/sprites/oops.png',
};

// Companion sprite + dialogue bubble, diegetic on the hero scene.
// size: 'lg' for Home hero, 'sm' for tucked-corner use on Lesson/Unit pages.
const Companion = ({ size = 'lg', showBubble = true, align = 'right' }) => {
  const { expression, dialogue } = useLessonStore();
  const src = SPRITES[expression] || SPRITES.idle;
  const dims = size === 'lg' ? 'w-40 h-40 md:w-52 md:h-52' : 'w-20 h-20';

  return (
    <div className={`flex items-end gap-3 ${align === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          alt="studio companion"
          className={`${dims} object-contain drop-shadow-xl select-none`}
          draggable={false}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      </AnimatePresence>

      {showBubble && dialogue && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs rounded-2xl bg-studio-panel/90 border border-studio-border px-4 py-3 text-sm text-ink-soft backdrop-blur-sm"
        >
          {dialogue}
        </motion.div>
      )}
    </div>
  );
};

export default Companion;
