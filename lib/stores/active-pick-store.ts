import { getPick, makePick } from "../actions/picks";
import { db } from "@/drizzle/db";
import { NewPick, Pick, picks } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { create } from "zustand";

type ActivePickState = {
  activePick?: Pick;
  setActivePick: (pick: NewPick) => void;
  getActivePick: (userId: string) => void;
  loading?: boolean;
};

export const useActivePickStore = create<ActivePickState>((set) => ({
  activePick: undefined,
  loading: true,
  getActivePick: async (userId: string) => {
    const pick = await getPick(userId);
    if (!pick) return;
    set({ activePick: pick, loading: false });
  },
  setActivePick: async (pick: NewPick) => {
    console.log(pick);
    const fetchedPick = await makePick(pick);
    console.log(fetchedPick, "fetchedPick");
    set({ activePick: fetchedPick, loading: false });
  },
}));
