"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { leagueLogos } from "@/convex/utils";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Select } from "../ui/select";

type MatchupWithPicks = Doc<"matchups"> & { picks: Doc<"picks">[] };

export const AdminColumns: ColumnDef<MatchupWithPicks>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-4 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {row.original.status !== "STATUS_SCHEDULED" &&
              row.original.status !== "STATUS_FINAL" &&
              row.original.status !== "STATUS_FULLTIME" &&
              row.original.status !== "STATUS_POSTPONED" && (
                <DropdownMenuItem
                  onClick={() => console.log("Copy payment ID")}
                >
                  Complete Matchup
                </DropdownMenuItem>
              )}
            {row.original.status === "STATUS_SCHEDULED" && (
              <DropdownMenuItem className="text-primary">
                {row.original.featured
                  ? "Disable ChainBuilder"
                  : "Enable ChainBuilder"}
              </DropdownMenuItem>
            )}
            {row.original.status === "STATUS_SCHEDULED" && (
              <DropdownMenuItem>
                {row.original.active ? "Set Inactive" : "Set Active"}
              </DropdownMenuItem>
            )}
            {row.original.status === "STATUS_SCHEDULED" && (
              <DropdownMenuItem>Edit Matchup</DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => console.log("Copy payment ID")}
            >
              Delete Matchup and Picks
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "league",
    header: "League",
    cell: ({ row }) => {
      const leagueLogo = leagueLogos[row.original.league];
      return (
        <div className="flex flex-col items-center text-center justify-center">
          <p className="text-xs">{row.original.league}</p>
          <Image
            src={leagueLogo}
            width={50}
            height={50}
            alt={row.original.league}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      return (
        <Badge className={row.original.active ? "bg-green-500" : "bg-red-500"}>
          {row.original.active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusBadge = (status: string) => {
        switch (status) {
          case "STATUS_IN_PROGRESS":
          case "STATUS_HALFTIME":
          case "STATUS_FIRST_HALF":
          case "STATUS_SECOND_HALF":
          case "STATUS_END_PERIOD":
            return <Badge className="bg-primary">{status}</Badge>;
          case "STATUS_POSTPONED":
          case "STATUS_CANCELED":
          case "STATUS_SUSPENDED":
          case "STATUS_RAIN_DELAY":
          case "STATUS_DELAY":
            return (
              <Badge className="bg-yellow-600 hover:bg-inherit">{status}</Badge>
            );
          case "STATUS_FINAL":
          case "STATUS_FULL_TIME":
            return <Badge className="bg-red-500  hover:">{status}</Badge>;
          case "STATUS_SCHEDULED":
            return <Badge className="bg-teal-400">{status}</Badge>;
          default:
            return <Badge variant="outline">{status}</Badge>;
        }
      };
      return getStatusBadge(status);
    },
  },
  {
    accessorKey: "picks",
    header: "Picks",
    cell: ({ row }) => {
      const homeId = row.original.homeTeam.id;
      const awayId = row.original.awayTeam.id;

      const homeCount = row.original.picks.reduce((acc, pick) => {
        return pick.pick.id === homeId ? acc + 1 : acc;
      }, 0);
      const awayCount = row.original.picks.reduce((acc, pick) => {
        return pick.pick.id === awayId ? acc + 1 : acc;
      }, 0);
      return (
        <div className="flex flex-col items-center justify-center">
          <Badge
            variant={"outline"}
            className={row.original.picks.length > 0 ? "bg-accent" : ""}
          >
            {row.original.picks.length}
          </Badge>
          <div className="flex flex-row justify-center">
            <Badge
              variant={"outline"}
              className={awayCount > 0 ? "bg-accent" : ""}
            >
              {awayCount}
            </Badge>
            <Badge
              variant={"outline"}
              className={homeCount > 0 ? "bg-accent" : ""}
            >
              {homeCount}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "featured",
    header: "ChainBuilder",
    cell: ({ row }) => {
      return (
        <Select
          value={
            row.original.featured &&
            row.original.featuredType === "CHAINBUILDER"
              ? "Enabled"
              : "Disabled"
          }
        >
          <option value="Enabled">Enabled</option>
          <option value="Disabled">Disabled</option>
        </Select>
      );
    },
  },
  {
    accessorKey: "winnerId",
    header: "Winner",
    cell: ({ row }) => {
      if (row.original.winnerId) {
        //get the winner from homeTeam or awayTeam by id
        const winner =
          row.original.homeTeam.id === row.original.winnerId
            ? row.original.homeTeam
            : row.original.awayTeam;
        return (
          <div className="flex flex-col items-center text-center justify-center">
            <p className="text-xs">{winner.name}</p>
            <Image
              src={winner.image}
              width={50}
              height={50}
              alt={winner.name}
            />
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center text-center justify-center">
            <Badge variant="outline">TBD</Badge>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "startTime",
    header: "Start | Details",
    cell: ({ row }) => {
      return (
        <p className="text-nowrap">
          {row.original.status !== "STATUS_SCHEDULED" &&
            row.original.metadata?.statusDetails}
          {row.original.status === "STATUS_SCHEDULED" &&
            new Date(row.original.startTime).toLocaleString("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            })}
        </p>
      );
    },
  },
];
