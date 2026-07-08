import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import useLessonStore from '../store/lessonStore';
import { UNITS } from '../data/units';
import { WALLPAPERS } from '../data/shopItems';
import Companion from '../components/character/Companion';

const GREETINGS = [
  "Back again? Pull up a chair, let's make something.",
  "Pick a track, any track. I'll keep the levels honest.",
  "The room's warm and the gear's patient. Where were we?",
  "Good session yesterday. Let's not waste today's ears.",
];

const Home = () => {
  const navigate = useNavigate();
  const { level, completedLessons, equippedWallpaper, getUnitProgress } = useProgress();
  const { say } = useLessonStore();

  const wallpaper = WALLPAPERS.find((w) => w.id === equippedWallpaper) || WALLPAPERS[0];

  useEffect(() => {
    say('melody', GREETINGS[Math.floor(Math.random() * GREETINGS.length)], 'neutral');
  }, []);

  const totalLessons = UNITS.reduce((sum, u) => sum + u.lessons.length, 0);
  const totalDone = Object.keys(completedLessons).length;

  return (
    <div>
      {/* hero: wallpaper + companion + nudge, one diegetic moment */}
      <section
        className="relative overflow-hidden border-b border-studio-border"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(21,17,13,0.55) 0%, rgba(21,17,13,0.85) 100%), url(${wallpaper.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-14 flex items-end justify-between gap-8 min-h-[280px]">
          <div className="max-w-md">
            <p className="text-amber-soft text-sm font-medium tracking-wide mb-2">
              {totalDone} of {totalLessons} lessons logged · level {level}
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-ink mb-1">
              welcome back to the studio
            </h1>
          </div>
          <Companion twin="melody" size="lg" align="right" />
        </div>
      </section>

      {/* crate row — open browsing, every unit visible */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-ink">your crates</h2>
          <span className="text-xs text-ink-muted">scroll for more →</span>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-3 -mx-1 px-1">
          {UNITS.map((unit) => {
            const progress = getUnitProgress(unit.id, unit.lessons);
            const unlocked = level >= unit.requiredLevel;
            return (
              <motion.button
                key={unit.id}
                onClick={() => navigate(`/unit/${unit.id}`)}
                whileHover={{ y: -3 }}
                className={`flex-shrink-0 w-44 text-left rounded-2xl border p-4 transition-colors ${
                  unlocked
                    ? 'border-studio-border bg-studio-panel hover:border-amber/50'
                    : 'border-studio-border bg-studio-panel/40'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mb-6 ${
                    unlocked ? 'bg-amber/15 text-amber' : 'bg-studio-surface text-ink-muted'
                  }`}
                >
                  <i className={`ti ${unit.icon}`} aria-hidden="true" />
                </div>
                <p className={`font-display text-base mb-0.5 ${unlocked ? 'text-ink' : 'text-ink-muted'}`}>
                  {unit.title}
                </p>
                <p className="text-xs text-ink-muted mb-3">{unit.subtitle}</p>

                {unlocked ? (
                  <div>
                    <div className="h-1.5 rounded-full bg-studio-surface overflow-hidden mb-1">
                      <div className="h-full bg-amber" style={{ width: `${progress.pct}%` }} />
                    </div>
                    <span className="text-[11px] text-ink-muted">
                      {progress.done}/{progress.total} done
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-ink-muted flex items-center gap-1">
                    <i className="ti ti-lock" aria-hidden="true" /> level {unit.requiredLevel} preview
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* shop door */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <button
          onClick={() => navigate('/shop')}
          className="w-full flex items-center justify-between rounded-2xl border border-studio-border bg-studio-panel hover:border-amber/50 px-6 py-4 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-coral/15 text-coral flex items-center justify-center">
              <i className="ti ti-door" aria-hidden="true" />
            </div>
            <div className="text-left">
              <p className="font-display text-base text-ink">the shop, through the back</p>
              <p className="text-xs text-ink-muted">wallpapers, gear, cosmetics</p>
            </div>
          </div>
          <i className="ti ti-arrow-right text-ink-muted" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
};

export default Home;
