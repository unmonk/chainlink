"use client";
import { useUser } from "@clerk/nextjs";
import AchievementCircles from "../magicui/achievement-circles";
import { Card, CardTitle, CardHeader } from "../ui/card";

export default function DashboardAchievements() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <div className="flex justify-center m-2">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
              <AchievementCircles userId={user?.id} username={user?.username} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
