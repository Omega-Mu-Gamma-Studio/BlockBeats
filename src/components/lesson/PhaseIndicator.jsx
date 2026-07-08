const LABELS = ['intro', 'learn', 'watch', 'spot it', 'try it', 'bonus', 'done'];

// Row of dots showing progress through the lesson's phases (README §3:
// intro, explanation, examples_bts, bad_example, test, challenge, complete).
const PhaseIndicator = ({ phaseIndex, total }) => (
  <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
    {Array.from({ length: total }, (_, i) => (
      <div key={i} className="flex flex-col items-center gap-1">
        <div
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            i < phaseIndex ? 'bg-teal' : i === phaseIndex ? 'bg-amber' : 'bg-studio-surface border border-studio-border'
          }`}
        />
        <span className={`text-[10px] ${i === phaseIndex ? 'text-ink-soft' : 'text-ink-muted'}`}>
          {LABELS[i]}
        </span>
      </div>
    ))}
  </div>
);

export default PhaseIndicator;
