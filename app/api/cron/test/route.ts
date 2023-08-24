import { Matchup, matchupRelations } from "@/drizzle/schema";
import { redis } from "@/lib/redis";
import { getPacifictime } from "@/lib/utils";

export const runtime = "edge";

export async function GET(request: Request) {
  const redisPipeline = redis.pipeline();
  const dateKey = getPacifictime().redis;

  const currentMatchups = await redis.hgetall(`MATCHUPS:${dateKey}`);
  if (!currentMatchups) {
    return new Response("No matchups found");
  }
  const gamesToWrite = [];
  for (const game_id in currentMatchups) {
    const matchup = currentMatchups[game_id] as Matchup;
    if (game_id === "401472928") {
      matchup.status = "STATUS_IN_PROGRESS";
      gamesToWrite.push(matchup);
    }
  }

  for (const game of gamesToWrite) {
    redisPipeline.hset(`MATCHUPS:${dateKey}`, {
      [game.game_id]: JSON.stringify(game),
    });
  }
  const results = await redisPipeline.exec();

  return new Response(results as any);
}
