import { internal, api } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const checkPgaMatchups = internalMutation({
  handler: async (ctx) => {
    const activeMatchups = await ctx.db
      .query("pgaMatchups")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    for (const matchup of activeMatchups) {
      const event = await ctx.db
        .query("pgaEvents")
        .withIndex("by_externalId", (q) => q.eq("externalId", matchup.eventId))
        .first();

      if (!event) {
        console.error(`Could not find event for matchup ${matchup._id}`);
        continue;
      }

      const leaderboardData = await ctx.runAction(
        api.pga_actions.fetchLeaderboardData,
        { url: event.leaderboardUrl }
      );

      const golferA = await ctx.db.get(matchup.golferAId);
      const golferB = await ctx.db.get(matchup.golferBId);

      if (!golferA || !golferB) {
        console.error(`Could not find golfers for matchup ${matchup._id}`);
        continue;
      }

      const golferAData = leaderboardData[golferA.externalId];
      const golferBData = leaderboardData[golferB.externalId];

      if (golferAData && golferBData) {
        if (
          golferAData.thru >= matchup.holes &&
          golferBData.thru >= matchup.holes
        ) {
          await ctx.runMutation(internal.pga.finalizePgaMatchup, {
            matchupId: matchup._id,
            golferAScore: golferAData.score,
            golferBScore: golferBData.score,
          });
        }
      }
    }
  },
});
