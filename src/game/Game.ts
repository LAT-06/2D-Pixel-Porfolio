import Phaser from 'phaser';

/**
 * Singleton Game Instance Manager
 * Ensures only one instance of the game exists and provides access
 * to the engine from outside the React tree if necessary.
 */
export class Game extends Phaser.Game {
  private static instance: Game;

  private constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }

  public static init(config: Phaser.Types.Core.GameConfig): Game {
    if (!Game.instance) {
      Game.instance = new Game(config);
    }
    return Game.instance;
  }

  public static getInstance(): Game {
    return Game.instance;
  }

  public static destroyInstance(removeCanvas: boolean = true) {
    if (Game.instance) {
      Game.instance.destroy(removeCanvas);
      // @ts-ignore
      Game.instance = null;
    }
  }
}
