import { create } from 'zustand';

// Drives the companion's sprite + dialogue, plus the in-lesson state
// machine (phase, attempts, placed blocks, hints) for whichever lesson
// is currently open. NOTE: still single-companion — the README's twin
// Melody/Harmony rework hasn't landed yet, see flagged inconsistency.
const useLessonStore = create((set) => ({
  expression: 'idle-sleeping',
  dialogue: '',
  setExpression: (expression) => set({ expression }),
  setDialogue: (dialogue) => set({ dialogue }),
  say: (dialogue, expression) => set({ dialogue, ...(expression ? { expression } : {}) }),

  // -- lesson state machine --
  phaseIndex: 0,
  attempts: 0,
  hintsShown: 0,
  placedBlocks: {}, // { [blockId]: Set<stepIndex> }

  resetLesson: () =>
    set({ phaseIndex: 0, attempts: 0, hintsShown: 0, placedBlocks: {} }),

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
