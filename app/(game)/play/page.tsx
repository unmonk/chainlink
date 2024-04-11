"use client";

import { getAuthToken } from "@/app/auth";
import ActivePickCard from "@/components/matchups/active-pick";
import MatchupList from "@/components/matchups/matchup-list";
import { api, internal } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Page() {
  return (
    <main>
      <MatchupList />
    </main>
  );
}
