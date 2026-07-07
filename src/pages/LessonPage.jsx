import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { LESSON_TITLES } from '../data/units';
import { useProgress } from '../hooks/useProgress';
import Companion from '../components/character/Companion';
import DialogueBox from '../components/lesson/DialogueBox';
import PhaseIndicator from '../components/lesson/PhaseIndicator';
import LessonCanvas from '../components/lesson/LessonCanvas';
import TransportBar from '../components/ui/TransportBar';
import { useLesson } from '../hooks/useLesson';
import { useAudio } from '../hooks/useAudio';

// Lessons with real interactive content render through useLesson +
// LessonCanvas below. Everything else still falls back to the original
// placeholder shell until its JSON + block config gets written.
const SUPPORTED_LESSONS = ['1-1'];

const PlaceholderLesson = ({ lessonId, title, isLessonComplete, completeLesson }) => {
  const done = isLessonComplete(lessonId);
  return (
    <div className="rounded-2xl border border-studio-border bg-studio-panel p-8 flex flex-col items-center text-center gap-6">
      <Companion size="lg" showBubble align="left" />
      <div className="border-2 border-dashed border-studio-border rounded-xl w-full py-10 text-ink-muted text-sm">
        lesson workspace goes here — this lesson's content hasn't been written yet
      </div>
      {!done ? (
        <button
          onClick={() => completeLesson(lessonId)}
          className="rounded-full bg-amber text-studio-bg text-sm font-medium px-6 py-2 hover:bg-amber-soft transition-colors"
        >
          mark complete
        </button>
      ) : (
        <p className="text-sm text-teal flex items-center gap-1">
          <i className="ti ti-check" aria-hidden="true" /> logged
        </p>
      )}
      <p className="text-xs text-ink-muted">{title}</p>
    </div>
  );
};

const ExamplePlayer = ({ lesson }) => {
  const { isPlaying, currentStep, play, stop } = useAudio();
  const pattern = Object.fromEntries(
    Object.entries(lesson.example.pattern).map(([k, v]) => [k, new Set(v)])
  );

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-studio-border bg-studio-panel p-6">
      <div className="grid gap-2 w-full" style={{ gridTemplateColumns: `repeat(${lesson.stepCount}, minmax(0,1fr))` }}>
        {Array.from({ length: lesson.stepCount }, (_, step) => {
          const active = Object.entries(pattern).some(([, steps]) => steps.has(step));
          return (
            <div
              key={step}
              className={`aspect-square rounded-lg border flex items-center justify-center text-[10px] ${
                currentStep === step
                  ? 'border-amber bg-amber/20'
                  : active
                  ? 'border-amber/50 bg-amber/10 text-amber'
                  : 'border-studio-border bg-studio-surface/60 text-ink-muted'
              }`}
            >
              {active ? '●' : ''}
            </div>
          );
        })}
      </div>
      <TransportBar
        isPlaying={isPlaying}
        onPlay={() => play(pattern, { stepCount: lesson.stepCount, bpm: lesson.bpm })}
        onStop={stop}
        bpm={lesson.bpm}
      />
    </div>
  );
};

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);

  const supported = SUPPORTED_LESSONS.includes(lessonId);
  const {
    lesson, phase, phaseIndex, totalPhases,
    placedBlocks, hintsShown,
    placeBlock, removeBlock, nextPhase, submitTest,
  } = useLesson(supported ? lessonId : null);
  const { isLessonComplete, completeLesson } = useProgress();

  const title = LESSON_TITLES[lessonId] || 'Untitled lesson';

  useEffect(() => {
    if (phase === 'complete') {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#e8973a', '#f0b56e', '#4fae8e'] });
    }
  }, [phase]);

  const handleSubmit = () => {
    const result = submitTest();
    setFeedback(result.correct ? null : 'wrong');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-ink-muted hover:text-ink-soft flex items-center gap-1 mb-6"
      >
        <i className="ti ti-arrow-left" aria-hidden="true" /> back
      </button>

      <h1 className="font-display text-2xl text-ink mb-1">{title}</h1>
      <p className="text-sm text-ink-muted mb-6">lesson {lessonId}</p>

      {!supported || !lesson ? (
        <PlaceholderLesson
          lessonId={lessonId}
          title={title}
          isLessonComplete={isLessonComplete}
          completeLesson={completeLesson}
        />
      ) : (
        <>
          <PhaseIndicator phaseIndex={phaseIndex} total={totalPhases} />

          <div className="flex flex-col items-center gap-6">
            <Companion size="sm" showBubble={false} align="left" />

            {phase === 'intro' && (
              <DialogueBox dialogue={lesson.intro.dialogue} onContinue={nextPhase} continueLabel="go on" />
            )}

            {phase === 'explanation' && (
              <DialogueBox dialogue={lesson.explanation.dialogue} onContinue={nextPhase} continueLabel="show me" />
            )}

            {phase === 'example' && (
              <div className="w-full flex flex-col items-center gap-5">
                <DialogueBox dialogue={lesson.example.dialogue} />
                <ExamplePlayer lesson={lesson} />
                <button
                  onClick={nextPhase}
                  className="rounded-full bg-amber text-studio-bg text-sm font-medium px-6 py-2 hover:bg-amber-soft transition-colors flex items-center gap-1"
                >
                  my turn <i className="ti ti-arrow-right" aria-hidden="true" />
                </button>
              </div>
            )}

            {phase === 'test' && (
              <div className="w-full flex flex-col items-center gap-5">
                <DialogueBox dialogue={lesson.test.dialogue} />
                <LessonCanvas
                  lesson={lesson}
                  placedBlocks={placedBlocks}
                  onPlace={placeBlock}
                  onRemove={removeBlock}
                  onSubmit={handleSubmit}
                  hintsShown={hintsShown}
                  feedback={feedback}
                />
              </div>
            )}

            {phase === 'complete' && (
              <div className="w-full flex flex-col items-center gap-5">
                <DialogueBox dialogue={lesson.complete.dialogue} />
                <p className="text-sm text-teal flex items-center gap-1">
                  <i className="ti ti-check" aria-hidden="true" /> +{lesson.complete.xpReward} xp,
                  +{lesson.complete.coinReward} coins
                </p>
                <div className="flex gap-3">
                  <Link
                    to={`/unit/${lesson.unit}`}
                    className="rounded-full border border-studio-border text-ink-soft text-sm px-5 py-2 hover:border-amber/50 transition-colors"
                  >
                    back to unit
                  </Link>
                  <Link
                    to="/"
                    className="rounded-full bg-amber text-studio-bg text-sm font-medium px-5 py-2 hover:bg-amber-soft transition-colors"
                  >
                    home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LessonPage;
