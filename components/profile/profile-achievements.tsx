"use client";
import AchievementCircles from "../magicui/achievement-circles";

export default function ProfileAchievements({ userId }: { userId: string }) {
  return (
    <div>
      <AchievementCircles userId={userId} />
    </div>
  );
}
