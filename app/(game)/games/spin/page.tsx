"use client";

import { SlotMachine } from "@/components/coingames/slot-machine";
import { ContentLayout } from "@/components/nav/content-layout";

export default function SlotsPage() {
  return (
    <ContentLayout title="Spin">
      <SlotMachine />
    </ContentLayout>
  );
}
