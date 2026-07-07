import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useLessonStore from '../store/lessonStore';
import { useProgress } from './useProgress';
import { getLessonContent } from '../services/lessonService';
import { validatePattern, countMisplaced } from '../engines/validationEngine';

// Drives a single lesson's phase state machine: intro -> explanation ->
// example -> test -> complete. Currently the shape Unit 1 lessons use;
// bad_example / challenge / BTS phases from the README's full 6-phase
// spec aren't wired up yet (see flagged inconsistency).
export const PHASES = ['intro', 'explanation', 'example', 'test', 'complete'];

export function useLesson(lessonId) {
  const navigate = useNavigate();
  const { completeLesson } = useProgress();
  const {
    phaseIndex, attempts, hintsShown, placedBlocks,
    resetLesson, nextPhase, setPhaseIndex,
    placeBlock, removeBlock, clearBlocks,
    registerAttempt, showNextHint,
    setExpression, setDialogue,
  } = useLessonStore();

  const lesson = useMemo(() => getLessonContent(lessonId), [lessonId]);
  const phase = PHASES[phaseIndex];

  useEffect(() => {
    resetLesson();
  }, [lessonId]);

  useEffect(() => {
    if (!lesson) return;
    if (phase === 'intro') {
      setExpression('teaching');
      setDialogue(lesson.intro?.dialogue || '');
    } else if (phase === 'explanation') {
      setExpression('thinking');
      setDialogue(lesson.explanation?.dialogue || '');
    } else if (phase === 'example') {
      setExpression('idle');
      setDialogue(lesson.example?.dialogue || '');
    } else if (phase === 'test') {
      setExpression('teaching');
      setDialogue(lesson.test?.dialogue || '');
    } else if (phase === 'complete') {
      setExpression('excited');
      setDialogue(lesson.complete?.dialogue || '');
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
      nextPhase();
      completeLesson(lessonId, lesson.complete?.xpReward, lesson.complete?.coinReward);
      return { correct: true };
    }
    const diff = countMisplaced(placedBlocks, targetPattern);
    if (attempts + 1 >= 2 && hintsShown < 2) showNextHint();
    return { correct: false, ...diff };
  };

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
    goHome: () => navigate('/'),
  };
}
