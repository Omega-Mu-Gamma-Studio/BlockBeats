import { create } from 'zustand';

// Drives the Melody/Harmony twin system (README §5) plus the in-lesson
// state machine (phase, attempts, placed blocks, hints) for whichever
// lesson is currently open.
//
// Two dialogue modes:
//  - single speaker (`say`): one twin talks — used for intro, examples_bts,
//    bad_example, test, challenge, complete.
//  - duo (`setDuo`): both twins talk back-to-back — used only for the
//    explanation phase, where Melody always speaks first (README §5).
const useLessonStore = create((set) => ({
  // -- twin / companion state --
  activeTwin: 'melody', // which twin is the current sole speaker (single mode)
  expressions: { melody: 'neutral', harmony: 'neutral' },
  dialogue: '', // single-speaker line; ignored while `duo` is set
  duo: null, // { melody: string, harmony: string } | null

  say: (twin, dialogue, expression) =>
    set((state) => ({
      activeTwin: twin,
      dialogue,
      duo: null,
      expressions: expression
        ? { ...state.expressions, [twin]: expression }
        : state.expressions,
    })),

  setDuo: (melodyLine, harmonyLine, expressions = {}) =>
    set((state) => ({
      duo: { melody: melodyLine, harmony: harmonyLine },
      expressions: { ...state.expressions, ...expressions },
    })),

  // -- lesson state machine --
  phaseIndex: 0,
  attempts: 0,
  hintsShown: 0,
  placedBlocks: {}, // { [blockId]: Set<stepIndex> }

  resetLesson: () =>
    set({ phaseIndex: 0, attempts: 0, hintsShown: 0, placedBlocks: {}, duo: null }),

  setPhaseIndex: (phaseIndex) => set({ phaseIndex }),
  nextPhase: () => set((state) => ({ phaseIndex: state.phaseIndex + 1 })),

  placeBlock: (blockId, step) =>
    set((state) => {
      const next = { ...state.placedBlocks };
      const stepSet = new Set(next[blockId] || []);
      stepSet.add(step);
      next[blockId] = stepSet;
      return { placedBlocks: next };
    }),
  removeBlock: (blockId, step) =>
    set((state) => {
      const next = { ...state.placedBlocks };
      const stepSet = new Set(next[blockId] || []);
      stepSet.delete(step);
      next[blockId] = stepSet;
      return { placedBlocks: next };
    }),
  clearBlocks: () => set({ placedBlocks: {} }),

  registerAttempt: () => set((state) => ({ attempts: state.attempts + 1 })),
  showNextHint: () =>
    set((state) => ({ hintsShown: Math.min(state.hintsShown + 1, 2) })),
}));

export default useLessonStore;
