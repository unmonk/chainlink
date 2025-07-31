import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

export const insertNFLPickemMatchups = action({
  args: {
    campaignId: v.id("pickemCampaigns"),
    includePreseason: v.boolean(),
    includeRegularSeason: v.boolean(),
    includePostseason: v.boolean(),
    seasonYear: v.number(),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.runQuery(api.pickem.getPickemCampaign, {
      campaignId: args.campaignId,
    });
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const endpoints = [];
    if (args.includePreseason) {
      for (let i = 1; i <= 4; i++) {
        endpoints.push(
          `http://cdn.espn.com/core/nfl/schedule/_/week/${i}/year/${args.seasonYear}/seasontype/1&xhr=1&render=false&device=desktop&userab=18`
        );
      }
    }
    if (args.includeRegularSeason) {
      for (let i = 1; i <= 18; i++) {
        endpoints.push(
          `http://cdn.espn.com/core/nfl/schedule/_/week/${i}/year/${args.seasonYear}/seasontype/2&xhr=1&render=false&device=desktop&userab=18`
        );
      }
    }
    if (args.includePostseason) {
      endpoints.push(
        `http://cdn.espn.com/core/nfl/schedule/_/week/19/year/${args.seasonYear}/seasontype/3&xhr=1&render=false&device=desktop&userab=18`
      );
    }

    if (endpoints.length === 0) {
      return;
    }

    for (const endpoint of endpoints) {
      const response = await fetch(endpoint);
      const data = await response.json();
      const schedule = data.content.schedule;
      for (const day in schedule) {
        const games = schedule[day].games;
        for (const game of games) {
          const gameId = game.id;
          const homeTeam = game.competitions[0].competitors.find(
            (c: any) => c.homeAway === "home"
          );
          const awayTeam = game.competitions[0].competitors.find(
            (c: any) => c.homeAway === "away"
          );

          if (!homeTeam || !awayTeam) {
            continue;
          }
          const homeTeamName = homeTeam.team.shortDisplayName;
          const awayTeamName = awayTeam.team.shortDisplayName;
          if (
            !homeTeamName ||
            !awayTeamName ||
            homeTeamName === "TBD" ||
            awayTeamName === "TBD"
          ) {
            continue;
          }
          const homeTeamId = homeTeam.id;
          const awayTeamId = awayTeam.id;
          const homeTeamImage = homeTeam.team.logo;
          const awayTeamImage = awayTeam.team.logo;

          const gameName = game.name ? game.name : `${awayTeam} @ ${homeTeam}`;
          const gameDate = game.date;
          const week = game.week.number;
          const seasonType =
            game.season.type === 1
              ? "PRESEASON"
              : game.season.type === 2
                ? "REGULAR_SEASON"
                : "POSTSEASON";

          const overUnder =
            game.competitions[0].odds?.[0]?.overUnder || undefined;
          const spread = game.competitions[0].odds?.[0]?.spread || undefined;
          const network =
            game.competitions[0].geoBroadcasts?.[0]?.media?.shortName || "N/A";

          await ctx.runMutation(api.pickem.createPickemMatchup, {
            gameId: gameId,
            homeTeam: {
              id: homeTeamId,
              name: homeTeamName,
              score: 0,
              image: homeTeamImage,
            },
            awayTeam: {
              id: awayTeamId,
              name: awayTeamName,
              score: 0,
              image: awayTeamImage,
            },
            startTime: Date.parse(gameDate),
            title: gameName,
            campaignId: campaign._id,
            week: week,
            seasonType: seasonType,
            status: "PENDING",
            metadata: {
              homeAppreviation: homeTeam.team.abbreviation,
              awayAppreviation: awayTeam.team.abbreviation,
              network: network,
              overUnder: overUnder,
              spread: spread,
            },
          });
        }
      }
    }
  },
});
