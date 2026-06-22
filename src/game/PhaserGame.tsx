import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

export function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: 960,
      height: 600,
      backgroundColor: '#202033',
      physics: {
        default: 'arcade',
        arcade: { debug: false },
      },
      scene: [BootScene, GameScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="phaser-container" />;
}
