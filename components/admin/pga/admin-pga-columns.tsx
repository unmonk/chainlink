"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "@/convex/_generated/dataModel";

export type PgaMatchupWithPlayers = Doc<"pgaMatchups"> & {
  golferA: Doc<"pgaPlayers"> | null;
  golferB: Doc<"pgaPlayers"> | null;
};

export const AdminPgaColumns: ColumnDef<PgaMatchupWithPlayers>[] = [
  {
    accessorKey: "golferA.name",
    header: "Golfer A",
  },
  {
    accessorKey: "golferB.name",
    header: "Golfer B",
  },
  {
    accessorKey: "holes",
    header: "Holes",
  },
  {
    accessorKey: "thru",
    header: "Thru",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      const date = new Date(row.original.startTime);
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
