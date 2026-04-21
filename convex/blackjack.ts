import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { BlackjackGameStatus } from "./schema";
import { api } from "./_generated/api";

const CARD_VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const SUITS = ["♠", "♣", "♥", "♦"];

function determinePayout(status: BlackjackGameStatus, betAmount: number) {
  if (status === "PLAYER_BLACKJACK")
    return Math.ceil(Math.abs(betAmount * 2.5)); // 3:2 payout for blackjack
  if (status === "PLAYER_WON") return Math.ceil(Math.abs(betAmount * 2)); // Even money (1:1) for regular win
  if (status === "DEALER_BUSTED") return Math.ceil(Math.abs(betAmount * 2)); // Even money (1:1) for dealer bust
  if (status === "PUSH") return 0; // Push returns original bet
  return undefined;
}

function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const value of CARD_VALUES) {
      deck.push({ suit, value });
    }
  }
  return shuffle(deck);
}

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//set free period to 24 hours
const freePeriod = 1000 * 60 * 60 * 24;

function calculateHandValue(hand: { value: string }[]) {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === "A") {
      aces += 1;
    } else if (["K", "Q", "J"].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  }

  for (let i = 0; i < aces; i++) {
    if (value + 11 <= 21) {
      value += 11;
    } else {
      value += 1;
    }
  }

  return value;
}

export const startGame = mutation({
  args: {
    betAmount: v.number(),
    useFreePlay: v.optional(v.boolean()),
  },
  handler: async (ctx, { betAmount, useFreePlay = false }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.runQuery(api.users.queryByClerkId, {
      clerkUserId: identity.subject,
    });

    if (!user) throw new Error("User not found");

    // Validate spin eligibility
    if (useFreePlay) {
      const lastFreeSpin = user.coinGames?.lastFreeSpin ?? 0;
      if (Date.now() - lastFreeSpin < freePeriod) {
        throw new Error("Free spin not available yet");
      }
    } else {
      if (user.coins < betAmount) {
        throw new Error("Not enough coins");
      }
    }

    //deduct bet amount from user coins
    if (!useFreePlay) {
      await ctx.scheduler.runAfter(0, api.users.adjustCoins, {
        amount: -betAmount,
        transactionType: "BLACKJACK",
        userId: user._id,
      });
    }

    const deck = createDeck();
    const playerHand = [deck.pop()!, deck.pop()!];
    const dealerHand = [deck.pop()!, { ...deck.pop()!, hidden: true }];

    let status: BlackjackGameStatus = "PLAYING";
    let payout = undefined;

    if (calculateHandValue(playerHand) === 21) {
      status = "PLAYER_BLACKJACK";
      payout = determinePayout(status, useFreePlay ? 10 : betAmount);
      if (payout) {
        await ctx.scheduler.runAfter(0, api.users.adjustCoins, {
          amount: payout,
          transactionType: "PAYOUT",
          userId: user._id,
        });
      }
    }

    await ctx.db.insert("blackjackGames", {
      userId: user._id,
      playerHand,
      dealerHand,
      status,
      betAmount,
      payout,
      deck,
    });

    await ctx.db.patch(user._id, {
      coinGames: {
        ...user.coinGames,
        lastFreeBlackjack: useFreePlay
          ? Date.now()
          : user.coinGames?.lastFreeBlackjack,
        lastPaidBlackjack: useFreePlay
          ? user.coinGames?.lastPaidBlackjack
          : Date.now(),
      },
    });
    return;
  },
});

export const canPlay = query({
  args: { userId: v.id("users"), betAmount: v.number() },
  handler: async (ctx, { userId, betAmount }) => {
    const user = await ctx.db.get(userId);
    if (!user)
      return {
        canPlay: false,
        betAmount,
        canPlayFree: false,
        nextFreeBlackjack: 0,
      };

    let canPlay = false;
    if (user.coins >= betAmount) canPlay = true;

    const lastFreeBlackjack = user.coinGames?.lastFreeBlackjack;

    let canPlayFree = false;
    let nextFreeBlackjack = null;
    if (!lastFreeBlackjack) {
      canPlayFree = true;
    } else {
      canPlayFree = Date.now() - lastFreeBlackjack >= freePeriod;
      nextFreeBlackjack = new Date(lastFreeBlackjack + freePeriod).getTime();
    }

    return {
      canPlay,
      betAmount,
      canPlayFree,
      nextFreeBlackjack,
    };
  },
});

export const hit = mutation({
  args: { gameId: v.id("blackjackGames") },
  handler: async (ctx, { gameId }) => {
    const game = await ctx.db.get(gameId);
    if (!game || game.status !== "PLAYING") return;

    const deck = [...game.deck];
    const playerHand = [...game.playerHand, deck.pop()!];
    const handValue = calculateHandValue(playerHand);

    let status: BlackjackGameStatus = game.status;
    if (handValue > 21) {
      status = "PLAYER_BUSTED";
    }

    await ctx.db.patch(gameId, {
      playerHand,
      deck,
      status,
    });
  },
});

export const stand = mutation({
  args: { gameId: v.id("blackjackGames") },
  handler: async (ctx, { gameId }) => {
    const game = await ctx.db.get(gameId);
    if (!game || game.status !== "PLAYING") return;

    let deck = [...game.deck];
    let dealerHand = game.dealerHand.map((card) => ({
      ...card,
      hidden: false,
    }));
    while (calculateHandValue(dealerHand) < 17) {
      dealerHand.push({ ...deck.pop()!, hidden: false });
    }

    const playerValue = calculateHandValue(game.playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    let status: BlackjackGameStatus;
    if (dealerValue > 21) status = "DEALER_BUSTED";
    else if (dealerValue > playerValue) status = "DEALER_WON";
    else if (dealerValue < playerValue) status = "PLAYER_WON";
    else status = "PUSH";

    const payout = determinePayout(status, game.betAmount);

    if (payout) {
      await ctx.scheduler.runAfter(0, api.users.adjustCoins, {
        amount: payout,
        transactionType: "PAYOUT",
        userId: game.userId,
      });
    }

    await ctx.db.patch(gameId, {
      dealerHand,
      deck,
      status,
      payout,
    });
  },
});

export const getCurrentGame = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("blackjackGames")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .first();
  },
});

export const getGameHistory = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("blackjackGames")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .take(20);
  },
});
