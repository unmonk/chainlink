import { NewPick, Pick } from "@/drizzle/schema";
import { getPick } from "@/lib/actions/picks";
import { create } from "zustand";

interface usePickStore {
  modalOpen: boolean;
  openModal: (newPick?: NewPick) => void;
  closeModal: () => void;
  setPick: (pick: Pick) => void;
  pick?: Pick;
  newPick?: NewPick;
}

export const usePick = create<usePickStore>((set) => ({
  modalOpen: false,
  openModal: (newPick?: NewPick) => set({ modalOpen: true, newPick: newPick }),
  closeModal: () => set({ modalOpen: false, newPick: undefined }),
  setPick: (pick: Pick) => set({ pick }),
}));
