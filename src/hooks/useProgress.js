import useProgressStore from '../store/progressStore';

// Convenience hook — most components just need a handful of these.
export function useProgress() {
  const store = useProgressStore();
  return {
    xp: store.xp,
    coins: store.coins,
    level: store.getLevel(),
    levelProgress: store.getLevelProgress(),
    xpToNextLevel: store.getXPToNextLevel(),
    completedLessons: store.completedLessons,
    equippedWallpaper: store.equippedWallpaper,
    equippedOutfit: store.equippedOutfit,
    lastVisited: store.lastVisited,

    isLessonComplete: store.isLessonComplete,
    getUnitProgress: store.getUnitProgress,

    completeLesson: store.completeLesson,
    setLastVisited: store.setLastVisited,
    setWallpaper: store.setWallpaper,
    setOutfit: store.setOutfit,
    spendCoins: store.spendCoins,
  };
}
