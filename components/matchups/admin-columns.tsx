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
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { patchFeatured } from "@/convex/matchups";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { EditMatchupForm } from "./edit-matchup";

type MatchupWithPicks = Doc<"matchups"> & { picks: Doc<"picks">[] };

export const AdminColumns: ColumnDef<MatchupWithPicks>[] = [
  {
    id: "edit",
    cell: ({ row }) => {
      return (
        <EditMatchupForm
          row={row.original}
          totalPicks={row.original.picks.length}
        />
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
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
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
      return <ActiveSelect row={row} />;
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
            return <Badge className="bg-yellow-600">{status}</Badge>;
          case "STATUS_FINAL":
          case "STATUS_FULL_TIME":
          case "STATUS_FULL_PEN":
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
      return <ChainBuilderSelect row={row} />;
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

const ChainBuilderSelect: React.FC<{ row: Row<MatchupWithPicks> }> = ({
  row,
}) => {
  const mutateChainBuilder = useMutation(api.matchups.patchFeatured);

  const onChainBuilderValueChange = async (
    value: string,
    row: Row<MatchupWithPicks>
  ) => {
    if (value === "enabled") {
      await mutateChainBuilder({
        featured: true,
        matchupId: row.original._id,
        featuredType: "CHAINBUILDER",
      });
    }
    if (value === "disabled") {
      await mutateChainBuilder({
        featured: false,
        matchupId: row.original._id,
        featuredType: "CHAINBUILDER",
      });
    }
  };

  return (
    <Select
      onValueChange={(value) => {
        onChainBuilderValueChange(value, row);
      }}
      disabled={
        row.original.status === "STATUS_FINAL" ||
        row.original.status === "STATUS_FULL_TIME"
      }
    >
      <SelectTrigger
        className={
          row.original.featured && row.original.featuredType === "CHAINBUILDER"
            ? "border-green-500 border-2"
            : ""
        }
      >
        <SelectValue
          placeholder={
            row.original.featured &&
            row.original.featuredType === "CHAINBUILDER"
              ? "Enabled"
              : "Disabled"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="enabled">Enabled</SelectItem>
        <SelectItem value="disabled">Disabled</SelectItem>
      </SelectContent>
    </Select>
  );
};

const ActiveSelect: React.FC<{ row: Row<MatchupWithPicks> }> = ({ row }) => {
  const mutateActive = useMutation(api.matchups.patchActive);

  const onActiveSelectChange = async (
    value: string,
    row: Row<MatchupWithPicks>
  ) => {
    if (value === "active") {
      await mutateActive({
        active: true,
        matchupId: row.original._id,
      });
    }
    if (value === "inactive") {
      await mutateActive({
        active: false,
        matchupId: row.original._id,
      });
    }
  };

  return (
    <Select
      onValueChange={(value) => {
        onActiveSelectChange(value, row);
      }}
      disabled={
        row.original.status === "STATUS_FINAL" ||
        row.original.status === "STATUS_FULL_TIME"
      }
    >
      <SelectTrigger
        className={row.original.active ? "" : "border-red-500 border-2"}
      >
        <SelectValue
          placeholder={row.original.active ? "Active" : "Inactive"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  );
};

const MatchupActions: React.FC<{ row: Row<MatchupWithPicks> }> = ({ row }) => {
  const mutateActive = useMutation(api.matchups.patchActive);
  const toggleActive = async () => {
    await mutateActive({
      active: !row.original.active,
      matchupId: row.original._id,
    });
  };

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
            <DropdownMenuItem onClick={() => console.log("Copy payment ID")}>
              Complete Matchup
            </DropdownMenuItem>
          )}
        {row.original.status === "STATUS_SCHEDULED" && (
          <DropdownMenuItem onClick={toggleActive}>
            {row.original.active ? "Set Inactive" : "Set Active"}
          </DropdownMenuItem>
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
};
