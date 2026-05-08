import Phaser from 'phaser';
import { Boot } from '@/game/scenes/Boot';
import { Preloader } from '@/game/scenes/Preloader';
import { MainMenu } from '@/game/scenes/MainMenu';
import { Subway } from '@/game/scenes/Subway';

/**
 * Global Phaser Configuration
 */
export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#0a0a0a',
  pixelArt: true, // Crucial for 2D pixel art clarity
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: import.meta.env.VITE_ENABLE_DEBUG_PHYSICS === 'true',
    },
  },
  scene: [
    Boot,
    Preloader,
    MainMenu,
    Subway,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
