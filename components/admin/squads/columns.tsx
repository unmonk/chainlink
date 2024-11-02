import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";

import { Doc } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Users2Icon, MedalIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BoltIcon } from "lucide-react";

export const columns: ColumnDef<Doc<"squads">>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original._id)}
            >
              Copy Squad ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.name)}
            >
              Copy Squad Name
            </DropdownMenuItem>
            <Link href={`/admin/squads/${row.original._id}`}>
              <DropdownMenuItem>Edit Squad</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={`/admin/squads/${row.original.name}`}>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.image} alt={row.original.name} />
              <AvatarFallback>{row.original.name[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{row.original.name}</span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "members",
    header: "Stats",
    cell: ({ row }) => {
      const memberCount = (row.getValue("members") as Doc<"users">[]).length;
      return (
        <div className="flex flex-col gap-1">
          <Badge variant="outline">
            <MedalIcon className="h-4 w-4" /> {row.original.rank}
          </Badge>
          <Badge variant="outline">
            <Users2Icon className="h-4 w-4" /> {memberCount}
          </Badge>
          <Badge variant="outline">
            <BoltIcon className="h-4 w-4" /> {row.original.score}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "_creationTime",
    header: "Created",
    cell: ({ row }) => {
      return new Date(row.getValue("_creationTime")).toLocaleDateString();
    },
  },
];
