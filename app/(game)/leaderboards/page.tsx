import { LeaderboardList } from "@/components/leaderboards/leaderboard-list";
import { ContentLayout } from "@/components/nav/content-layout";

export default function Page({}) {
  return (
    <ContentLayout title="Leaderboards">
      <h1>Leaderboards</h1>
      <LeaderboardList />
    </ContentLayout>
  );
}
