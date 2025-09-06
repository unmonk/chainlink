"use node";

import { action, internalMutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import got from "got";
import * as cheerio from "cheerio";

interface Player {
  rank: number;
  name: string;
  country: string;
}

export const getPGAPlayers = action({
  args: {},
  handler: async (ctx) => {
    const response = await got(
      "https://www.pgatour.com/stats/detail/186"
    );
    const $ = cheerio.load(response.body);
    const players: Player[] = [];

    $("tr").each((i, el) => {
      if (i > 0 && i <= 50) {
        const rank = parseInt(
          $(el).find("td:nth-child(1)").text().trim()
        );
        const name = $(el).find("td:nth-child(2)").text().trim();
        const country = $(el).find("td:nth-child(3)").text().trim();
        players.push({ rank, name, country });
      }
    });

    await ctx.runMutation(api.pga.storePGAPlayers, { players });

    return players;
  },
});

export const storePGAPlayers = internalMutation({
  args: {
    players: v.array(
      v.object({
        rank: v.number(),
        name: v.string(),
        country: v.string(),
      })
    ),
  },
  handler: async (ctx, { players }) => {
    // Clear the table before inserting new players
    const allPlayers = await ctx.db.query("pgaPlayers").collect();
    for (const player of allPlayers) {
      await ctx.db.delete(player._id);
    }

    for (const player of players) {
      await ctx.db.insert("pgaPlayers", player);
    }
  },
});
