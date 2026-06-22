import Phaser from 'phaser';
import { applyOfflineProgress, loadSave, PlayerSave, saveGame } from '../systems/save';

type Enemy = Phaser.Types.Physics.Arcade.ImageWithDynamicBody & {
  hp: number;
  reward: number;
};

export class GameScene extends Phaser.Scene {
  private hero!: Phaser.Physics.Arcade.Image;
  private enemies!: Phaser.Physics.Arcade.Group;
  private projectiles!: Phaser.Physics.Arcade.Group;
  private statsText!: Phaser.GameObjects.Text;
  private save!: PlayerSave;
  private lastAttackAt = 0;
  private enemiesKilledThisWave = 0;
  private enemiesToNextWave = 10;

  constructor() {
    super('GameScene');
  }

  create() {
    this.save = applyOfflineProgress(loadSave());

    this.hero = this.physics.add.image(480, 300, 'hero');
    this.hero.setCircle(16);
    this.hero.setImmovable(true);

    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();

    this.statsText = this.add.text(16, 16, '', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 8 },
    });

    this.physics.add.overlap(this.projectiles, this.enemies, (projectile, enemy) => {
      this.hitEnemy(projectile as Phaser.Physics.Arcade.Image, enemy as Enemy);
    });

    this.time.addEvent({
      delay: 900,
      loop: true,
      callback: () => this.spawnEnemy(),
    });

    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => saveGame(this.save),
    });

    window.addEventListener('idle-upgrade', this.handleUpgrade as EventListener);
  }

  update(time: number) {
    this.moveEnemiesTowardHero();
    this.autoAttack(time);
    this.updateUi();
  }

  shutdown() {
    window.removeEventListener('idle-upgrade', this.handleUpgrade as EventListener);
  }

  private handleUpgrade = (event: CustomEvent<{ type: string }>) => {
    const type = event.detail.type;

    if (type === 'damage' && this.save.gold >= 25) {
      this.save.gold -= 25;
      this.save.damage += 5;
    }

    if (type === 'speed' && this.save.gold >= 40) {
      this.save.gold -= 40;
      this.save.attackSpeedMs = Math.max(180, this.save.attackSpeedMs - 60);
    }

    if (type === 'range' && this.save.gold >= 35) {
      this.save.gold -= 35;
      this.save.range += 25;
    }

    saveGame(this.save);
  };

  private spawnEnemy() {
    const side = Phaser.Math.Between(0, 3);
    const margin = 40;
    let x = 0;
    let y = 0;

    if (side === 0) {
      x = Phaser.Math.Between(0, 960);
      y = -margin;
    } else if (side === 1) {
      x = 960 + margin;
      y = Phaser.Math.Between(0, 600);
    } else if (side === 2) {
      x = Phaser.Math.Between(0, 960);
      y = 600 + margin;
    } else {
      x = -margin;
      y = Phaser.Math.Between(0, 600);
    }

    const enemy = this.enemies.create(x, y, 'enemy') as Enemy;
    enemy.hp = 20 + this.save.wave * 4;
    enemy.reward = 3 + this.save.wave;
    enemy.setCircle(14);
  }

  private moveEnemiesTowardHero() {
    this.enemies.children.each((child) => {
      const enemy = child as Enemy;
      this.physics.moveToObject(enemy, this.hero, 35 + this.save.wave * 2);
      return true;
    });
  }

  private autoAttack(time: number) {
    if (time - this.lastAttackAt < this.save.attackSpeedMs) return;

    const target = this.findNearestEnemyInRange();
    if (!target) return;

    this.lastAttackAt = time;

    const projectile = this.projectiles.create(this.hero.x, this.hero.y, 'projectile') as Phaser.Physics.Arcade.Image;
    projectile.setCircle(5);
    this.physics.moveToObject(projectile, target, 520);

    this.time.delayedCall(900, () => projectile.destroy());
  }

  private findNearestEnemyInRange(): Enemy | null {
    let nearest: Enemy | null = null;
    let nearestDistance = Infinity;

    this.enemies.children.each((child) => {
      const enemy = child as Enemy;
      const distance = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, enemy.x, enemy.y);

      if (distance <= this.save.range && distance < nearestDistance) {
        nearest = enemy;
        nearestDistance = distance;
      }

      return true;
    });

    return nearest;
  }

  private hitEnemy(projectile: Phaser.Physics.Arcade.Image, enemy: Enemy) {
    projectile.destroy();
    enemy.hp -= this.save.damage;

    if (enemy.hp <= 0) {
      enemy.destroy();
      this.save.gold += enemy.reward;
      this.enemiesKilledThisWave += 1;

      if (this.enemiesKilledThisWave >= this.enemiesToNextWave) {
        this.save.wave += 1;
        this.enemiesKilledThisWave = 0;
        this.enemiesToNextWave += 5;
      }
    }
  }

  private updateUi() {
    this.statsText.setText([
      `Or: ${Math.floor(this.save.gold)}`,
      `Vague: ${this.save.wave}`,
      `Dégâts: ${this.save.damage}`,
      `Vitesse: ${this.save.attackSpeedMs} ms`,
      `Portée: ${this.save.range}`,
      `Kills vague: ${this.enemiesKilledThisWave}/${this.enemiesToNextWave}`,
    ]);
  }
}
