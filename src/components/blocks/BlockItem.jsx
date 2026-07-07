import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { BLOCK_TYPES } from '../../data/blockTypes';

// A single draggable block in the palette. Click also previews the sample
// so a mouse-only user can still hear each block before placing it.
const BlockItem = ({ blockId, onPreview }) => {
  const block = BLOCK_TYPES[blockId];
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${blockId}`,
    data: { blockId, source: 'palette' },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onPreview?.(blockId)}
      style={{
        transform: CSS.Translate.toString(transform),
        borderColor: block.color,
        opacity: isDragging ? 0.4 : 1,
      }}
      className="flex items-center gap-2 rounded-xl border-2 bg-studio-surface px-3 py-2 cursor-grab active:cursor-grabbing select-none touch-none"
    >
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold text-studio-bg flex-shrink-0"
        style={{ backgroundColor: block.color }}
      >
        {block.shortLabel}
      </span>
      <span className="text-sm text-ink-soft">{block.label}</span>
    </button>
  );
};

export default BlockItem;
