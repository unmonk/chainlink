import { query } from "./_generated/server";

export const getChainLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    //get all active chains
    const chains = await ctx.db
      .query("chains")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();

    //sort chains by best chain, then wins, then pushes
    chains.sort((a, b) => {
      // First compare chains
      if (a.chain !== b.chain) {
        return b.chain - a.chain;
      }
      // If chains are equal, compare wins
      if (a.wins !== b.wins) {
        return b.wins - a.wins;
      }
      // If wins are equal, compare pushes
      return b.pushes - a.pushes;
    });

    return Promise.all(
      (chains as any[]).map(async (chain, index) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("externalId", chain.userId))
          .unique();
        return {
          rank: index + 1,
          user,
          chain,
        };
      })
    );
  },
});
