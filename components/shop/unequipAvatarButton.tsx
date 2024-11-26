"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexUser } from "@/hooks/use-convex-user";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { Button } from "../ui/button";

export default function UnequipAvatarButton({
  className,
}: {
  className?: string;
}) {
  const unequipAvatarBackground = useMutation(api.shop.unEquipAvatarBackground);
  const [loading, setLoading] = useState(false);
  const user = useConvexUser();

  if (!user || !user.userId) return null;

  const handleClick = async () => {
    setLoading(true);
    await unequipAvatarBackground({ userId: user.userId as Id<"users"> });
    setLoading(false);
  };

  return (
    <Button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Unequipping..." : "Unequip Avatar Flair"}
    </Button>
  );
}
