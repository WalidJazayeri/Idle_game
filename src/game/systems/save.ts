export type PlayerSave = {
  gold: number;
  wave: number;
  damage: number;
  attackSpeedMs: number;
  range: number;
  lastSeenAt: number;
};

const SAVE_KEY = 'vampire-idle-save-v1';

export const defaultSave: PlayerSave = {
  gold: 0,
  wave: 1,
  damage: 10,
  attackSpeedMs: 900,
  range: 220,
  lastSeenAt: Date.now(),
};

export function loadSave(): PlayerSave {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return { ...defaultSave };

  try {
    return { ...defaultSave, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSave };
  }
}

export function saveGame(save: PlayerSave) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...save, lastSeenAt: Date.now() }));
}

export function applyOfflineProgress(save: PlayerSave): PlayerSave {
  const now = Date.now();
  const offlineSeconds = Math.max(0, Math.floor((now - save.lastSeenAt) / 1000));
  const cappedSeconds = Math.min(offlineSeconds, 60 * 60 * 8);
  const estimatedKills = Math.floor(cappedSeconds / 8);
  const offlineGold = estimatedKills * Math.max(1, save.wave);

  return {
    ...save,
    gold: save.gold + offlineGold,
    lastSeenAt: now,
  };
}
