"use client";

import { useActivePickStore } from "@/lib/stores/active-pick-store";

export function ActivePickCard() {
  const { activePick } = useActivePickStore();

  return <div>{activePick?.user_id}</div>;
}
