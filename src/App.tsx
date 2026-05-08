import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from '@/game/PhaserGame';
import { GameConfig } from '@/game/config';

function App() {
  const phaserRef = useRef<IRefPhaserGame>(null);
  const [activeScene, setActiveScene] = useState<string>('Boot');

  // Callback when a scene is ready
  const onCurrentScene = (scene: Phaser.Scene) => {
    setActiveScene(scene.scene.key);
  };

  return (
    <div className="relative w-screen h-screen bg-cyber-dark overflow-hidden flex items-center justify-center">
      {/* Game Canvas Layer */}
      <div className="relative aspect-[16/9] w-full max-w-[1280px] bg-black shadow-2xl border border-cyber-green/20">
        <PhaserGame ref={phaserRef} config={GameConfig} currentScene={onCurrentScene} />
        
        {/* UI Overlay Layer (React) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* CRT Overlay Effect */}
          <div className="absolute inset-0 z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
          
          {/* Top HUD */}
          <div className="absolute top-6 left-6 z-20 font-mono text-cyber-green text-sm flex flex-col gap-1">
            <div className="animate-pulse flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyber-green shadow-[0_0_8px_#00ff41]"></div>
              CONNECTION: ESTABLISHED
            </div>
            <div className="opacity-60 text-xs">SCENE: {activeScene.toUpperCase()}</div>
          </div>

          {/* Conditional React UI based on Phaser State */}
          {activeScene === 'MainMenu' && (
            <div className="absolute bottom-12 right-12 z-20 pointer-events-auto">
              <button 
                className="px-6 py-2 border border-cyber-green text-cyber-green font-mono text-xs hover:bg-cyber-green hover:text-black transition-colors"
                onClick={() => alert('External Link: GitHub')}
              >
                [ VIEW_SOURCE ]
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
