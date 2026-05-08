import { create } from 'zustand';

interface GameState {
  isDialogueOpen: boolean;
  activeModal: string | null;
  currentScene: string;
  setDialogueOpen: (isOpen: boolean) => void;
  setActiveModal: (modalId: string | null) => void;
  setCurrentScene: (sceneKey: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  isDialogueOpen: false,
  activeModal: null,
  currentScene: 'Boot',
  setDialogueOpen: (isOpen) => set({ isDialogueOpen: isOpen }),
  setActiveModal: (modalId) => set({ activeModal: modalId }),
  setCurrentScene: (sceneKey) => set({ currentScene: sceneKey }),
}));
