import { UserSearchInput } from "@/components/users/user-search-input"
import { db } from "@/drizzle/db"
import { NewMatchup, matchups, picks } from "@/drizzle/schema"
import { sendDiscordStreakNotification } from "@/lib/actions/discord-notifications"
import { getMatchupPicks } from "@/lib/actions/picks"
import { getPromiseByPick } from "@/lib/actions/streaks"
import { redis } from "@/lib/redis"
import { eq } from "drizzle-orm"

export default async function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
    </div>
  )
}
