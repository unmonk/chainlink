import { LeaderboardTabs } from "@/components/leaderboards/leaderboard-tabs";
import LeaderboardSkeleton from "@/components/skeletons/leaderboard-skeleton";
import { Suspense } from "react";

export default async function Leaderboards() {
  return (
    <div className="mt-4 flex flex-col items-center">
      <h1 className="text-primary w-full text-center text-4xl font-semibold">
        Leaderboards
      </h1>
      <h4 className="w-full text-center ">Top 25</h4>
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardTabs />
      </Suspense>
    </div>
  );
}
