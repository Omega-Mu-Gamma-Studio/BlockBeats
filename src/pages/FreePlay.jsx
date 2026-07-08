import { useState } from 'react';
import BTSRenderer from '../components/bts/BTSRenderer';

const TABS = [
  { id: 'waveform', label: 'Beat', icon: 'ti-wave-square' },
  { id: 'pianoRoll', label: 'Chords', icon: 'ti-stack-2' },
  { id: 'melodyRoll', label: 'Melody', icon: 'ti-music' },
  { id: 'effectChain', label: 'Effects', icon: 'ti-adjustments' },
];

// Standalone free-play mini DAW (README §4) — the same Konva-based BTS
// rendering lessons use, opened outside any lesson with the full palette
// unlocked. No validation, no XP, no save/export: a sandbox for messing
// around. Session state resets on reload by design (each tab's component
// holds its own local state, nothing persisted).
const FreePlay = () => {
  const [tab, setTab] = useState('waveform');

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-ink mb-1">the studio, off the clock</h1>
      <p className="text-sm text-ink-muted mb-8">
        full kit, every chord, every effect — no lessons, no scoring, nothing saved
      </p>

      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
              tab === t.id
                ? 'border-amber bg-amber/15 text-amber'
                : 'border-studio-border text-ink-soft hover:border-amber/50'
            }`}
          >
            <i className={`ti ${t.icon}`} aria-hidden="true" /> {t.label}
          </button>
        ))}
      </div>

      <BTSRenderer key={tab} kind={tab} mode="freeplay" stepCount={8} bpm={100} />
    </div>
  );
};

export default FreePlay;
