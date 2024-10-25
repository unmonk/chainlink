"use client";

import { SlotMachine } from "@/components/coingames/slot-machine";
import { ContentLayout } from "@/components/nav/content-layout";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function SlotsPage() {
  const user = useQuery(api.users.currentUser, {});
  if (!user) {
    return null;
  }

  return (
    <ContentLayout title="Spin">
      <SlotMachine userId={user._id} />
    </ContentLayout>
  );
}
