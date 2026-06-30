import { create } from 'zustand';

// Drives the companion's sprite + dialogue from anywhere in the app.
const useLessonStore = create((set) => ({
  expression: 'idle-sleeping',
  dialogue: '',
  setExpression: (expression) => set({ expression }),
  setDialogue: (dialogue) => set({ dialogue }),
  say: (dialogue, expression) => set({ dialogue, ...(expression ? { expression } : {}) }),
}));

export default useLessonStore;
