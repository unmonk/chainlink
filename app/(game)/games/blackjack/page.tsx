"use client";

import Blackjack from "@/components/coingames/black-jack";
import { ContentLayout } from "@/components/nav/content-layout";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function BlackjackPage() {
  const user = useQuery(api.users.currentUser, {});
  if (!user) {
    return null;
  }

  return (
    <ContentLayout title="Blackjack">
      <Blackjack userId={user._id} />
    </ContentLayout>
  );
}
