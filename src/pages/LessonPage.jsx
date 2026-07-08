import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { LESSON_TITLES } from '../data/units';
import { useProgress } from '../hooks/useProgress';
import Companion from '../components/character/Companion';
import TwinBanter from '../components/character/TwinBanter';
import DialogueBox from '../components/lesson/DialogueBox';
import PhaseIndicator from '../components/lesson/PhaseIndicator';
import LessonCanvas from '../components/lesson/LessonCanvas';
import TransportBar from '../components/ui/TransportBar';
import BTSRenderer from '../components/bts/BTSRenderer';
import { useLesson } from '../hooks/useLesson';
import { useAudio } from '../hooks/useAudio';

const PlaceholderLesson = ({ lessonId, title, isLessonComplete, completeLesson }) => {
  const done = isLessonComplete(lessonId);
  return (
    <div className="rounded-2xl border border-studio-border bg-studio-panel p-8 flex flex-col items-center text-center gap-6">
      <Companion twin="melody" size="lg" showBubble align="left" />
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

// Shared step-grid preview, used for both examples_bts (the correct
// pattern) and bad_example (the wrong one) — accent color distinguishes
// them (amber = correct, coral = wrong).
// Tailwind needs statically-analyzable class names (no `border-${accent}`
// interpolation, it'll get purged from the build) — hence the explicit
// class sets per accent rather than a templated string.
const ACCENT_CLASSES = {
  amber: {
    current: 'border-amber bg-amber/20',
    active: 'border-amber/50 bg-amber/10 text-amber',
  },
  coral: {
    current: 'border-coral bg-coral/20',
    active: 'border-coral/50 bg-coral/10 text-coral',
  },
};

const PatternPlayer = ({ lesson, pattern, accent = 'amber' }) => {
  const { isPlaying, currentStep, play, stop } = useAudio();
  const setPattern = Object.fromEntries(
    Object.entries(pattern || {}).map(([k, v]) => [k, new Set(v)])
  );
  const accentClasses = ACCENT_CLASSES[accent] || ACCENT_CLASSES.amber;

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-studio-border bg-studio-panel p-6 w-full">
      <div className="grid gap-2 w-full" style={{ gridTemplateColumns: `repeat(${lesson.stepCount}, minmax(0,1fr))` }}>
        {Array.from({ length: lesson.stepCount }, (_, step) => {
          const active = Object.entries(setPattern).some(([, steps]) => steps.has(step));
          return (
            <div
              key={step}
              className={`aspect-square rounded-lg border flex items-center justify-center text-[10px] ${
                currentStep === step
                  ? accentClasses.current
                  : active
                  ? accentClasses.active
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
        onPlay={() => play(setPattern, { stepCount: lesson.stepCount, bpm: lesson.bpm })}
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

  const rawLesson = useLesson(lessonId);
  const { lesson } = rawLesson;
  const supported = Boolean(lesson?.hasContent);

  const {
    phase, phaseIndex, totalPhases,
    placedBlocks, hintsShown,
    placeBlock, removeBlock, nextPhase, submitTest,
    skipChallenge, completeChallenge,
  } = rawLesson;
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
            {phase === 'intro' && (
              <div className="w-full flex flex-col items-center gap-5">
                <Companion twin={lesson.intro?.speaker || 'melody'} size="sm" align="left" showBubble={false} />
                <DialogueBox dialogue={lesson.intro?.dialogue} onContinue={nextPhase} continueLabel="go on" />
              </div>
            )}

            {phase === 'explanation' && (
              <TwinBanter
                melodyLine={lesson.explanation?.melody?.dialogue || ''}
                harmonyLine={lesson.explanation?.harmony?.dialogue || ''}
                onContinue={nextPhase}
                continueLabel="show me"
              />
            )}

            {phase === 'examples_bts' && (
              <div className="w-full flex flex-col items-center gap-5">
                <Companion twin={lesson.examples_bts?.speaker || 'melody'} size="sm" align="left" showBubble={false} />
                <DialogueBox dialogue={lesson.examples_bts?.dialogue} />
                <BTSRenderer
                  kind={lesson.examples_bts?.bts || 'waveform'}
                  mode="lesson"
                  blockIds={lesson.blockTypes}
                  stepCount={lesson.stepCount}
                  bpm={lesson.bpm}
                  initialPattern={lesson.examples_bts?.pattern}
                  readOnly
                />
                <button
                  onClick={nextPhase}
                  className="rounded-full bg-amber text-studio-bg text-sm font-medium px-6 py-2 hover:bg-amber-soft transition-colors flex items-center gap-1"
                >
                  see it break <i className="ti ti-arrow-right" aria-hidden="true" />
                </button>
              </div>
            )}

            {phase === 'bad_example' && (
              <div className="w-full flex flex-col items-center gap-5">
                <Companion twin={lesson.bad_example?.speaker || 'harmony'} size="sm" align="left" showBubble={false} />
                <DialogueBox dialogue={lesson.bad_example?.dialogue} />
                <PatternPlayer lesson={lesson} pattern={lesson.bad_example?.pattern} accent="coral" />
                {lesson.bad_example?.error_explanation && (
                  <p className="text-xs text-coral text-center max-w-sm">{lesson.bad_example.error_explanation}</p>
                )}
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
                <Companion twin="melody" size="sm" align="left" showBubble={false} />
                <DialogueBox dialogue={lesson.test?.dialogue} />
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

            {phase === 'challenge' && (
              <div className="w-full flex flex-col items-center gap-5">
                <Companion twin={lesson.challenge?.speaker || 'harmony'} size="sm" align="left" showBubble={false} />
                <DialogueBox dialogue={lesson.challenge?.dialogue} />
                {lesson.challenge?.goal && (
                  <div className="rounded-2xl border border-studio-border bg-studio-panel px-6 py-4 text-sm text-ink-soft w-full text-center">
                    {lesson.challenge.goal}
                  </div>
                )}
                <div className="border-2 border-dashed border-studio-border rounded-xl w-full py-8 text-ink-muted text-xs text-center">
                  free-play challenge canvas — coming soon
                </div>
                <p className="text-[11px] text-ink-muted">optional — bonus xp only, doesn't block completion</p>
                <div className="flex gap-3">
                  <button
                    onClick={skipChallenge}
                    className="rounded-full border border-studio-border text-ink-soft text-sm px-5 py-2 hover:border-amber/50 transition-colors"
                  >
                    skip
                  </button>
                  <button
                    onClick={completeChallenge}
                    className="rounded-full bg-amber text-studio-bg text-sm font-medium px-5 py-2 hover:bg-amber-soft transition-colors"
                  >
                    done — claim bonus
                  </button>
                </div>
              </div>
            )}

            {phase === 'complete' && (
              <div className="w-full flex flex-col items-center gap-5">
                <Companion twin={lesson.complete?.speaker || 'melody'} size="sm" align="left" showBubble={false} />
                <DialogueBox dialogue={lesson.complete?.dialogue} />
                <p className="text-sm text-teal flex items-center gap-1">
                  <i className="ti ti-check" aria-hidden="true" /> +{lesson.complete?.xpReward ?? 0} xp,
                  +{lesson.complete?.coinReward ?? 0} coins
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
