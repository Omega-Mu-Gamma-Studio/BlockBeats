import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import BlockPalette from '../blocks/BlockPalette';
import Timeline from '../blocks/Timeline';
import TransportBar from '../ui/TransportBar';
import HintSystem from './HintSystem';
import { BLOCK_TYPES } from '../../data/blockTypes';
import { useAudio } from '../../hooks/useAudio';

// The interactive "test" phase: drag blocks from the palette onto the
// timeline, preview/play the pattern, and submit for validation.
const LessonCanvas = ({ lesson, placedBlocks, onPlace, onRemove, onSubmit, hintsShown, feedback }) => {
  const { isPlaying, currentStep, play, stop, preview } = useAudio();
  const [activeBlockId, setActiveBlockId] = useState(null);

  const stepCount = lesson.stepCount;
  const bpm = lesson.bpm;

  const handleDragStart = (event) => {
    setActiveBlockId(event.active.data.current?.blockId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveBlockId(null);
    if (!over) return;
    const blockId = active.data.current?.blockId;
    const step = over.data.current?.step;
    if (blockId != null && step != null) onPlace(blockId, step);
  };

  const handlePlay = () => play(placedBlocks, { stepCount, bpm });

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Timeline
          stepCount={stepCount}
          placedBlocks={placedBlocks}
          currentStep={currentStep}
          onRemove={onRemove}
        />
        <BlockPalette blockTypes={lesson.blockTypes} onPreview={preview} />
        <DragOverlay>
          {activeBlockId && (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-studio-bg shadow-lg"
              style={{ backgroundColor: BLOCK_TYPES[activeBlockId].color }}
            >
              {BLOCK_TYPES[activeBlockId].shortLabel}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TransportBar isPlaying={isPlaying} onPlay={handlePlay} onStop={stop} bpm={bpm} />

      <HintSystem hints={lesson.test.hints} hintsShown={hintsShown} />

      {feedback === 'wrong' && (
        <p className="text-xs text-coral">Not quite — check the spacing and try again.</p>
      )}

      <button
        onClick={onSubmit}
        className="rounded-full bg-teal text-studio-bg text-sm font-medium px-6 py-2 hover:opacity-90 transition-opacity"
      >
        check my pattern
      </button>
    </div>
  );
};

export default LessonCanvas;
