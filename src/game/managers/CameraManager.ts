import Phaser from 'phaser';

export interface CameraConfig {
  lerp?: { x: number; y: number };
  deadzone?: { width: number; height: number };
  zoom?: number;
  bounds?: { x: number; y: number; width: number; height: number };
}

/**
 * Cinematic Camera Manager
 * Handles smooth following, room bounds, and screen effects.
 */
export class CameraManager {
  private mainCamera: Phaser.Cameras.Scene2D.Camera;
  private target: Phaser.GameObjects.GameObject | null = null;

  constructor(scene: Phaser.Scene) {
    this.mainCamera = scene.cameras.main;
    this.setupDefaults();
  }

  private setupDefaults() {
    // High-quality pixel art needs roundPixels to avoid sub-pixel jitter
    this.mainCamera.setRoundPixels(true);
    this.setLerp(0.1, 0.1);
  }

  /**
   * Sets the camera follow target with a cinematic deadzone.
   * Deadzone allows the player to move slightly before the camera follows,
   * making the world feel larger and less "attached" to the sprite.
   */
  public follow(target: Phaser.GameObjects.GameObject, config?: CameraConfig) {
    this.target = target;
    
    this.mainCamera.startFollow(
      target, 
      true, 
      config?.lerp?.x ?? 0.1, 
      config?.lerp?.y ?? 0.1
    );

    if (config?.deadzone) {
      this.mainCamera.setDeadzone(config.deadzone.width, config.deadzone.height);
    }

    if (config?.zoom) {
      this.mainCamera.setZoom(config.zoom);
    }

    if (config?.bounds) {
      this.setBounds(config.bounds.x, config.bounds.y, config.bounds.width, config.bounds.height);
    }
  }

  /**
   * Locks the camera within a specific room/area.
   * Useful when moving from the Subway to a small Safehouse.
   */
  public setBounds(x: number, y: number, width: number, height: number) {
    this.mainCamera.setBounds(x, y, width, height);
  }

  public setLerp(x: number, y: number) {
    this.mainCamera.setLerp(x, y);
  }

  public setZoom(zoom: number, duration: number = 1000) {
    this.mainCamera.zoomTo(zoom, duration, 'Cubic.easeInOut');
  }

  /**
   * Cinematic Glitch/Impact Shake
   * @param intensity - Force of the shake (0.01 to 0.05 recommended)
   * @param duration - Time in ms
   */
  public shake(intensity: number = 0.02, duration: number = 250) {
    this.mainCamera.shake(duration, intensity);
  }

  /**
   * Flash effect for "hacker detection" or "teleportation"
   */
  public flash(color: number = 0x00ff41, duration: number = 500) {
    this.mainCamera.flash(duration, (color >> 16) & 0xFF, (color >> 8) & 0xFF, color & 0xFF);
  }

  /**
   * Helper to fade out the scene during transitions
   */
  public fadeOut(duration: number = 500, callback?: () => void) {
    this.mainCamera.fadeOut(duration);
    this.mainCamera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      if (callback) callback();
    });
  }

  public fadeIn(duration: number = 500) {
    this.mainCamera.fadeIn(duration);
  }

  /**
   * Dynamically centers the camera on the target without following.
   * Good for dialogue start.
   */
  public panToTarget(duration: number = 1000) {
    if (!this.target) return;
    const body = this.target as any;
    this.mainCamera.pan(body.x, body.y, duration, 'Power2');
  }
}
