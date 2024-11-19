"use client";

import { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting()}
      className="-ml-4"
    >
      {title}
      {{
        asc: <ArrowUpIcon className="ml-2 h-4 w-4" />,
        desc: <ArrowDownIcon className="ml-2 h-4 w-4" />,
      }[column.getIsSorted() as string] ?? (
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
