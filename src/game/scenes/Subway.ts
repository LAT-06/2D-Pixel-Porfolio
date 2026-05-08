import { Scene } from 'phaser';
import { Player } from '@/game/entities/Player';
import { InputManager } from '@/game/managers/InputManager';
import { CameraManager } from '@/game/managers/CameraManager';
import { MapManager } from '@/game/managers/MapManager';
import { EventBus } from '@/core/events/EventBus';

export class Subway extends Scene {
  private player!: Player;
  private inputManager!: InputManager;
  private cameraManager!: CameraManager;
  private mapManager!: MapManager;

  constructor() {
    super('Subway');
  }

  preload() {
    this.load.path = 'assets/';
    
    // Using actual filenames found in your public/assets/tilesets/ folder
    this.load.image('cyber-tileset-02', 'tilesets/neo_zero_tileset_02.png');
    this.load.image('cyber-buildings-01', 'tilesets/neo_zero_tiles_and_buildings_01.png');
    
    // New Player Spritesheet: 16x32 frames
    this.load.spritesheet('player-sprite', 'tilesets/player.png', {
      frameWidth: 16,
      frameHeight: 32
    });
    
    // JSON: Using your updated map
    this.load.tilemapTiledJSON('subway-map', 'maps/testmap.tmj');
  }

  create() {
    this.inputManager = new InputManager(this);
    this.cameraManager = new CameraManager(this);
    this.mapManager = new MapManager(this);
    
    // 1. Setup Map
    this.mapManager.createMap({
      key: 'subway-map',
      tilesetKey: 'cyber-tileset-02',
      tilesetName: 'neo_zero_tileset_02'
    });

    // 2. Get Spawn Point
    const spawn = this.mapManager.getSpawnPoint('SpawnPoint');

    // 3. Setup Player
    this.player = new Player({
      scene: this,
      x: spawn.x,
      y: spawn.y,
      texture: 'player-sprite',
      speed: 180
    });

    // 4. Setup Collisions (Using Object Layer method)
    this.mapManager.setupObjectCollision(this.player);

    // 5. Setup Cinematic Camera
    this.cameraManager.follow(this.player, {
      lerp: { x: 0.1, y: 0.1 },
      deadzone: { width: 40, height: 40 },
      zoom: 2.5,
      bounds: {
        x: 0,
        y: 0,
        width: this.mapManager.map.widthInPixels,
        height: this.mapManager.map.heightInPixels
      }
    });

    this.cameraManager.fadeIn(1000);

    EventBus.emit('current-scene-ready', this);
  }

  update() {
    const direction = this.inputManager.getMovementDirection();
    this.player.updateMovement(direction);

    if (this.inputManager.isInteracting()) {
      this.cameraManager.shake(0.01, 100);
    }
  }
}
