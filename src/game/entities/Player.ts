import Phaser from 'phaser';

export interface PlayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  frame?: string | number;
  speed?: number;
}

/**
 * Production-grade Player Entity
 * Handles physics, movement logic, and animations.
 * Decoupled from input handling to allow for AI or remote control.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed: number;
  private isLocked: boolean = false;

  constructor({ scene, x, y, texture, frame, speed = 160 }: PlayerConfig) {
    super(scene, x, y, texture, frame);

    this.moveSpeed = speed;

    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics Body Configuration
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      // Slightly smaller hitbox for better movement feel in top-down
      this.body.setSize(16, 16);
      this.body.setOffset(8, 16); // Centered bottom-aligned hitbox
      this.body.setCollideWorldBounds(true);
    }

    this.setOrigin(0.5, 0.5);
    this.createAnimations();
  }

  /**
   * Main update loop for the player
   * @param direction - Normalized vector from input manager
   */
  public updateMovement(direction: Phaser.Math.Vector2) {
    if (this.isLocked) {
      this.setVelocity(0, 0);
      this.playIdleAnimation();
      return;
    }

    // Set velocity based on direction and speed
    // Note: We don't use delta time here because Arcade Physics handles 
    // internal velocity/delta scaling automatically.
    this.setVelocity(direction.x * this.moveSpeed, direction.y * this.moveSpeed);

    // Animation Handling
    if (direction.lengthSq() > 0) {
      this.handleMovementAnimation(direction);
    } else {
      this.playIdleAnimation();
    }
  }

  /**
   * Locks player movement (useful for dialogue or cinematics)
   */
  public setLock(locked: boolean) {
    this.isLocked = locked;
  }

  private handleMovementAnimation(direction: Phaser.Math.Vector2) {
    // Priority: Horizontal animations often look better in pixel art
    if (Math.abs(direction.x) > Math.abs(direction.y)) {
      if (direction.x > 0) {
        this.play('walk-right', true);
      } else {
        this.play('walk-left', true);
      }
    } else {
      if (direction.y > 0) {
        this.play('walk-down', true);
      } else {
        this.play('walk-up', true);
      }
    }
  }

  private playIdleAnimation() {
    const currentAnim = this.anims.currentAnim?.key;
    if (currentAnim?.includes('walk')) {
      const direction = currentAnim.split('-')[1];
      this.play(`idle-${direction}`, true);
    } else if (!currentAnim) {
      this.play('idle-down', true);
    }
  }

  private createAnimations() {
    const anims = this.scene.anims;
    
    // Check if animations already exist to prevent errors on scene restart
    if (anims.exists('walk-down')) return;

    // These would typically be mapped to a spritesheet
    // Using simple placeholders for now
    const directions = ['down', 'up', 'left', 'right'];
    
    directions.forEach(dir => {
      // Walk anims
      anims.create({
        key: `walk-${dir}`,
        frames: anims.generateFrameNumbers(this.texture.key, { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });

      // Idle anims
      anims.create({
        key: `idle-${dir}`,
        frames: [{ key: this.texture.key, frame: 0 }],
        frameRate: 1,
        repeat: -1
      });
    });
  }
}
