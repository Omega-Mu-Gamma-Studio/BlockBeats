import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import useLessonStore from '../store/lessonStore';
import { UNITS, LESSON_TITLES } from '../data/units';

const UnitPage = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { isLessonComplete } = useProgress();
  const { say } = useLessonStore();

  const unit = UNITS.find((u) => u.id === unitId);

  useEffect(() => {
    say('harmony', unit ? `Pick a track. We'll take it from the top.` : '', 'teaching');
  }, [unitId]);

  if (!unit) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 text-ink-muted">
        Can't find that crate. <Link to="/" className="text-amber">Back home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="text-xs text-ink-muted hover:text-ink-soft flex items-center gap-1 mb-6">
        <i className="ti ti-arrow-left" aria-hidden="true" /> back to crates
      </Link>

      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-full bg-amber/15 text-amber flex items-center justify-center">
          <i className={`ti ${unit.icon}`} aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-ink">{unit.title}</h1>
          <p className="text-sm text-ink-muted">{unit.subtitle}</p>
        </div>
      </div>

      {/* setlist */}
      <div className="mt-8 rounded-2xl border border-studio-border bg-studio-panel divide-y divide-studio-border overflow-hidden">
        {unit.lessons.map((lessonId, i) => {
          const done = isLessonComplete(lessonId);
          return (
            <button
              key={lessonId}
              onClick={() => navigate(`/lesson/${lessonId}`)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-studio-surface/60 transition-colors text-left"
            >
              <span className="text-xs text-ink-muted w-5">{String(i + 1).padStart(2, '0')}</span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  done ? 'bg-teal/20 text-teal' : 'bg-studio-surface text-ink-muted'
                }`}
              >
                <i className={`ti ${done ? 'ti-check' : 'ti-player-play'}`} aria-hidden="true" />
              </div>
              <span className="flex-1 text-sm text-ink-soft">{LESSON_TITLES[lessonId]}</span>
              {done && <span className="text-[11px] text-teal">logged</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UnitPage;
