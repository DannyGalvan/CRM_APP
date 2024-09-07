import { create } from "zustand";

interface DrawerState {
  openCreate: boolean;
  openUpdate: boolean;
  setOpenCreate: () => void;
  setOpenUpdate: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  openCreate: false,
  openUpdate: false,
  setOpenCreate: () => set((state) => ({ openCreate: !state.openCreate })),
  setOpenUpdate: () => set((state) => ({ openUpdate: !state.openUpdate })),
}));
