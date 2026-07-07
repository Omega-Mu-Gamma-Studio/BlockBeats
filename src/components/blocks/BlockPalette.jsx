import BlockItem from './BlockItem';

// Row of draggable blocks the lesson allows for its test phase.
const BlockPalette = ({ blockTypes, onPreview }) => (
  <div className="flex flex-wrap gap-3 justify-center">
    {blockTypes.map((blockId) => (
      <BlockItem key={blockId} blockId={blockId} onPreview={onPreview} />
    ))}
  </div>
);

export default BlockPalette;
