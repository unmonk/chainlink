"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trophy, X, Minus, TicketXIcon, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface PickWithDetails extends Doc<"picks"> {
  user: Doc<"users"> | null;
  matchup: Doc<"matchups"> | null;
}

export function ActivePicksList() {
  const activePicks = useQuery(api.picks.getAllActivePicks);
  const deletePick = useMutation(api.picks.adminDeletePick);
  const awardWin = useMutation(api.picks.adminAwardWin);
  const awardLoss = useMutation(api.picks.adminAwardLoss);
  const awardPush = useMutation(api.picks.adminAwardPush);

  if (!activePicks) {
    return <div>Loading...</div>;
  }

  const handleAction = async (
    action: "delete" | "win" | "loss" | "push",
    pickId: Id<"picks">
  ) => {
    try {
      switch (action) {
        case "delete":
          await deletePick({ pickId });
          toast.success("Pick deleted successfully");
          break;
        case "win":
          await awardWin({ pickId });
          toast.success("Win awarded successfully");
          break;
        case "loss":
          await awardLoss({ pickId });
          toast.success("Loss awarded successfully");
          break;
        case "push":
          await awardPush({ pickId });
          toast.success("Push awarded successfully");
          break;
      }
    } catch (error) {
      toast.error("Failed to perform action");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Matchup</TableHead>
            <TableHead>Pick</TableHead>
            <TableHead>League</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activePicks.map((pick: PickWithDetails) => (
            <TableRow key={pick._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar height="h-8" width="w-8">
                    <AvatarImage src={pick.user?.image} />
                    <AvatarFallback>
                      {pick.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{pick.user?.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/matchups/${pick.matchup?._id}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  {pick.matchup?.homeTeam.name} vs {pick.matchup?.awayTeam.name}
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar height="h-6" width="w-6">
                    <AvatarImage src={pick.pick.image} />
                    <AvatarFallback>{pick.pick.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{pick.pick.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{pick.matchup?.league}</Badge>
              </TableCell>
              <TableCell>
                {pick.matchup?.startTime
                  ? formatDistanceToNow(pick.matchup.startTime, {
                      addSuffix: true,
                    })
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    pick.status === "PENDING"
                      ? "secondary"
                      : pick.status === "WIN"
                      ? "default"
                      : pick.status === "LOSS"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {pick.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleAction("win", pick._id)}
                      className="text-green-600"
                    >
                      <Trophy className="mr-2 h-4 w-4" />
                      Award Win
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("loss", pick._id)}
                      className="text-red-600"
                    >
                      <TicketXIcon className="mr-2 h-4 w-4" />
                      Award Loss
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("push", pick._id)}
                      className="text-yellow-600"
                    >
                      <Minus className="mr-2 h-4 w-4" />
                      Award Push
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("delete", pick._id)}
                      className="text-destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Delete Pick
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 