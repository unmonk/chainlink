"use client";

import MatchupList from "@/components/matchups/matchup-list";
import { ContentLayout } from "@/components/nav/content-layout";

export default function Page() {
  return (
    <ContentLayout title="Play">
      <MatchupList />
    </ContentLayout>
  );
}
