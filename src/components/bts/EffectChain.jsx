import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EFFECT_TYPES, EFFECT_ORDER } from '../../data/effectBlocks';
import { previewChain, disposeChain } from '../../engines/effectChainEngine';
import TransportBar from '../ui/TransportBar';

function defaultParams(effectId) {
  const out = {};
  EFFECT_TYPES[effectId].params.forEach((p) => {
    out[p.key] = p.default;
  });
  return out;
}

const ChainSlot = ({ item, onRemove, onParamChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.uid });
  const spec = EFFECT_TYPES[item.effectId];

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        borderColor: spec.color,
      }}
      className="rounded-xl border-2 bg-studio-surface p-3 flex flex-col gap-2 min-w-[170px] flex-shrink-0"
    >
      <div className="flex items-center justify-between">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-ink-soft text-xs font-medium flex items-center gap-1 touch-none"
        >
          <i className="ti ti-grip-vertical text-ink-muted" aria-hidden="true" /> {spec.label}
        </button>
        <button onClick={() => onRemove(item.uid)} className="text-ink-muted hover:text-coral text-xs">
          <i className="ti ti-x" aria-hidden="true" />
        </button>
      </div>
      {spec.params.map((p) => (
        <label key={p.key} className="text-[10px] text-ink-muted flex flex-col gap-1">
          <span>
            {p.label} <span className="text-ink-soft">{item.params[p.key]}{p.unit}</span>
          </span>
          <input
            type="range"
            min={p.min}
            max={p.max}
            step={p.step}
            value={item.params[p.key]}
            onChange={(e) => onParamChange(item.uid, p.key, Number(e.target.value))}
            className="accent-amber w-full"
          />
        </label>
      ))}
    </div>
  );
};

// The BTS/mini-DAW view for Unit 6 — drag effect blocks onto a chain, tweak
// params via sliders, hear it processed live (README §4). Rebuilds the
// Tone.js chain on any change while playing since not every effect
// supports updating every param in place.
const EffectChain = ({ mode = 'freeplay', blockIds, initialChain = [] }) => {
  const paletteIds = blockIds || EFFECT_ORDER;
  const [chain, setChain] = useState(() =>
    initialChain.length
      ? initialChain.map((c, i) => ({
          uid: `${c.id}-${i}`,
          effectId: c.id,
          params: { ...defaultParams(c.id), ...c.params },
        }))
      : []
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (isPlaying) previewChain(chain.map(({ effectId, params }) => ({ id: effectId, params })));
  }, [chain]);

  useEffect(() => () => disposeChain(), []);

  const handlePlay = async () => {
    setIsPlaying(true);
    await previewChain(chain.map(({ effectId, params }) => ({ id: effectId, params })));
  };
  const handleStop = () => {
    setIsPlaying(false);
    disposeChain();
  };

  const addEffect = (effectId) => {
    setChain((prev) => [...prev, { uid: `${effectId}-${Date.now()}`, effectId, params: defaultParams(effectId) }]);
  };
  const removeEffect = (uid) => setChain((prev) => prev.filter((c) => c.uid !== uid));
  const updateParam = (uid, key, value) =>
    setChain((prev) => prev.map((c) => (c.uid === uid ? { ...c, params: { ...c.params, [key]: value } } : c)));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setChain((prev) => {
      const oldIndex = prev.findIndex((c) => c.uid === active.id);
      const newIndex = prev.findIndex((c) => c.uid === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {mode === 'freeplay' && (
        <p className="text-[11px] text-ink-muted text-center">
          free-play — build a chain, drag to reorder, nothing here saves
        </p>
      )}

      <div className="rounded-2xl border border-studio-border bg-studio-panel p-5 w-full flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <i className="ti ti-plug" aria-hidden="true" /> source
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={chain.map((c) => c.uid)} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-3 overflow-x-auto pb-2 min-h-[90px]">
              {chain.length === 0 && (
                <p className="text-xs text-ink-muted py-8 mx-auto">chain's empty — add an effect below</p>
              )}
              {chain.map((item) => (
                <ChainSlot key={item.uid} item={item} onRemove={removeEffect} onParamChange={updateParam} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <i className="ti ti-speaker" aria-hidden="true" /> destination
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {paletteIds.map((id) => {
          const spec = EFFECT_TYPES[id];
          return (
            <button
              key={id}
              onClick={() => addEffect(id)}
              className="rounded-full border-2 px-3 py-1.5 text-xs text-ink-soft hover:opacity-80 transition-opacity flex items-center gap-1"
              style={{ borderColor: spec.color }}
            >
              <i className="ti ti-plus" aria-hidden="true" /> {spec.label}
            </button>
          );
        })}
      </div>

      <TransportBar isPlaying={isPlaying} onPlay={handlePlay} onStop={handleStop} bpm={100} />
    </div>
  );
};

export default EffectChain;
