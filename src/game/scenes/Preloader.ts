import { Scene } from 'phaser';

/**
 * Preloader Scene: Handles loading of all assets with a progress bar.
 * Emits events to React for a custom loading overlay if needed.
 */
export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    // Standard progress bar logic
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x1a1a1a, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff41, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
    });

    // Dummy assets for bootstrap testing
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('sky', 'src/games/firstgame/assets/sky.png');
  }

  create() {
    // Once assets are loaded, transition to MainMenu
    this.scene.start('MainMenu');
  }
}
