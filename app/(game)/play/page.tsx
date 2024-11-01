"use client";

import { getAuthToken } from "@/app/auth";
import ActivePickCard from "@/components/matchups/active-pick";
import MatchupList from "@/components/matchups/matchup-list";
import { ContentLayout } from "@/components/nav/content-layout";
import { api, internal } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Page() {
  return (
    <ContentLayout title="Play">
      <MatchupList />
    </ContentLayout>
  );
}
