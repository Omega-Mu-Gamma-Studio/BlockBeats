import { Outlet, Link, useLocation } from 'react-router-dom';
import { useProgress } from '../../hooks/useProgress';

const TopBar = () => {
  const { xp, coins, level } = useProgress();
  return (
    <header className="flex items-center justify-between px-6 h-14 border-b border-studio-border bg-studio-panel/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-5">
        <Link to="/" className="font-display text-lg tracking-tight text-ink">
          blockbeats
        </Link>
        <Link to="/freeplay" className="text-xs text-ink-muted hover:text-ink-soft flex items-center gap-1">
          <i className="ti ti-wave-square" aria-hidden="true" /> studio
        </Link>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1.5 rounded-full bg-studio-surface px-3 py-1 border border-studio-border">
          <i className="ti ti-bolt text-amber" aria-hidden="true" />
          <span className="text-ink-soft">lvl {level}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-studio-surface px-3 py-1 border border-studio-border">
          <i className="ti ti-disc text-amber" aria-hidden="true" />
          <span className="text-ink-soft">{xp} xp</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-studio-surface px-3 py-1 border border-studio-border">
          <i className="ti ti-coin text-amber" aria-hidden="true" />
          <span className="text-ink-soft">{coins}</span>
        </div>
      </div>
    </header>
  );
};

const TransportStrip = () => (
  <footer className="h-10 border-t border-studio-border bg-studio-panel/80 flex items-center justify-center gap-4 text-ink-muted text-xs">
    <i className="ti ti-player-skip-back" aria-hidden="true" />
    <i className="ti ti-player-play text-amber" aria-hidden="true" />
    <i className="ti ti-player-skip-forward" aria-hidden="true" />
    <span className="ml-2 tracking-wide">omega mu gamma studio</span>
  </footer>
);

const AppLayout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-studio-bg text-ink font-sans">
      <TopBar />
      <main className="flex-1" key={location.pathname}>
        <Outlet />
      </main>
      <TransportStrip />
    </div>
  );
};

export default AppLayout;
