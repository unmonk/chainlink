import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { SlotSymbolType } from "./schema";

export const SLOT_MACHINE_CONFIG = {
  active: true,
  symbolWeights: {
    CHERRY: 35,
    BAR: 25,
    SEVEN: 20,
    STAR: 10,
    DIAMOND: 7,
    COIN: 3,
  },
  payouts: [
    { line: 5, payout: 1000 }, // 5 matching symbols
    { line: 4, payout: 100 }, // 4 matching symbols
    { line: 3, payout: 50 }, // 3 matching symbols
    { line: 2, payout: 10 }, // 2 matching symbols
  ],
  spinCost: 10,
  freeSpinInterval: 86400000, // 24 hours in milliseconds
};

export const getSpinGame = query({
  args: {},
  handler: async (ctx) => {
    const clerkUser = await ctx.auth.getUserIdentity();
    if (!clerkUser) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", clerkUser.tokenIdentifier)
      )
      .unique();
    if (!user) return null;

    // Check if user has enough coins for paid spin
    const hasEnoughCoins = user.coins >= SLOT_MACHINE_CONFIG.spinCost;

    // Check if user has free spin available
    const lastFreeSpin = user.coinGames?.lastFreeSpin ?? 0;
    const canFreeSpin =
      Date.now() - lastFreeSpin >= SLOT_MACHINE_CONFIG.freeSpinInterval;

    // Calculate next free spin time if can't spin now
    const nextFreeSpinTime = canFreeSpin
      ? null
      : new Date(lastFreeSpin + SLOT_MACHINE_CONFIG.freeSpinInterval).getTime();

    const spins = await ctx.db
      .query("slotMachineSpins")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);

    return {
      userId: user._id,
      hasEnoughCoins,
      canFreeSpin,
      spinCost: SLOT_MACHINE_CONFIG.spinCost,
      nextFreeSpinTime,
      spins,
    };
  },
});

// Spin the slot machine
export const spin = mutation({
  args: { userId: v.id("users"), useFreeSpin: v.boolean() },
  handler: async (ctx, { userId, useFreeSpin }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    // Validate spin eligibility
    if (useFreeSpin) {
      const lastFreeSpin = user.coinGames?.lastFreeSpin ?? 0;
      if (Date.now() - lastFreeSpin < SLOT_MACHINE_CONFIG.freeSpinInterval) {
        throw new Error("Free spin not available yet");
      }
    } else {
      if (user.coins < SLOT_MACHINE_CONFIG.spinCost) {
        throw new Error("Not enough coins");
      }
    }

    // Generate result
    const result = generateSpinResult(SLOT_MACHINE_CONFIG.symbolWeights);
    const payout = calculatePayout(result, SLOT_MACHINE_CONFIG.payouts);

    // Record the spin
    await ctx.db.insert("slotMachineSpins", {
      userId,
      spunAt: Date.now(),
      result,
      payout,
      freeSpin: useFreeSpin,
    });

    // Update user's coins and spin timestamp
    const coinUpdate = useFreeSpin
      ? payout
      : payout - SLOT_MACHINE_CONFIG.spinCost;

    // Update user's coins and spin timestamp
    await ctx.db.patch(userId, {
      coins: user.coins + coinUpdate,
      coinGames: {
        ...user.coinGames,
        lastSlotSpin: Date.now(),
        lastFreeSpin: useFreeSpin ? Date.now() : user.coinGames?.lastFreeSpin,
      },
    });

    //if payout is greater than 0, add to transaction log
    if (payout > 0) {
      await ctx.db.insert("coinTransactions", {
        userId,
        amount: coinUpdate,
        type: useFreeSpin ? "GIFT" : "PAYOUT",
        status: "COMPLETE",
      });
    }
    return { result, payout };
  },
});

// Helper functions
function generateSpinResult(
  weights: Record<SlotSymbolType, number>
): SlotSymbolType[] {
  const symbols = Object.keys(weights);
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return Array(5)
    .fill(null)
    .map(() => {
      const r = Math.random() * totalWeight;
      let sum = 0;
      for (const symbol of symbols) {
        sum += weights[symbol as SlotSymbolType];
        if (r <= sum) return symbol as SlotSymbolType;
      }
      return symbols[0] as SlotSymbolType;
    });
}

function calculatePayout(
  result: string[],
  payouts: { line: number; payout: number }[]
): number {
  // Count consecutive matching symbols from left to right
  let matches = 1;
  for (let i = 1; i < result.length; i++) {
    if (result[i] === result[0]) {
      matches++;
    } else {
      break;
    }
  }

  // Find the highest matching payout
  const matchingPayout = payouts
    .filter((p) => p.line <= matches)
    .sort((a, b) => b.payout - a.payout)[0];

  return matchingPayout?.payout ?? 0;
}

// Updated initialization with 5-slot configuration
export const initializeSlotMachine = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("slotMachineConfig")
      .filter((q) => q.eq(q.field("active"), true))
      .first();

    if (!existing) {
      await ctx.db.insert("slotMachineConfig", {
        active: true,
        symbolWeights: {
          CHERRY: 35,
          BAR: 25,
          SEVEN: 20,
          STAR: 10,
          DIAMOND: 7,
          COIN: 3,
        },
        payouts: [
          { line: 5, payout: 1000 }, // 5 matching symbols
          { line: 4, payout: 100 }, // 4 matching symbols
          { line: 3, payout: 50 }, // 3 matching symbols
          { line: 2, payout: 10 }, // 2 matching symbols
        ],
        spinCost: 10,
        freeSpinInterval: 86400000, // 24 hours in milliseconds
      });
    }
  },
});
