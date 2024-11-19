"use client";

import { ContentLayout } from "@/components/nav/content-layout";
import { DataTable } from "@/components/admin/shop/data-table";
import { columns } from "@/components/admin/shop/columns";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ShopItemDialog } from "@/components/admin/shop/shop-item-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopAdminPage() {
  const items = useQuery(api.shop.getAllItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!items) {
    return (
      <ContentLayout title="Shop Management">
        <div className="space-y-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Shop Management">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Shop Items</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <DataTable columns={columns} data={items} />

        <ShopItemDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </ContentLayout>
  );
}
