"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { leagueLogos } from "@/convex/utils";
import Image from "next/image";

type MatchupWithPicks = Doc<"matchups"> & { picks: Doc<"picks">[] };

export const AdminColumns: ColumnDef<MatchupWithPicks>[] = [
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
    accessorKey: "picks",
    header: "Picks",
    cell: ({ row }) => {
      return (
        <Badge
          variant={"outline"}
          className={row.original.picks.length > 0 ? "bg-accent" : ""}
        >
          {row.original.picks.length}
        </Badge>
      );
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      return row.original.featured ? (
        <Badge className="bg-orange-600">🔗CB</Badge>
      ) : (
        <Badge variant="outline">No</Badge>
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
    header: "Start Time",
    cell: ({ row }) => {
      return (
        <p className="text-nowrap">
          {new Date(row.original.startTime).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
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
];
