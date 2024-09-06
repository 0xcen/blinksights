import create from "zustand";

interface DevModeState {
  devMode: boolean;
  toggleDevMode: () => void;
}

export const useDevModeStore = create<DevModeState>((set) => ({
  devMode: false,
  toggleDevMode: () => set((state) => ({ devMode: !state.devMode })),
}));