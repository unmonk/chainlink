import { getStreak } from "@/lib/actions/streaks"
import { cn } from "@/lib/utils"
import { clerkClient } from "@clerk/nextjs"
import { ImageResponse } from "next/og"
import { getUserByUsername } from "@/lib/actions/users"

export const runtime = "edge"

export const alt = "ChainLink Profile"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({ params }: { params: { id: string } }) {
  const user = await getUserByUsername(params.id)
  const streakData = await getStreak(params.id)
  if (!streakData) {
    throw Error("Streak not found")
  }

  const wins = streakData?.wins || 0
  const losses = streakData?.losses || 0
  const pushes = streakData?.pushes || 0
  const streak = streakData?.streak || 0

  const streakPrefix = streak >= 0 ? "W" : "L"
  const streakColor = streak >= 0 ? " text-green-500" : " text-red-500"
  const bannerColor = streak >= 0 ? "bg-green-500" : "bg-red-500"
  const streakText = `${streakPrefix}${Math.abs(streak)}`

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full bg-black text-white border-2">
        <div tw="flex flex-row justify-between items-center text-center w-full h-3/4 p-4">
          <div tw="flex flex-col justify-center items-center">
            <h3>Chain</h3>
            <div tw={cn(streakColor, "flex text-4xl font-bold")}>
              {streakText}
            </div>
          </div>
          <div tw="flex flex-col justify-center items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.imageUrl || "/images/alert-octagon.svg"}
              alt={user.username || user.id}
              tw="w-16 h-16 rounded-full"
            />
            <h3 tw="font-bold text-4xl">{user.username}</h3>
          </div>
          <div tw="flex flex-col justify-center items-center">
            <h3>Wins</h3>
            <div tw="flex text-4xl">{wins}</div>
          </div>
          <div tw="flex flex-col justify-center items-center">
            <h3>Losses</h3>
            <div tw="flex text-4xl">{losses}</div>
          </div>
          <div tw="flex flex-col justify-center items-center">
            <h3>Pushes</h3>
            <div tw="flex text-4xl">{pushes}</div>
          </div>
        </div>
        <div tw={cn("flex h-1/4 w-full justify-center", bannerColor)}>
          <h4 tw="text-4xl font-bold"> Build your chain at ChainLink.st 🔗</h4>
        </div>
      </div>
    ),
    {
      height: 600,
      width: 1200,
    }
  )
}
