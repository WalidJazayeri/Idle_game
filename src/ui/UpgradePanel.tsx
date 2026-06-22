function buyUpgrade(type: 'damage' | 'speed' | 'range') {
  window.dispatchEvent(new CustomEvent('idle-upgrade', { detail: { type } }));
}

export function UpgradePanel() {
  return (
    <aside className="panel">
      <h1>Vampire Idle</h1>
      <p>
        Le héros attaque tout seul. Les ennemis donnent de l'or. Achète des améliorations pour survivre aux vagues suivantes.
      </p>

      <button className="upgrade" onClick={() => buyUpgrade('damage')}>
        + Dégâts — 25 or
      </button>

      <button className="upgrade" onClick={() => buyUpgrade('speed')}>
        + Vitesse d'attaque — 40 or
      </button>

      <button className="upgrade" onClick={() => buyUpgrade('range')}>
        + Portée — 35 or
      </button>

      <p>
        Sauvegarde automatique toutes les 2 secondes. Une progression hors ligne simple est déjà prévue.
      </p>
    </aside>
  );
}
