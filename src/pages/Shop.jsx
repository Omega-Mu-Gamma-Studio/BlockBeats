import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import useLessonStore from '../store/lessonStore';
import { WALLPAPERS, GEAR } from '../data/shopItems';

const ItemCard = ({ item, level, equipped, onEquip }) => {
  const unlocked = level >= item.requiredLevel;
  const isEquipped = equipped === item.id;

  return (
    <motion.div
      whileHover={unlocked ? { y: -3 } : {}}
      className={`rounded-2xl border overflow-hidden ${
        isEquipped ? 'border-amber' : 'border-studio-border'
      } bg-studio-panel ${!unlocked ? 'opacity-60' : ''}`}
    >
      <div
        className="h-28 relative"
        style={
          item.type === 'wallpaper'
            ? { backgroundImage: `url(${item.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: `radial-gradient(circle at 50% 35%, ${item.accent}33, transparent 70%)` }
        }
      >
        {item.type === 'gear' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <i
              className={`ti ${item.id === 'gear-redline' ? 'ti-headphones' : item.id === 'gear-goldfoil' ? 'ti-jacket' : 'ti-headphones'}`}
              style={{ color: item.accent, fontSize: 32 }}
              aria-hidden="true"
            />
          </div>
        )}
        {!unlocked && (
          <div className="absolute inset-0 bg-studio-bg/60 flex items-center justify-center">
            <i className="ti ti-lock text-ink-muted" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="font-display text-sm text-ink mb-0.5">{item.name}</p>
        <p className="text-xs text-ink-muted mb-3">{item.description}</p>

        {unlocked ? (
          <button
            onClick={() => onEquip(item)}
            disabled={isEquipped}
            className={`w-full text-xs rounded-full py-1.5 border transition-colors ${
              isEquipped
                ? 'border-amber text-amber cursor-default'
                : 'border-studio-border text-ink-soft hover:border-amber/50'
            }`}
          >
            {isEquipped ? 'equipped' : 'equip'}
          </button>
        ) : (
          <p className="text-[11px] text-ink-muted text-center">unlocks at level {item.requiredLevel}</p>
        )}
      </div>
    </motion.div>
  );
};

const Shop = () => {
  const { level, equippedWallpaper, equippedOutfit, setWallpaper, setOutfit } = useProgress();
  const { say } = useLessonStore();

  useEffect(() => {
    say('melody', "Spend it however you like. Good taste isn't extra credit, it's the job.", 'excited');
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-ink mb-1">the shop</h1>
      <p className="text-sm text-ink-muted mb-8">cosmetics only — nothing here changes how a lesson plays</p>

      <h2 className="font-display text-lg text-ink mb-3">wallpapers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {WALLPAPERS.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            level={level}
            equipped={equippedWallpaper}
            onEquip={(i) => setWallpaper(i.id)}
          />
        ))}
      </div>

      <h2 className="font-display text-lg text-ink mb-3">gear</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GEAR.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            level={level}
            equipped={equippedOutfit}
            onEquip={(i) => setOutfit(i.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Shop;
