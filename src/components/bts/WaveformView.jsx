import { useState } from 'react';
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';
import { BLOCK_TYPES, BLOCK_ORDER } from '../../data/blockTypes';
import { useAudio } from '../../hooks/useAudio';
import TransportBar from '../ui/TransportBar';
import { KONVA_THEME as T } from './konvaTheme';

const CELL = 34;
const GAP = 6;
const LABEL_W = 44;

// The BTS/mini-DAW view for drum blocks (README §4). Two modes:
//  - 'lesson': constrained to `blockIds` from that lesson, `readOnly` when
//    just illustrating a fixed pattern (examples_bts / bad_example).
//  - 'freeplay': full drum kit unlocked, always editable, state resets on
//    unmount/reload — a sandbox, not a second progression system.
const WaveformView = ({
  mode = 'freeplay',
  blockIds,
  stepCount = 8,
  bpm = 100,
  initialPattern = {},
  readOnly = false,
}) => {
  const lanes = blockIds || BLOCK_ORDER;
  const [pattern, setPattern] = useState(() => {
    const p = {};
    lanes.forEach((id) => {
      p[id] = new Set(initialPattern[id] || []);
    });
    return p;
  });
  const { isPlaying, currentStep, play, stop, preview } = useAudio();

  const toggle = (blockId, step) => {
    preview(blockId);
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
          free-play — click cells to build a beat, nothing here saves
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
                text={BLOCK_TYPES[blockId].shortLabel}
                fontSize={13}
                fontStyle="600"
                fill={BLOCK_TYPES[blockId].color}
              />
            ))}
            {lanes.map((blockId, row) =>
              Array.from({ length: stepCount }, (_, step) => {
                const block = BLOCK_TYPES[blockId];
                const active = pattern[blockId]?.has(step);
                const isPlayhead = currentStep === step;
                const x = LABEL_W + step * (CELL + GAP);
                const y = row * (CELL + GAP);
                return (
                  <>
                    <Rect
                      key={`${blockId}-${step}`}
                      x={x}
                      y={y}
                      width={CELL}
                      height={CELL}
                      cornerRadius={8}
                      fill={active ? block.color : T.surfaceAlt}
                      opacity={active ? (isPlayhead ? 1 : 0.85) : isPlayhead ? 0.7 : 1}
                      stroke={isPlayhead ? block.color : active ? T.border : T.borderStrong}
                      strokeWidth={isPlayhead ? 2 : 1}
                      dash={active ? undefined : [4, 4]}
                      onClick={() => toggle(blockId, step)}
                      onTap={() => toggle(blockId, step)}
                    />
                    {!active && (
                      <Circle
                        key={`${blockId}-${step}-dot`}
                        x={x + CELL / 2}
                        y={y + CELL / 2}
                        radius={2.5}
                        fill={T.textMuted}
                        listening={false}
                      />
                    )}
                  </>
                );
              })
            )}
          </Layer>
        </Stage>
      </div>
      <TransportBar
        isPlaying={isPlaying}
        onPlay={() => play(pattern, { stepCount, bpm })}
        onStop={stop}
        bpm={bpm}
      />
    </div>
  );
};

export default WaveformView;
