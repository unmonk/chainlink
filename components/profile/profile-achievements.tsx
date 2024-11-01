"use client";
import AchievementCircles from "../magicui/achievement-circles";

export default function ProfileAchievements({
  userId,
  username,
}: {
  userId: string;
  username: string | null;
}) {
  return (
    <div>
      <AchievementCircles userId={userId} username={username} />
    </div>
  );
}
