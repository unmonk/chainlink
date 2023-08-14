import { Pick } from "@/drizzle/schema";
import { create } from "zustand";

type ActivePickState = {
  activePick?: Partial<Pick>;
  setActivePick: (pick?: Partial<Pick>) => void;
};

export const useActivePickStore = create<ActivePickState>((set) => ({
  activePick: undefined,
  setActivePick: (pick) => {
    set({ activePick: pick });
  },
}));
