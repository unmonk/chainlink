import { db } from "@/drizzle/db";
import { matchups, profiles, streaks } from "@/drizzle/schema";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { eq, sql } from "drizzle-orm";

export const getUserProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }

  //get profile
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.user_id, user.id),
  });

  if (profile) {
    return profile;
  }

  // Doesnt exist, create new profile
  await db.insert(profiles).values({
    user_id: user.id,
  });

  const newProfile = await db.query.profiles.findFirst({
    where: eq(profiles.user_id, user.id),
  });
  return newProfile;
};

export const createProfile = async (userId: string) => {
  const profile = await db.insert(profiles).values({
    user_id: userId,
  });
  return profile;
};

export const getUserStats = async (userId: string) => {
  interface LeagueStats {
    leagues: string;
    win_count: number;
  }

  const query = sql`SELECT m.leagues, COUNT(p.id) AS win_count
FROM matchups as m
INNER JOIN picks AS p on m.id = p.matchup_id
WHERE p.user_id = ${userId} AND p.pick_status = 'WIN'
GROUP BY m.leagues;`;

  const stats = await db.execute(query);
  console.log(stats);
  return stats.rows as LeagueStats[];
};
