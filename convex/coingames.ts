import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { SlotSymbolType, PaylineType } from "./schema";

// Enhanced slot machine configuration
export const ENHANCED_SLOT_CONFIG = {
  active: true,
  symbolWeights: {
    CHERRY: 35,
    BAR: 25,
    SEVEN: 20,
    STAR: 10,
    DIAMOND: 7,
    COIN: 3,
    WILD: 1,
    SCATTER: 1,
  },
  payouts: [
    { line: 5, payout: 500 },
    { line: 4, payout: 50 },
    { line: 3, payout: 15 },
  ],
  scatterPayouts: [
    { count: 5, payout: 1000 },
    { count: 4, payout: 200 },
    { count: 3, payout: 50 },
  ],
  paylines: [
    {
      type: "HORIZONTAL_1" as PaylineType,
      name: "Top Line",
      positions: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
      ],
    },
    {
      type: "HORIZONTAL_2" as PaylineType,
      name: "Middle Line",
      positions: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
      ],
    },
    {
      type: "HORIZONTAL_3" as PaylineType,
      name: "Bottom Line",
      positions: [
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4],
      ],
    },
    {
      type: "V_SHAPE" as PaylineType,
      name: "V Shape Up",
      positions: [
        [0, 0],
        [1, 1],
        [2, 2],
        [1, 3],
        [0, 4],
      ],
    },
    {
      type: "V_SHAPE_UPSIDE_DOWN" as PaylineType,
      name: "V Shape Down",
      positions: [
        [2, 0],
        [1, 1],
        [0, 2],
        [1, 3],
        [2, 4],
      ],
    },
  ],
  minBet: 1,
  maxBet: 100,
  defaultBet: 10,
  freeSpinInterval: 86400000,
};

export const getEnhancedSpinGame = query({
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

    const lastFreeSpin = user.coinGames?.lastFreeSpin ?? 0;
    const canFreeSpin =
      Date.now() - lastFreeSpin >= ENHANCED_SLOT_CONFIG.freeSpinInterval;
    const nextFreeSpinTime = canFreeSpin
      ? null
      : new Date(
          lastFreeSpin + ENHANCED_SLOT_CONFIG.freeSpinInterval
        ).getTime();

    const spins = await ctx.db
      .query("slotMachineSpins")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);

    return {
      userId: user._id,
      userCoins: user.coins,
      canFreeSpin,
      nextFreeSpinTime,
      spins,
      config: ENHANCED_SLOT_CONFIG,
    };
  },
});

export const enhancedSpin = mutation({
  args: {
    userId: v.id("users"),
    useFreeSpin: v.boolean(),
    betAmount: v.optional(v.number()),
  },
  handler: async (
    ctx,
    { userId, useFreeSpin, betAmount = ENHANCED_SLOT_CONFIG.defaultBet }
  ) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Validate spin eligibility
    if (useFreeSpin) {
      const lastFreeSpin = user.coinGames?.lastFreeSpin ?? 0;
      if (Date.now() - lastFreeSpin < ENHANCED_SLOT_CONFIG.freeSpinInterval) {
        throw new Error("Free spin not available yet");
      }
    } else {
      if (user.coins < betAmount) {
        throw new Error("Not enough coins");
      }
      if (
        betAmount < ENHANCED_SLOT_CONFIG.minBet ||
        betAmount > ENHANCED_SLOT_CONFIG.maxBet
      ) {
        throw new Error("Invalid bet amount");
      }
    }

    // Generate 3x5 grid result
    const result = generateEnhancedSpinResult(
      ENHANCED_SLOT_CONFIG.symbolWeights
    );

    // Calculate payouts for all paylines
    const paylineResults = calculatePaylinePayouts(
      result,
      ENHANCED_SLOT_CONFIG.paylines,
      ENHANCED_SLOT_CONFIG.payouts,
      betAmount
    );

    const totalPayout = paylineResults.reduce(
      (sum, line) => sum + line.payout,
      0
    );

    // Record the spin
    await ctx.db.insert("slotMachineSpins", {
      userId,
      spunAt: Date.now(),
      result,
      payout: totalPayout,
      freeSpin: useFreeSpin,
      betAmount,
      paylines: paylineResults,
    });

    // Update user's coins
    const coinUpdate = useFreeSpin ? totalPayout : totalPayout - betAmount;
    await ctx.db.patch(userId, {
      coins: user.coins + coinUpdate,
      coinGames: {
        ...user.coinGames,
        lastSlotSpin: Date.now(),
        lastFreeSpin: useFreeSpin ? Date.now() : user.coinGames?.lastFreeSpin,
      },
    });

    // Record transaction if payout > 0
    if (totalPayout > 0) {
      await ctx.db.insert("coinTransactions", {
        userId,
        amount: coinUpdate,
        type: useFreeSpin ? "GIFT" : "PAYOUT",
        status: "COMPLETE",
      });
    }

    return { result, totalPayout, paylineResults };
  },
});

// Generate 3x5 grid result
function generateEnhancedSpinResult(
  weights: Record<SlotSymbolType, number>
): SlotSymbolType[][] {
  const symbols = Object.keys(weights);
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return Array(3)
    .fill(null)
    .map(() =>
      Array(5)
        .fill(null)
        .map(() => {
          const r = Math.random() * totalWeight;
          let sum = 0;
          for (const symbol of symbols) {
            sum += weights[symbol as SlotSymbolType];
            if (r <= sum) return symbol as SlotSymbolType;
          }
          return symbols[0] as SlotSymbolType;
        })
    );
}

// Calculate payouts for all paylines
function calculatePaylinePayouts(
  result: SlotSymbolType[][],
  paylines: any[],
  payouts: { line: number; payout: number }[],
  betAmount: number
) {
  const paylineResults = paylines.map((payline) => {
    const symbols = payline.positions.map(
      ([row, col]: [number, number]) => result[row][col]
    );

    // Count consecutive matching symbols from left to right
    let matches = 1;
    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] === symbols[0]) {
        matches++;
      } else {
        break;
      }
    }

    // Find the highest matching payout
    const matchingPayout = payouts
      .filter((p) => p.line <= matches)
      .sort((a, b) => b.payout - a.payout)[0];

    const payout = matchingPayout
      ? (matchingPayout.payout * betAmount) / ENHANCED_SLOT_CONFIG.defaultBet
      : 0;

    return {
      type: payline.type,
      symbols,
      matches,
      payout,
    };
  });

  // Calculate scatter wins
  const scatterCount = result
    .flat()
    .filter((symbol) => symbol === "SCATTER").length;
  const scatterPayout =
    scatterCount >= 3
      ? (ENHANCED_SLOT_CONFIG.scatterPayouts.find(
          (p) => p.count === scatterCount
        )?.payout ?? 0)
      : 0;

  const scatterWin =
    scatterCount >= 3
      ? {
          type: "SCATTER" as PaylineType,
          symbols: Array(scatterCount).fill("SCATTER"),
          matches: scatterCount,
          payout: (scatterPayout * betAmount) / ENHANCED_SLOT_CONFIG.defaultBet,
        }
      : null;

  return scatterWin ? [...paylineResults, scatterWin] : paylineResults;
}
