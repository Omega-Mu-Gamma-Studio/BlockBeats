import { useDroppable } from '@dnd-kit/core';
import DroppedBlock from './DroppedBlock';

const StepCell = ({ step, isDownbeat, isPlayhead, occupant, onRemove }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `step-${step}`, data: { step } });

  return (
    <div
      ref={setNodeRef}
      className={`relative aspect-square rounded-xl border transition-colors flex items-center justify-center ${
        isOver
          ? 'border-amber bg-amber/10'
          : occupant
          ? 'border-studio-border bg-studio-surface/60'
          : 'border-dashed border-studio-border-strong bg-studio-surface/40'
      } ${isDownbeat ? 'ring-1 ring-inset ring-studio-border-strong' : ''}`}
    >
      {isPlayhead && (
        <div className="absolute inset-0 rounded-xl bg-amber/20 ring-2 ring-amber pointer-events-none" />
      )}
      {!occupant && !isOver && <span className="w-1.5 h-1.5 rounded-full bg-ink-muted/50 pointer-events-none" />}
      <div className="absolute inset-1">
        {occupant && <DroppedBlock blockId={occupant} onRemove={() => onRemove(occupant, step)} />}
      </div>
    </div>
  );
};

// 8-step grid the player drops blocks onto. `placedBlocks` is
// { [blockId]: Set<stepIndex> }; multiple block types can share the grid
// (kept single-type for lesson 1-1, but built to scale to kick+snare later).
const Timeline = ({ stepCount, placedBlocks, currentStep, onRemove }) => {
  const occupantAt = (step) => {
    for (const [blockId, steps] of Object.entries(placedBlocks)) {
      if (steps.has(step)) return blockId;
    }
    return null;
  };

  return (
    // w-full is load-bearing here: the parent is a centered flex column
    // (items-center), which sizes children to content instead of
    // stretching them. Without an explicit width, minmax(0, 1fr) columns
    // have nothing to distribute space within, so the whole grid collapses
    // to the size of its smallest content instead of rendering as an
    // actual drop-target grid.
    <div className="grid gap-2 w-full" style={{ gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))` }}>
      {Array.from({ length: stepCount }, (_, step) => (
        <StepCell
          key={step}
          step={step}
          isDownbeat={step % 2 === 0}
          isPlayhead={currentStep === step}
          occupant={occupantAt(step)}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default Timeline;
