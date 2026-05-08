import { Events } from 'phaser';

// Singleton EventBus to bridge Phaser and React
export const EventBus = new Events.EventEmitter();
