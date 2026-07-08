import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useLessonStore from '../store/lessonStore';
import { useProgress } from './useProgress';
import { getLessonContent } from '../services/lessonService';
import { validatePattern, countMisplaced } from '../engines/validationEngine';

// Drives a single lesson's phase state machine, the full 6-phase shape
// from README §3: intro -> explanation -> examples_bts -> bad_example ->
// test -> challenge -> complete. `challenge` is optional/bonus-XP-only and
// can be skipped straight to `complete`.
export const PHASES = [
  'intro',
  'explanation',
  'examples_bts',
  'bad_example',
  'test',
  'challenge',
  'complete',
];

export function useLesson(lessonId) {
  const navigate = useNavigate();
  const { completeLesson } = useProgress();
  const {
    phaseIndex, attempts, hintsShown, placedBlocks,
    resetLesson, nextPhase, setPhaseIndex,
    placeBlock, removeBlock, clearBlocks,
    registerAttempt, showNextHint,
    say, setDuo,
  } = useLessonStore();

  const lesson = useMemo(() => getLessonContent(lessonId), [lessonId]);
  const phase = PHASES[phaseIndex];

  useEffect(() => {
    resetLesson();
  }, [lessonId]);

  useEffect(() => {
    if (!lesson) return;

    if (phase === 'intro') {
      const speaker = lesson.intro?.speaker || 'melody';
      say(speaker, lesson.intro?.dialogue || '', 'teaching');
    } else if (phase === 'explanation') {
      // Both twins always speak here, Melody first (README §5) — this is
      // the core teaching mechanic, so it gets its own duo dialogue mode
      // instead of the single-speaker `say`.
      setDuo(
        lesson.explanation?.melody?.dialogue || '',
        lesson.explanation?.harmony?.dialogue || '',
        { melody: 'teaching', harmony: 'teaching' }
      );
    } else if (phase === 'examples_bts') {
      const speaker = lesson.examples_bts?.speaker || 'melody';
      say(speaker, lesson.examples_bts?.dialogue || '', speaker === 'harmony' ? 'analyzing' : 'teaching');
    } else if (phase === 'bad_example') {
      const speaker = lesson.bad_example?.speaker || 'harmony';
      say(speaker, lesson.bad_example?.dialogue || '', speaker === 'harmony' ? 'analyzing' : 'thinking');
    } else if (phase === 'test') {
      say('melody', lesson.test?.dialogue || '', 'excited');
    } else if (phase === 'challenge') {
      const speaker = lesson.challenge?.speaker || 'harmony';
      say(speaker, lesson.challenge?.dialogue || '', 'intrigued');
    } else if (phase === 'complete') {
      const speaker = lesson.complete?.speaker || 'melody';
      say(speaker, lesson.complete?.dialogue || '', 'excited');
    }
  }, [phase, lesson]);

  const targetPattern = useMemo(() => {
    if (!lesson?.test?.target) return {};
    const out = {};
    Object.entries(lesson.test.target).forEach(([blockId, steps]) => {
      out[blockId] = new Set(steps);
    });
    return out;
  }, [lesson]);

  const submitTest = () => {
    if (!lesson) return { correct: false };
    const correct = validatePattern(placedBlocks, targetPattern, lesson.validationMode);
    registerAttempt();
    if (correct) {
      nextPhase(); // -> challenge (optional)
      return { correct: true };
    }
    const diff = countMisplaced(placedBlocks, targetPattern);
    if (attempts + 1 >= 2 && hintsShown < 2) showNextHint();
    return { correct: false, ...diff };
  };

  // Challenge is bonus-only (README §3) — skipping it still finishes the
  // lesson and awards the base xp/coin reward.
  const finishLesson = () => {
    setPhaseIndex(PHASES.indexOf('complete'));
    completeLesson(lessonId, lesson?.complete?.xpReward, lesson?.complete?.coinReward);
  };

  const skipChallenge = () => finishLesson();

  const completeChallenge = () => finishLesson();

  return {
    lesson,
    phase,
    phaseIndex,
    totalPhases: PHASES.length,
    attempts,
    hintsShown,
    placedBlocks,
    targetPattern,
    placeBlock,
    removeBlock,
    clearBlocks,
    nextPhase,
    setPhaseIndex,
    submitTest,
    skipChallenge,
    completeChallenge,
    goHome: () => navigate('/'),
  };
}
