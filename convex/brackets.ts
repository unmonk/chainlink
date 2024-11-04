import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action, mutation, query } from "./_generated/server";
import { espnBracket } from "./espnbracket";
import { bracket_game_status, bracket_tournament_status } from "./schema";

export const getTournamentById = query({
  args: { tournamentId: v.id("bracketTournaments") },
  handler: async (ctx, args) => {
    const tournament = await ctx.db.get(args.tournamentId);

    //get all bracketGames for tournament
    const bracketGames = await ctx.db
      .query("bracketGames")
      .filter((q) => q.eq(q.field("tournamentId"), args.tournamentId))
      .collect();

    return { tournament, bracketGames };
  },
});

export const createBracketTournament = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    status: bracket_tournament_status,
    startDate: v.number(),
    endDate: v.number(),
    cost: v.number(),
    reward: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bracketTournaments", {
      name: args.name,
      description: args.description,
      status: args.status,
      startDate: args.startDate,
      endDate: args.endDate,
      cost: args.cost,
      reward: args.reward,
    });
  },
});

export const createBracketGame = mutation({
  args: {
    tournamentId: v.id("bracketTournaments"),
    round: v.number(),
    gamePosition: v.number(),
    region: v.string(),
    teams: v.array(
      v.object({
        name: v.string(),
        image: v.string(),
        region: v.string(),
        seed: v.number(),
        order: v.number(),
        homeAway: v.union(v.literal("HOME"), v.literal("AWAY")),
        id: v.optional(v.string()),
        score: v.optional(v.number()),
        winner: v.optional(v.boolean()),
        espnId: v.optional(v.string()),
      })
    ),
    scheduledAt: v.number(),
    status: v.optional(bracket_game_status),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bracketGames", {
      tournamentId: args.tournamentId,
      round: args.round,
      gamePosition: args.gamePosition,
      region: args.region,
      teams: args.teams,
      scheduledAt: args.scheduledAt,
      status: args.status ? args.status : "PENDING",
    });
  },
});

export const createPastTournament = action({
  args: {},
  handler: async (ctx, args) => {
    const bracketTournament = await ctx.runMutation(
      api.brackets.createBracketTournament,
      {
        name: "2024 March Madness",
        description: "2024 March Madness",
        status: "COMPLETE",
        startDate: 1714761600000,
        endDate: 1714848000000,
        cost: 10,
        reward: 100,
      }
    );

    const bracketGames = convertESPNBracketToSchema(
      espnBracket,
      bracketTournament
    );

    for (const game of bracketGames) {
      await ctx.runMutation(api.brackets.createBracketGame, game);
    }
  },
});

function convertESPNBracketToSchema(
  espnBracket: any,
  tournamentId: Id<"bracketTournaments">
) {
  const bracketGames: any[] = [];

  // Process each matchup
  espnBracket.matchups.forEach((matchup: any) => {
    const game = {
      tournamentId: tournamentId,
      round: matchup.roundId,
      gamePosition: matchup.bracketLocation,
      region: matchup.label || "",

      teams: [
        {
          name: matchup.competitorOne.name,
          image: matchup.competitorOne.logo,
          seed: parseInt(matchup.competitorOne.seed),
          region: matchup.label || "",
          order: matchup.competitorOne.order,
          homeAway: matchup.competitorOne.homeAway.toUpperCase() as
            | "HOME"
            | "AWAY",
          winner: matchup.competitorOne.winner,
          score: matchup.competitorOne.score
            ? parseInt(matchup.competitorOne.score)
            : undefined,
          espnId: matchup.competitorOne.id,
        },
        {
          name: matchup.competitorTwo.name,
          image: matchup.competitorTwo.logo,
          seed: parseInt(matchup.competitorTwo.seed),
          region: matchup.label || "",
          order: matchup.competitorTwo.order,
          homeAway: matchup.competitorTwo.homeAway.toUpperCase() as
            | "HOME"
            | "AWAY",
          winner: matchup.competitorTwo.winner,
          score: matchup.competitorTwo.score
            ? parseInt(matchup.competitorTwo.score)
            : undefined,
          espnId: matchup.competitorTwo.id,
        },
      ],

      // Convert status based on statusState
      status: convertStatus(matchup.statusState),

      // Convert date string to timestamp
      scheduledAt: new Date(matchup.date).getTime(),
    };

    bracketGames.push(game);
  });

  return bracketGames;
}

function convertStatus(espnStatus: string): "PENDING" | "ACTIVE" | "COMPLETE" {
  switch (espnStatus) {
    case "pre":
      return "PENDING";
    case "in":
      return "ACTIVE";
    case "post":
      return "COMPLETE";
    default:
      return "PENDING";
  }
}
