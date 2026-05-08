import { Scene } from 'phaser';
import { EventBus } from '@/core/events/EventBus';

export class MainMenu extends Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    // Notify React that we are on the Main Menu
    EventBus.emit('current-scene-ready', this);

    this.add.text(this.cameras.main.centerX, 200, 'LAT // UNDERGROUND', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#00ff41'
    }).setOrigin(0.5);

    const startText = this.add.text(this.cameras.main.centerX, 400, '> INITIALIZE CONNECTION', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#00ff41'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    startText.on('pointerdown', () => {
      console.log('Starting game...');
      // this.scene.start('Subway');
    });

    // Simple hover effect
    startText.on('pointerover', () => startText.setStyle({ color: '#ffffff' }));
    startText.on('pointerout', () => startText.setStyle({ color: '#00ff41' }));
  }
}
