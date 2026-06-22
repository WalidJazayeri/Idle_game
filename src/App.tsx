import { PhaserGame } from './game/PhaserGame';
import { UpgradePanel } from './ui/UpgradePanel';

export default function App() {
  return (
    <main className="app">
      <section className="game-shell">
        <PhaserGame />
      </section>
      <UpgradePanel />
    </main>
  );
}
