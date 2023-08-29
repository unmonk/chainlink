import { getStreak } from "@/lib/actions/streaks";
import { cn } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs";
import Image from "next/image";
import { ImageResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
) {
  const { userId } = params;
  const user = await clerkClient.users.getUser(userId);
  if (!user) {
    return null;
  }
  const streakData = await getStreak(userId);
  if (!streakData) {
    return null;
  }

  const wins = streakData?.wins || 0;
  const losses = streakData?.losses || 0;
  const pushes = streakData?.pushes || 0;
  const streak = streakData?.streak || 0;

  const streakPrefix = streak >= 0 ? "W" : "L";
  const streakColor = streak >= 0 ? " text-green-500" : " text-red-500";
  const bannerColor = streak >= 0 ? "bg-green-500" : "bg-red-500";
  const streakText = `${streakPrefix}${Math.abs(streak)}`;

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full bg-black text-white border-2">
        <div tw="flex flex-row justify-between items-center text-center w-full h-3/4 p-4">
          <div tw="flex flex-col justify-center items-center">
            <h3>Chain</h3>
            <div tw={cn(streakColor, "text-4xl font-bold flex")}>
              {streakText}
            </div>
          </div>
          <div tw="flex flex-col justify-center items-center">
            <img
              src={user.imageUrl}
              alt={user.username || user.id}
              tw="w-16 h-16 rounded-full"
            />
            <h3 tw="font-bold">{user.username}</h3>
          </div>
          <div tw="flex flex-col justify-center items-center">
            <h3>Wins</h3>
            <div tw="flex text-4xl">{wins}</div>
          </div>
        </div>
        <div tw={cn("flex justify-center w-full h-1/4", bannerColor)}>
          <h4> Build your chain at ChainLink.st 🔗</h4>
        </div>
      </div>
    ),
    {
      width: 400,
      height: 200,
    },
  );
}
