"use client";
import { useUser } from "@clerk/nextjs";
import AchievementCircles from "../magicui/achievement-circles";

export default function DashboardAchievements() {
  const { user } = useUser();

  return (
    <div>
      {user && (
        <AchievementCircles userId={user?.id} username={user?.username} />
      )}
    </div>
  );
}
