import Phaser from 'phaser';

export interface MapConfig {
  key: string;               // Map ID (e.g., 'subway')
  tilesetKey: string;        // Tileset image ID (e.g., 'cyberpunk-tiles')
  tilesetName: string;       // Name of tileset inside Tiled (e.g., 'cyber-set')
}

/**
 * Tilemap Manager
 * Handles the boilerplate of creating maps, layers, and collision.
 * Updated to match user map conventions: Floor, Walls, Collision (objects), Spawn (objects).
 */
export class MapManager {
  private scene: Phaser.Scene;
  public map!: Phaser.Tilemaps.Tilemap;
  public layers: Map<string, any> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Creates the map and its layers based on conventions.
   */
  public createMap(config: MapConfig) {
    this.map = this.scene.make.tilemap({ key: config.key });
    
    // Add Tileset
    const tileset = this.map.addTilesetImage(config.tilesetName, config.tilesetKey);
    if (!tileset) {
      console.error(`Tileset "${config.tilesetName}" not found in map "${config.key}". Check the tileset name in Tiled.`);
      // We don't throw here to allow partial loading for debugging
    }

    // Create Visual Layers
    if (tileset) {
      this.createLayer('Floor', tileset);
      this.createLayer('Walls', tileset);
    } else {
      console.error('Map layers could not be created because tileset is missing.');
    }
    
    // Set World Bounds to Map Size
    this.scene.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    
    return this.map;
  }

  /**
   * Sets up physics collisions for the player against the 'Collision' object layer.
   */
  public setupObjectCollision(player: Phaser.GameObjects.GameObject) {
    const collisionLayer = this.map.getObjectLayer('Collision');
    if (!collisionLayer) {
      console.warn('Object layer "Collision" not found');
      return;
    }

    // Create static physics bodies for each rectangle in the collision layer
    const staticGroup = this.scene.physics.add.staticGroup();
    
    collisionLayer.objects.forEach(obj => {
      if (obj.x !== undefined && obj.y !== undefined && obj.width !== undefined && obj.height !== undefined) {
        // Tiled objects are positioned by top-left for rects
        const rect = this.scene.add.rectangle(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width, obj.height);
        staticGroup.add(rect);
        rect.setVisible(false); // Hide the collision rectangles
      }
    });

    this.scene.physics.add.collider(player, staticGroup);
  }

  /**
   * Helper to find a spawn point by name in the 'Spawn' layer
   */
  public getSpawnPoint(name: string): { x: number; y: number } {
    const spawnLayer = this.map.getObjectLayer('Spawn');
    if (!spawnLayer) {
      console.warn('Object layer "Spawn" not found');
      return { x: 400, y: 300 }; // Fallback
    }

    const spawn = spawnLayer.objects.find(obj => obj.name === name);
    if (!spawn) {
      console.warn(`Spawn point "${name}" not found in Spawn layer`);
      return { x: 400, y: 300 };
    }

    return { x: spawn.x || 0, y: spawn.y || 0 };
  }

  private createLayer(name: string, tileset: Phaser.Tilemaps.Tileset) {
    // If tileset is missing, we try to create the layer anyway to see what happens
    const layer = this.map.createLayer(name, tileset, 0, 0);
    if (layer) {
      this.layers.set(name, layer);
    }
    return layer;
  }
}
