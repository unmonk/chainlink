import { create } from "zustand";

interface useNavStore {
  open: boolean;
  setOpen: (open: boolean | undefined) => void;
}

export const useNav = create<useNavStore>((set) => ({
  open: false,
  setOpen: (open: boolean | undefined) => set({ open }),
}));
