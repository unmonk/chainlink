import { LeaderboardTabs } from "@/components/leaderboards/leaderboard-tabs";
import LeaderboardSkeleton from "@/components/skeletons/leaderboard-skeleton";
import { Suspense } from "react";

export default async function Leaderboards() {
  return (
    <div className="flex flex-col items-center mt-4">
      <h1 className="w-full text-4xl font-semibold text-center text-primary">
        Leaderboards
      </h1>
      <h4 className="w-full text-center ">Top 25</h4>
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardTabs />
      </Suspense>
    </div>
  );
}
