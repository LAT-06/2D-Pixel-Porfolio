import Phaser from 'phaser';

/**
 * Global Input Manager
 * Centralizes keyboard, gamepad, and touch input into a single
 * normalized direction vector for the player or menus.
 */
export class InputManager {
  private keys: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    UP: Phaser.Input.Keyboard.Key;
    DOWN: Phaser.Input.Keyboard.Key;
    LEFT: Phaser.Input.Keyboard.Key;
    RIGHT: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene) {
    if (!scene.input.keyboard) {
      throw new Error('Keyboard input is not available in this scene');
    }

    this.keys = scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      UP: Phaser.Input.Keyboard.KeyCodes.UP,
      DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
      LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      E: Phaser.Input.Keyboard.KeyCodes.E,
    }) as any;
  }

  /**
   * Returns a normalized vector based on active movement keys.
   * Normalization prevents the 'diagonal speed boost' bug.
   */
  public getMovementDirection(): Phaser.Math.Vector2 {
    const direction = new Phaser.Math.Vector2(0, 0);

    if (this.keys.W.isDown || this.keys.UP.isDown) direction.y = -1;
    else if (this.keys.S.isDown || this.keys.DOWN.isDown) direction.y = 1;

    if (this.keys.A.isDown || this.keys.LEFT.isDown) direction.x = -1;
    else if (this.keys.D.isDown || this.keys.RIGHT.isDown) direction.x = 1;

    if (direction.lengthSq() > 0) {
      direction.normalize();
    }

    return direction;
  }

  /**
   * Returns true if the interaction key was just pressed this frame.
   */
  public isInteracting(): boolean {
    return (
      Phaser.Input.Keyboard.JustDown(this.keys.E) ||
      Phaser.Input.Keyboard.JustDown(this.keys.SPACE)
    );
  }
}
