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
      <p className="mb-2 p-2 bg-background/20 rounded-md text-sm text-muted-foreground w-3-4 mx-auto self-center">
        The Blackjack game is played for our in-game currency, Links. You can
        play one hand per day for free, otherwise playing requires you to stake
        your hard earned Links. This is a basic blackjack game, with no splits,
        doubles, or insurance. Blackjack pays at 2.5:1
      </p>
    </ContentLayout>
  );
}
