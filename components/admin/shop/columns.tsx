"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/admin/shop/data-table-header";
import { DataTableRowActions } from "@/components/admin/shop/data-table-row-actions";
import { Doc } from "@/convex/_generated/dataModel";

interface CreateColumnsProps {
  onEdit: (item: Doc<"shopItems">) => void;
}

export function createColumns({
  onEdit,
}: CreateColumnsProps): ColumnDef<Doc<"shopItems">>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("type")}</Badge>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span>🔗</span>
          {new Intl.NumberFormat().format(row.getValue("price"))}
        </div>
      ),
    },
    {
      accessorKey: "active",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.getValue("active") ? "default" : "secondary"}>
          {row.getValue("active") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "featured",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Featured" />
      ),
      cell: ({ row }) => (
        <Badge variant={row.getValue("featured") ? "default" : "secondary"}>
          {row.getValue("featured") ? "Featured" : "Standard"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} />,
    },
  ];
}
