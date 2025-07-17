"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { ColumnDef, Row } from "@tanstack/react-table";
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
import {
  Loader2,
  MoreHorizontal,
  MoreVertical,
  ArrowUpDown,
  CheckIcon,
  ArrowDownNarrowWide,
  EditIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { patchFeatured } from "@/convex/matchups";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

type MatchupWithPicks = Doc<"matchups"> & { picks: Doc<"picks">[] };

const LEAGUE_OPTIONS = [
  { value: "NFL", label: "NFL 🏈" },
  { value: "COLLEGE-FOOTBALL", label: "CFB 🏈" },
  { value: "MLB", label: "MLB ⚾" },
  { value: "NHL", label: "NHL ⛸️" },
  { value: "NBA", label: "NBA 🏀" },
  { value: "MBB", label: "MBB 🏀" },
  { value: "WBB", label: "WBB 🏀" },
  { value: "WNBA", label: "WNBA 🏀" },
  { value: "NBAS", label: "NBAS 🏀" },
  { value: "MLS", label: "MLS ⚽" },
  { value: "NWSL", label: "NWSL ⚽" },
  { value: "EPL", label: "EPL ⚽" },
  { value: "UFL", label: "UFL ⚽" },
  { value: "ARG", label: "ARG ⚽" },
  { value: "TUR", label: "TUR ⚽" },
  { value: "FRIENDLY", label: "FRIENDLY ⚽" },
  { value: "CSL", label: "CSL ⚽" },
  { value: "RPL", label: "RPL ⚽" },

  // Add other leagues as needed
];

const STATUS_OPTIONS = [
  { value: "STATUS_SCHEDULED", label: "🕑 Scheduled" },
  { value: "STATUS_IN_PROGRESS", label: "🏃‍♂️ In Progress" },
  { value: "STATUS_FIRST_HALF", label: "🏃‍♂️ First Half" },
  { value: "STATUS_SECOND_HALF", label: "🏃‍♂️ Second Half" },
  { value: "STATUS_HALFTIME", label: "🏃‍♂️ Halftime" },
  { value: "STATUS_FINAL", label: "🏆 Final" },
  { value: "STATUS_FULL_TIME", label: "🏆 Full Time" },
  { value: "STATUS_FULL_PEN", label: "🏆 Full Pen" },
  { value: "STATUS_POSTPONED", label: "🕑 Postponed" },
  { value: "STATUS_CANCELED", label: "🚫 Canceled" },
  { value: "STATUS_SUSPENDED", label: "🚫 Suspended" },
  { value: "STATUS_RAIN_DELAY", label: "🌧️ Rain Delay" },
  { value: "STATUS_DELAY", label: "🕒 Delay" },
  { value: "STATUS_DELAYED", label: "🕒 Delayed" },
  // Add other statuses as needed
];

export const AdminColumns: ColumnDef<MatchupWithPicks>[] = [
  {
    accessorKey: "_id",
    header: "Actions",
    cell: ({ row }) => {
      return <MatchupActions row={row} />;
    },
  },
  {
    accessorKey: "league",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8">
              League
              <ArrowDownNarrowWide className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => column.setFilterValue(undefined)}
              className="justify-between"
            >
              All Leagues
              {column.getFilterValue() === undefined && (
                <CheckIcon className="h-4 w-4" />
              )}
            </DropdownMenuItem>
            {LEAGUE_OPTIONS.map((league) => (
              <DropdownMenuItem
                key={league.value}
                onClick={() => column.setFilterValue(league.value)}
                className="justify-between"
              >
                {league.label}
                {column.getFilterValue() === league.value && (
                  <CheckIcon className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const league = row.getValue("league") as string;
      return (
        <div className="flex flex-col items-center justify-center">
          <Image
            src={leagueLogos[league] || ""}
            alt={league}
            height={40}
            width={40}
            className="object-fill"
          />
          <p className="text-xs text-muted-foreground">
            {league === "COLLEGE-FOOTBALL" ? "CFB" : league}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <p className="text-balance">{row.original.title}</p>;
    },
  },

  {
    accessorKey: "active",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8">
              Active
              <ArrowDownNarrowWide className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => column.setFilterValue(undefined)}
              className="justify-between"
            >
              All
              {column.getFilterValue() === undefined && (
                <CheckIcon className="h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue(true)}
              className="justify-between"
            >
              Active Only
              {column.getFilterValue() === true && (
                <CheckIcon className="h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => column.setFilterValue(false)}
              className="justify-between"
            >
              Inactive Only
              {column.getFilterValue() === false && (
                <CheckIcon className="h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => column.setFilterValue("featured")}
              className="justify-between"
            >
              ChainBuilder Only
              {column.getFilterValue() === "featured" && (
                <CheckIcon className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: (row, id, filterValue) => {
      if (filterValue === "featured") {
        return (
          row.original.featured && row.original.featuredType === "CHAINBUILDER"
        );
      }
      return true;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <Badge variant={row.original.active ? "secondary" : "destructive"}>
            {row.original.active ? "Active" : "Inactive"}
          </Badge>
          {row.original.featured &&
            row.original.featuredType === "CHAINBUILDER" && (
              <Badge variant={"default"}>ChainBuilder</Badge>
            )}
          {row.original.featured &&
            row.original.featuredType === "SPONSORED" && (
              <Badge variant={"default"} className="bg-pink-400">
                Sponsored
              </Badge>
            )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8">
              Status
              <ArrowDownNarrowWide className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => column.setFilterValue(undefined)}
              className="justify-between"
            >
              All Statuses
              {column.getFilterValue() === undefined && (
                <CheckIcon className="h-4 w-4" />
              )}
            </DropdownMenuItem>
            {STATUS_OPTIONS.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => column.setFilterValue(status.value)}
                className="justify-between"
              >
                {status.label}
                {column.getFilterValue() === status.value && (
                  <CheckIcon className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusBadge = (status: string) => {
        switch (status) {
          case "STATUS_IN_PROGRESS":
          case "STATUS_HALFTIME":
          case "STATUS_FIRST_HALF":
          case "STATUS_SECOND_HALF":
          case "STATUS_END_PERIOD":
          case "STATUS_SHOOTOUT":
          case "STATUS_END_OF_EXTRATIME":
            return <Badge className="bg-primary">In Progress</Badge>;
          case "STATUS_POSTPONED":
          case "STATUS_CANCELED":
          case "STATUS_SUSPENDED":
          case "STATUS_RAIN_DELAY":
          case "STATUS_DELAY":
          case "STATUS_DELAYED":
            return <Badge className="bg-yellow-600">{status}</Badge>;
          case "STATUS_FINAL":
          case "STATUS_FULL_TIME":
          case "STATUS_FULL_PEN":
          case "STATUS_FINAL_PEN":
            return <Badge className="bg-red-500 ">FINAL</Badge>;
          case "STATUS_SCHEDULED":
            return <Badge className="bg-teal-400">SCHEDULED</Badge>;
          default:
            return <Badge variant="outline">{status}</Badge>;
        }
      };
      return getStatusBadge(status);
    },
  },
  {
    accessorKey: "picks",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Picks
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <p className="text-balance">{row.original.type}</p>;
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
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
        );
      } else {
        return (
          row.original.status !== "STATUS_SCHEDULED" && (
            <div className="flex flex-row items-center text-center justify-center">
              <p>{row.original.awayTeam.score}</p>
              <p>-</p>
              <p>{row.original.homeTeam.score}</p>
            </div>
          )
        );
      }
    },
  },
];

const MatchupActions: React.FC<{ row: Row<MatchupWithPicks> }> = ({ row }) => {
  const mutateActive = useMutation(api.matchups.patchActive);
  const mutateChainBuilder = useMutation(api.matchups.patchFeatured);
  const [loading, setLoading] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    try {
      await mutateActive({
        active: !row.original.active,
        matchupId: row.original._id,
      });
    } catch (error) {
      toast.error("Error updating active status");
    } finally {
      setLoading(false);
    }
  };

  const toggleChainBuilder = async () => {
    setLoading(true);
    try {
      await mutateChainBuilder({
        featured: !(
          row.original.featured && row.original.featuredType === "CHAINBUILDER"
        ),
        matchupId: row.original._id,
        featuredType: "CHAINBUILDER",
      });
    } catch (error) {
      toast.error("Error updating ChainBuilder status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" disabled={loading}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Actions
          </DropdownMenuLabel>
          {row.original.status === "STATUS_SCHEDULED" && (
            <DropdownMenuItem
              onClick={toggleActive}
              className="hover:cursor-pointer"
              disabled={loading}
            >
              {row.original.active ? (
                <span className="text-destructive">Set Inactive</span>
              ) : (
                <span className="text-green-500">Set Active</span>
              )}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={toggleChainBuilder}
            disabled={loading}
          >
            {row.original.featured &&
            row.original.featuredType === "CHAINBUILDER" ? (
              <span className="text-destructive">Remove 🖇️ChainBuilder</span>
            ) : (
              <span className="text-green-500">Set 🖇️ChainBuilder</span>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={loading}>
            <Link href={`/admin/matchups/${row.original._id}`}>
              Edit Matchup
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
