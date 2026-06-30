import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const XP_PER_LEVEL = 150;

const useProgressStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 40,
      completedLessons: {},
      equippedWallpaper: 'wallpaper-vinyl-room',
      equippedOutfit: 'gear-default',
      lastVisited: null,

      // -- derived --
      getLevel: () => Math.floor(get().xp / XP_PER_LEVEL) + 1,
      getLevelProgress: () => Math.round(((get().xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100),
      getXPToNextLevel: () => XP_PER_LEVEL - (get().xp % XP_PER_LEVEL),
      isLessonComplete: (lessonId) => !!get().completedLessons[lessonId],
      getUnitProgress: (unitId, lessonIds) => {
        const done = lessonIds.filter((id) => get().completedLessons[id]).length;
        return { done, total: lessonIds.length, pct: Math.round((done / lessonIds.length) * 100) };
      },

      // -- actions --
      completeLesson: (lessonId, xpReward = 25, coinReward = 10) =>
        set((state) => ({
          completedLessons: { ...state.completedLessons, [lessonId]: true },
          xp: state.xp + (state.completedLessons[lessonId] ? 0 : xpReward),
          coins: state.coins + (state.completedLessons[lessonId] ? 0 : coinReward),
        })),
      setLastVisited: (lessonId) => set({ lastVisited: lessonId }),
      setWallpaper: (id) => set({ equippedWallpaper: id }),
      setOutfit: (id) => set({ equippedOutfit: id }),
      spendCoins: (amount) => {
        if (get().coins < amount) return false;
        set((state) => ({ coins: state.coins - amount }));
        return true;
      },
    }),
    { name: 'blockbeats-progress' }
  )
);

export default useProgressStore;
