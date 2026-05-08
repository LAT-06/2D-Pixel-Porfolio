import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { Game } from './Game';
import { EventBus } from '@/core/events/EventBus';

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  config: Phaser.Types.Core.GameConfig;
  currentScene?: (scene: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(({ config, currentScene }, ref) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    // Initialize the singleton game instance
    if (gameRef.current === null) {
      gameRef.current = Game.init(config);

      if (typeof ref === 'function') {
        ref({ game: gameRef.current, scene: null });
      } else if (ref) {
        ref.current = { game: gameRef.current, scene: null };
      }
    }

    return () => {
      // Cleanly destroy the instance to avoid memory leaks on HMR or unmount
      Game.destroyInstance();
      gameRef.current = null;
    };
  }, [config, ref]);

  useEffect(() => {
    EventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
      if (currentScene) {
        currentScene(scene);
      }

      if (typeof ref === 'function') {
        ref({ game: gameRef.current, scene });
      } else if (ref) {
        ref.current = { game: gameRef.current, scene };
      }
    });

    return () => {
      EventBus.removeListener('current-scene-ready');
    };
  }, [currentScene, ref]);

  return <div id="game-container" className="w-full h-full" />;
});
