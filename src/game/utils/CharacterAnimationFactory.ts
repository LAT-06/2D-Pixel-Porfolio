import Phaser from 'phaser';

/**
 * Character Animation Factory (v2 - Specialized for player.png)
 * Handles the calculation and creation of animations for the single-character spritesheet.
 * Spritesheet Structure (player.png):
 * - 3 frames per direction
 * - 4 directions:
 *   Row 0: Up
 *   Row 1: Left
 *   Row 2: Down
 *   Row 3: Right
 */
export class CharacterAnimationFactory {
  // Ordered exactly as they appear in the player.png rows
  private static ROW_MAPPING = ['up', 'right', 'down', 'left'];
  private static FRAMES_PER_ROW = 3;

  /**
   * Generates all directional animations for the player spritesheet.
   */
  public static createAnimations(
    scene: Phaser.Scene,
    textureKey: string,
    prefix: string
  ) {
    const anims = scene.anims;

    this.ROW_MAPPING.forEach((dir, rowIndex) => {
      const startFrame = rowIndex * this.FRAMES_PER_ROW;
      
      const walkKey = `${prefix}-walk-${dir}`;
      const idleKey = `${prefix}-idle-${dir}`;

      if (anims.exists(walkKey)) return;

      // Walk Animation (using all 3 frames)
      anims.create({
        key: walkKey,
        frames: anims.generateFrameNumbers(textureKey, {
          start: startFrame,
          end: startFrame + 2,
        }),
        frameRate: 8,
        repeat: -1,
        yoyo: true
      });

      // Idle Animation (middle frame often looks best for idle in 3-frame sets)
      anims.create({
        key: idleKey,
        frames: [{ key: textureKey, frame: startFrame + 1 }],
        frameRate: 1,
        repeat: -1
      });
    });
  }
}
