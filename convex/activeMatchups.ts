import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { filter } from "convex-helpers/server/filter";
import { v } from "convex/values";
import { determineWinner, matchupReward } from "./utils";
import { api, internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { featured_type, matchup_type } from "./schema";

//Active Matchups are any matchups scheduled to be played, or currently in an in-progress or delayed state.
//Once a matchup is finalized, it will be deleted from the activeMatchups table and added to the matchups table
//This table is used to display matchups on the homepage and in the matchups page
//This table is updated by the schedules actions, which is run by the scheduler every day
//this table is updated by the scoreboards actions, which is run by the scheduler every minute

export type MatchupWithPickCounts = Doc<"matchups"> & {
  homePicks: number;
  awayPicks: number;
  reactions: Doc<"matchupReactions">[];
};

export const getActiveMatchups = query({
  args: {},
  handler: async (ctx) => {
    const currentTime = new Date().getTime();
    const minus8Hours = currentTime - 8 * 60 * 60 * 1000;
    const plus24Hours = currentTime + 24 * 60 * 60 * 1000;
    const matchups = await ctx.db
      .query("matchups")
      .withIndex("by_active_dates", (q) =>
        q
          .eq("active", true)
          .gte("startTime", minus8Hours)
          .lte("startTime", plus24Hours)
      )
      .collect();

    // Get pick counts for each matchup
    const matchupsWithPickCounts: MatchupWithPickCounts[] = [];
    for (let matchup of matchups) {
      //get picks
      const { homeTeamPicks, awayTeamPicks } = await getPickCountsForMatchup(
        ctx,
        matchup
      );

      // Include reactions in the matchup data
      const reactions = await ctx.db
        .query("matchupReactions")
        .withIndex("by_matchup", (q) => q.eq("matchupId", matchup._id))
        .collect();

      if (
        matchup.featured &&
        matchup.featuredType === "SPONSORED" &&
        matchup.metadata?.sponsored
      ) {
        const sponsor = await ctx.runQuery(api.sponsors.getById, {
          id: matchup.metadata.sponsored.sponsorId,
        });
        if (sponsor) {
          matchup.metadata.sponsored = sponsor;
        }
      }

      matchupsWithPickCounts.push({
        ...matchup,
        homePicks: homeTeamPicks || 0,
        awayPicks: awayTeamPicks || 0,
        reactions,
      });
    }
    return matchupsWithPickCounts;
  },
});
