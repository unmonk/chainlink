import { query } from "./_generated/server";

export const getChainLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    //get all active chains
    const chains = await ctx.db
      .query("chains")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();

    //sort chains by best chain
    chains.sort((a, b) => b.chain - a.chain);

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
