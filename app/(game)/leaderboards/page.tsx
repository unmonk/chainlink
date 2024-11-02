import { LeaderboardList } from "@/components/leaderboards/leaderboard-list";
import { ContentLayout } from "@/components/nav/content-layout";
import { InfoIcon } from "lucide-react";

export default function Page({}) {
  return (
    <ContentLayout title="Leaderboards">
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-2xl font-bold">Leaderboards</h1>
      </div>
      <LeaderboardList />
      <span className="text-xs text-muted-foreground text-center mt-1 flex items-center justify-center">
        <InfoIcon className="h-4 w-4 mr-1" />
        Only players who have participated in the current month are included.
      </span>
    </ContentLayout>
  );
}
