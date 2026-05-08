import Phaser from 'phaser';
import { CharacterAnimationFactory } from '@/game/utils/CharacterAnimationFactory';

export interface PlayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  speed?: number;
}

/**
 * Player Entity (Optimized for single-character sheet)
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed: number;
  private isLocked: boolean = false;
  private animPrefix: string = 'player';

  constructor({ scene, x, y, texture, speed = 160 }: PlayerConfig) {
    super(scene, x, y, texture);

    this.moveSpeed = speed;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      // The player.png frames are 16x32. We want a small circular/square base hitbox.
      this.body.setSize(12, 10);
      this.body.setOffset(2, 22); // Offset to the feet area
      this.body.setCollideWorldBounds(true);
    }

    this.setOrigin(0.5, 0.5);
    
    // Create animations (Factory v2 handles the player.png layout)
    CharacterAnimationFactory.createAnimations(scene, texture, this.animPrefix);
    
    this.play(`${this.animPrefix}-idle-down`);
  }

  public updateMovement(direction: Phaser.Math.Vector2) {
    if (this.isLocked) {
      this.stopMovement();
      return;
    }

    this.setVelocity(direction.x * this.moveSpeed, direction.y * this.moveSpeed);

    if (direction.lengthSq() > 0) {
      this.handleMovementAnimation(direction);
    } else {
      this.playIdleAnimation();
    }
  }

  private stopMovement() {
    this.setVelocity(0, 0);
    this.playIdleAnimation();
  }

  private handleMovementAnimation(direction: Phaser.Math.Vector2) {
    if (Math.abs(direction.x) > Math.abs(direction.y)) {
      if (direction.x > 0) {
        this.play(`${this.animPrefix}-walk-right`, true);
      } else {
        this.play(`${this.animPrefix}-walk-left`, true);
      }
    } else {
      if (direction.y > 0) {
        this.play(`${this.animPrefix}-walk-down`, true);
      } else {
        this.play(`${this.animPrefix}-walk-up`, true);
      }
    }
  }

  private playIdleAnimation() {
    const currentAnim = this.anims.currentAnim?.key;
    if (currentAnim && currentAnim.includes('walk')) {
      const direction = currentAnim.split('-').pop();
      this.play(`${this.animPrefix}-idle-${direction}`, true);
    }
  }

  public setLock(locked: boolean) {
    this.isLocked = locked;
    if (locked) this.stopMovement();
  }
}
