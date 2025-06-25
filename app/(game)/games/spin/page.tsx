"use client";

import { EnhancedSlotMachine } from "@/components/coingames/enhanced-slot-machine";

import { ContentLayout } from "@/components/nav/content-layout";

export default function SlotsPage() {
  return (
    <ContentLayout title="Spin">
      <EnhancedSlotMachine />
      <p className="mb-2 p-2 bg-background/20 rounded-md text-sm text-muted-foreground w-3/4 mx-auto self-center">
        The slots game is played for our in-game currency, Links. You can play
        one spin per day for free, otherwise playing requires you to stake your
        hard earned Links. Matching symbols only count from the left of the
        spinner.
      </p>
    </ContentLayout>
  );
}
