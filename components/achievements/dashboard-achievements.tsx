"use client";
import { useUser } from "@clerk/nextjs";
import AchievementCircles from "../magicui/achievement-circles";

export default function DashboardAchievements() {
  const { user } = useUser();

  return (
    <div>
      {user && (
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <AchievementCircles userId={user?.id} username={user?.username} />
          </div>
        </div>
      )}
    </div>
  );
}
