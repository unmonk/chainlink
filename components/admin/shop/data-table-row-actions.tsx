"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Doc } from "@/convex/_generated/dataModel";
import { useCallback } from "react";

interface DataTableRowActionsProps {
  row: Row<Doc<"shopItems">>;
  onEdit: (item: Doc<"shopItems">) => void;
}

export function DataTableRowActions({ row, onEdit }: DataTableRowActionsProps) {
  const handleEdit = useCallback(() => {
    onEdit(row.original);
  }, [row.original, onEdit]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(row.original._id)}
        >
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
