import { Scene } from 'phaser';

/**
 * Boot Scene: The very first scene to load.
 * Used for setting up engine-level configurations or loading a tiny
 * splash screen asset before the main Preloader begins.
 */
export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Optional: Load a small loading spinner or logo for the Preloader scene
  }

  create() {
    this.scene.start('Preloader');
  }
}
