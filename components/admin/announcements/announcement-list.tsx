"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { DataTable } from "@/components/admin/announcements/announcement-datatable";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

const getAnnouncementColor = (type: string) => {
  switch (type) {
    case "NEWS":
      return "bg-blue-500/10 text-blue-500";
    case "MAINTENANCE":
      return "bg-yellow-500/10 text-yellow-500";
    case "FEATURE":
      return "bg-green-500/10 text-green-500";
    case "PROMOTION":
      return "bg-purple-500/10 text-purple-500";
    case "ALERT":
      return "bg-red-500/10 text-red-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

export default function AnnouncementList() {
  const announcements = useQuery(api.announcements.getAnnouncements);
  if (!announcements?.length) return null;

  return <DataTable columns={columns} data={announcements} />;
}

export type AnnouncementColumn = {
  _id: string;
  title: string;
  content: string;
  active: boolean;
  image?: string;
  link?: string;
  type: string;
  priority: number;
  expiresAt: number;
};

export const columns: ColumnDef<AnnouncementColumn>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link href={`/admin/announcements/${row.original._id}`}>
        <div>{row.original.title}</div>
      </Link>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge
        variant={"outline"}
        className={getAnnouncementColor(row.original.type)}
      >
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "active",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center">
        <Badge variant={row.original.active ? "default" : "outline"}>
          {row.original.active ? "Active" : "Inactive"}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <AnnouncementActions row={row} />;
    },
  },
];

const AnnouncementActions: React.FC<{ row: Row<AnnouncementColumn> }> = ({
  row,
}) => {
  const toggleActive = useMutation(api.announcements.toggleActive);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-sm text-muted-foreground">
          Actions
        </DropdownMenuLabel>
        <Link href={`/admin/announcements/${row.original._id}`}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={() =>
            toggleActive({
              id: row.original._id as Id<"announcements">,
              active: row.original.active,
            })
          }
        >
          {row.original.active ? "Set Inactive" : "Set Active"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
