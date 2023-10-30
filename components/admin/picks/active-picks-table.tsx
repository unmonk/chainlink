import { AdminDeletePickModal } from "@/components/modals/admin-delete-pick-modal";
import { AdminEditPickModal } from "@/components/modals/admin-edit-pick-modal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PickWithMatchup } from "@/drizzle/schema";
import { getActivePicks } from "@/lib/actions/picks";
import { cn } from "@/lib/utils";
import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface AdminActivePicksTableProps {
  className?: string;
}

type ActivePickWithUser = PickWithMatchup & {
  user?: User;
};

const isEditButtonDisabled = (pick: ActivePickWithUser) => {
  return (
    pick.pick_status === "WIN" ||
    pick.pick_status === "LOSS" ||
    pick.pick_status === "PUSH"
  );
};

const isDeleteButtonDisabled = (pick: ActivePickWithUser) => {
  return false;
};

const AdminActivePicksTable: FC<AdminActivePicksTableProps> = async ({
  className,
}) => {
  const activePicks = (await getActivePicks()) as ActivePickWithUser[];

  const userIds = activePicks.map((pick) => pick.user_id);

  const users = await clerkClient.users.getUserList({
    userId: userIds,
    limit: 100,
  });

  //merge users into activePicks
  activePicks.forEach((pick) => {
    const user = users.find((user) => user.id === pick.user_id);
    pick.user = user;
  });

  activePicks.sort((a, b) => {
    return a.matchup_id - b.matchup_id;
  });

  return (
    <Table className={cn("w-full", className)}>
      <TableHeader>
        <TableRow>
          <TableHead>Actions</TableHead>
          <TableHead className="text-center">User</TableHead>
          <TableHead className="text-center">Pick</TableHead>
          <TableHead className="text-center">Matchup</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activePicks.map((pick) => {
          return (
            <TableRow key={pick.id}>
              <TableCell className="flex flex-row gap-1">
                <AdminDeletePickModal
                  disabled={isDeleteButtonDisabled(pick)}
                  userId={pick.user_id}
                />
                <AdminEditPickModal
                  disabled={isEditButtonDisabled(pick)}
                  pick={{
                    pick_type: pick.pick_type,
                    pick_id: pick.id,
                    user_id: pick.user_id,
                    pick_status: pick.pick_status,
                    matchup: {
                      home_team: {
                        team_name: pick.matchup?.home_team,
                        team_logo: pick.matchup?.home_image,
                      },
                      away_team: {
                        team_name: pick.matchup?.away_team,
                        team_logo: pick.matchup?.away_image,
                      },
                      question: pick.matchup?.question,
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-center justify-start">
                  <Avatar className="mx-2 h-7 w-7">
                    <AvatarImage
                      src={pick.user?.imageUrl}
                      alt={pick.user?.username || "User"}
                    />
                    <AvatarFallback>{pick.user?.username}</AvatarFallback>
                  </Avatar>
                  {pick.user?.username}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-center justify-start">
                  <Image
                    src={
                      pick.pick_type === "HOME"
                        ? pick.matchup?.home_image ||
                          "/images/alert-octagon.svg"
                        : pick.matchup?.away_image ||
                          "/images/alert-octagon.svg"
                    }
                    className="h-7 w-7"
                    width={28}
                    height={28}
                    alt={pick.pick_type}
                  />
                  {pick.pick_type}
                </div>
              </TableCell>
              <TableCell className="text-xs">
                {pick.matchup?.question}
              </TableCell>
              <TableCell>
                {pick.pick_status === "STATUS_IN_PROGRESS" && <Loader />}
                {pick.pick_status === "PENDING" && "Pending"}
                {pick.pick_status === "STATUS_UNKNOWN" && "ERROR"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AdminActivePicksTable;
