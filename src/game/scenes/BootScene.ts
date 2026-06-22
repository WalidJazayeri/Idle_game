import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    const graphics = this.add.graphics();

    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(16, 16, 16);
    graphics.generateTexture('hero', 32, 32);

    graphics.clear();
    graphics.fillStyle(0xff4d6d, 1);
    graphics.fillCircle(14, 14, 14);
    graphics.generateTexture('enemy', 28, 28);

    graphics.clear();
    graphics.fillStyle(0xffd166, 1);
    graphics.fillCircle(5, 5, 5);
    graphics.generateTexture('projectile', 10, 10);

    graphics.destroy();
    this.scene.start('GameScene');
  }
}
