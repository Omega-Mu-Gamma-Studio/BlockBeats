import { useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { CHORD_BLOCKS, CHORD_ORDER, MELODY_BLOCKS, MELODY_ORDER } from '../../data/pitchedBlocks';
import { useSynth } from '../../hooks/useSynth';
import TransportBar from '../ui/TransportBar';
import { KONVA_THEME as T } from './konvaTheme';

const CELL = 34;
const GAP = 6;
const LABEL_W = 44;

// The BTS/mini-DAW view for chord + melody blocks (README §4). `kind`
// picks which palette this instance draws from — chords for Unit 3,
// single notes for Unit 4 — everything else (lesson/freeplay duality,
// playback, toggling) is identical between the two.
const PianoRoll = ({
  kind = 'chords', // 'chords' | 'melody'
  mode = 'freeplay',
  blockIds,
  stepCount = 8,
  bpm = 100,
  initialPattern = {},
  readOnly = false,
}) => {
  const BLOCKS = kind === 'melody' ? MELODY_BLOCKS : CHORD_BLOCKS;
  const ORDER = kind === 'melody' ? MELODY_ORDER : CHORD_ORDER;
  const lanes = blockIds || ORDER;

  const [pattern, setPattern] = useState(() => {
    const p = {};
    lanes.forEach((id) => {
      p[id] = new Set(initialPattern[id] || []);
    });
    return p;
  });
  const { isPlaying, currentStep, play, stop, preview } = useSynth();

  const toggle = (blockId, step) => {
    preview(BLOCKS[blockId].notes);
    if (readOnly) return;
    setPattern((prev) => {
      const next = { ...prev };
      const s = new Set(next[blockId]);
      if (s.has(step)) s.delete(step);
      else s.add(step);
      next[blockId] = s;
      return next;
    });
  };

  const width = LABEL_W + stepCount * (CELL + GAP);
  const height = lanes.length * (CELL + GAP) - GAP;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {mode === 'freeplay' && (
        <p className="text-[11px] text-ink-muted text-center">
          free-play — click cells to sketch {kind === 'melody' ? 'a melody' : 'a progression'}, nothing here saves
        </p>
      )}
      <div className="rounded-2xl border border-studio-border bg-studio-panel p-4 overflow-x-auto max-w-full">
        <Stage width={width} height={height}>
          <Layer>
            {lanes.map((blockId, row) => (
              <Text
                key={`label-${blockId}`}
                x={0}
                y={row * (CELL + GAP) + CELL / 2 - 7}
                text={BLOCKS[blockId].shortLabel}
                fontSize={12}
                fontStyle="600"
                fill={BLOCKS[blockId].color}
              />
            ))}
            {lanes.map((blockId, row) =>
              Array.from({ length: stepCount }, (_, step) => {
                const block = BLOCKS[blockId];
                const active = pattern[blockId]?.has(step);
                const isPlayhead = currentStep === step;
                return (
                  <Rect
                    key={`${blockId}-${step}`}
                    x={LABEL_W + step * (CELL + GAP)}
                    y={row * (CELL + GAP)}
                    width={CELL}
                    height={CELL}
                    cornerRadius={8}
                    fill={active ? block.color : T.surfaceAlt}
                    opacity={active ? (isPlayhead ? 1 : 0.85) : isPlayhead ? 0.7 : 1}
                    stroke={isPlayhead ? block.color : T.border}
                    strokeWidth={isPlayhead ? 2 : 1}
                    onClick={() => toggle(blockId, step)}
                    onTap={() => toggle(blockId, step)}
                  />
                );
              })
            )}
          </Layer>
        </Stage>
      </div>
      <TransportBar
        isPlaying={isPlaying}
        onPlay={() => play(pattern, BLOCKS, { stepCount, bpm })}
        onStop={stop}
        bpm={bpm}
      />
    </div>
  );
};

export default PianoRoll;
