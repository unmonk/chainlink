"use server"

import { getCronsList } from "./crons"
import { db } from "@/drizzle/db"
import { picks, squads } from "@/drizzle/schema"
import { clerkClient } from "@clerk/nextjs"
import { eq, sql } from "drizzle-orm"

export async function getAdminDashboard() {
  const userCountPromise = clerkClient.users.getCount()
  const activePickCountPromise = db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(picks)
    .where(eq(picks.active, true))

  const totalSquadsPromise = db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(squads)

  const cronsPromise = getCronsList()

  const [userCount, activePicks, crons, squadsCount] = await Promise.all([
    userCountPromise,
    activePickCountPromise,
    cronsPromise,
    totalSquadsPromise,
  ])

  const totalEPDs = crons.reduce((acc, cron) => acc + cron.epds_occupied, 0)
  const totalFailures = crons.reduce(
    (acc, cron) => acc + parseInt(cron.total_failures),
    0
  )
  const totalSuccesses = crons.reduce(
    (acc, cron) => acc + parseInt(cron.total_successes),
    0
  )

  return {
    users: userCount,
    activePicks: activePicks[0].count,
    squads: squadsCount[0].count,
    crons: {
      dailyJobs: totalEPDs,
      totalFailures,
      totalSuccesses,
    },
  }
}

// export async function getAdminStats(){
//   const winsByLeagueQuery = sql`SELECT
//     user_id,
//     SUM(CASE WHEN league = 'NFL' THEN 1 ELSE 0 END) AS NFL,
//     SUM(CASE WHEN league = 'NBA' THEN 1 ELSE 0 END) AS NBA,   SUM(CASE WHEN league = 'MLB' THEN 1 ELSE 0 END) AS MLB,
//     SUM(CASE WHEN league = 'NHL' THEN 1 ELSE 0 END) AS NHL,
//     SUM(CASE WHEN league = 'COLLEGE-FOOTBALL' THEN 1 ELSE 0 END) AS COLLEGE_FOOTBALL,
//     SUM(CASE WHEN league = 'MBB' THEN 1 ELSE 0 END) AS MBB,
//     SUM(CASE WHEN league = 'WBB' THEN 1 ELSE 0 END) AS WBB,
//     SUM(CASE WHEN league = 'WNBA' THEN 1 ELSE 0 END) AS WNBA,
//     SUM(CASE WHEN league = 'NCAA' THEN 1 ELSE 0 END) AS NCAA,
//     SUM(CASE WHEN league = 'OTHER' THEN 1 ELSE 0 END) AS OTHER
// FROM
//     (
//         SELECT
//             p.user_id,
//             m.leagues as league
//         FROM
//             picks AS p
//         JOIN
//             matchups AS m ON p.matchup_id = m.id
//         WHERE
//             p.pick_status = 'WIN'
//     ) AS subquery
// GROUP BY
//     user_id
// ORDER BY
//     user_id;`;

//   interface WinsByLeague {
//     user_id: string;
//     NFL: number;
//     NBA: number;
//     MLB: number;
//     NHL: number;
//     COLLEGE_FOOTBALL: number;
//     MBB: number;
//     WBB: number;
//     WNBA: number;
//     NCAA: number;
//     OTHER: number;
//   }

//   type UserWinsByLeague = WinsByLeague &  {
//     username: string;
//     imageUrl: string;
//   }

//   const winsByLeague = (await db.execute(winsByLeagueQuery)) as WinsByLeague[];
//   const userIds = winsByLeague.map(row => row.user_id);
//   const users = await clerkClient.users.getUserList({
//     userId: userIds,
//     limit: userIds.length,
//   });
//   //merge users and winsByLeague into UsersWinsByLeague
//   const usersWinsByLeague = winsByLeague.map(wins => {
//     const user = users.find(user => user.id === wins.user_id);
//     return {
//       ...wins,
//       username: user?.username,
//       imageUrl: user?.imageUrl
//     }
//   }) as UserWinsByLeague[];

//   return usersWinsByLeague;
// }
