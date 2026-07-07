import { BLOCK_TYPES } from '../../data/blockTypes';

// A block that's been placed into a timeline step. Click removes it.
const DroppedBlock = ({ blockId, onRemove }) => {
  const block = BLOCK_TYPES[blockId];
  return (
    <button
      onClick={onRemove}
      title={`Remove ${block.label}`}
      className="w-full h-full rounded-lg flex items-center justify-center text-xs font-semibold text-studio-bg transition-transform hover:scale-95"
      style={{ backgroundColor: block.color }}
    >
      {block.shortLabel}
    </button>
  );
};

export default DroppedBlock;
