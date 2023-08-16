"use client";

import { useActivePickStore } from "@/lib/stores/active-pick-store";
import { auth, useUser } from "@clerk/nextjs";

export function ActivePickCard() {
  const { activePick, getActivePick } = useActivePickStore();
  const { user } = useUser();

  if (!user?.id) return null;
  getActivePick(user.id);

  return (
    <div>
      {activePick?.pick_type} {activePick?.user_id}
    </div>
  );
}
