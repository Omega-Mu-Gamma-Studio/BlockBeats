import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import useLessonStore from '../store/lessonStore';
import { LESSON_TITLES } from '../data/units';
import Companion from '../components/character/Companion';

// Placeholder lesson shell — the real swappable workspace (sequencer /
// block-chain / timeline by lesson type) gets built next. This just
// proves the navigation + completion + companion loop end to end.
const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { isLessonComplete, completeLesson } = useProgress();
  const { setExpression, setDialogue } = useLessonStore();

  const title = LESSON_TITLES[lessonId] || 'Untitled lesson';
  const done = isLessonComplete(lessonId);

  useEffect(() => {
    setExpression('thinking');
    setDialogue("Workspace isn't wired up yet — but the loop works. Try marking this one done.");
  }, [lessonId]);

  const handleComplete = () => {
    completeLesson(lessonId);
    setExpression('excited');
    setDialogue('Now that\'s a take.');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-ink-muted hover:text-ink-soft flex items-center gap-1 mb-6"
      >
        <i className="ti ti-arrow-left" aria-hidden="true" /> back
      </button>

      <h1 className="font-display text-2xl text-ink mb-2">{title}</h1>
      <p className="text-sm text-ink-muted mb-8">lesson {lessonId}</p>

      <div className="rounded-2xl border border-studio-border bg-studio-panel p-8 flex flex-col items-center text-center gap-6">
        <Companion size="lg" showBubble align="left" />
        <div className="border-2 border-dashed border-studio-border rounded-xl w-full py-10 text-ink-muted text-sm">
          lesson workspace goes here — sequencer / block-chain / timeline, depending on lesson type
        </div>
        {!done ? (
          <button
            onClick={handleComplete}
            className="rounded-full bg-amber text-studio-bg text-sm font-medium px-6 py-2 hover:bg-amber-soft transition-colors"
          >
            mark complete
          </button>
        ) : (
          <p className="text-sm text-teal flex items-center gap-1">
            <i className="ti ti-check" aria-hidden="true" /> logged
          </p>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
