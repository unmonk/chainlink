"use client";

import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import {
  AwardIcon,
  Ban,
  BanIcon,
  Shield,
  Trash,
  User2Icon,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { CoinAdjustmentModal } from "./admin-coin-adjust";

interface AdminUserActionsProps {
  user: Doc<"users"> | null;
}

export function AdminUserActions({ user }: AdminUserActionsProps) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-2 my-2">
      <Link href={`/admin/achievements/award/`}>
        <Button variant="secondary" size="sm">
          <AwardIcon /> Award Achievement
        </Button>
      </Link>

      <Link href={`/u/${user.name}`}>
        <Button variant="secondary" size="sm">
          <User2Icon />
          View Public Profile
        </Button>
      </Link>

      <CoinAdjustmentModal userId={user._id} />
    </div>
  );
}
