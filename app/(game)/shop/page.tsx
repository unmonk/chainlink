"use client";

import ReactConfetti from "react-confetti";
import { useState, useEffect } from "react";
import { ContentLayout } from "@/components/nav/content-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, COSMETIC_STYLE, COSMETIC_STYLES } from "@/lib/utils";
import { ShopHeader } from "@/components/shop/shop-header";
import { ShopItemCard } from "@/components/shop/shop-item-card";

export default function Page() {
  const [showConfetti, setShowConfetti] = useState(false);

  const user = useQuery(api.users.currentUser);
  const shopItems = useQuery(api.shop.getShopItems);
  const purchase = useMutation(api.shop.createPurchase);
  const userPurchases = useQuery(api.shop.getPurchases, {
    userId: user?._id,
  });

  const handlePurchase = async (itemId: Id<"shopItems">) => {
    if (!user) return;

    try {
      await purchase({ itemId });
      setShowConfetti(true);
      toast.success("Item purchased successfully!");
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      toast.error("Failed to purchase item");
    }
  };

  const userBackgrounds =
    user?.metadata?.avatarBackgrounds ?? ([] as Id<"shopItems">[]);
  const isItemPurchased = (itemId: Id<"shopItems">) => {
    if (!userPurchases || !user) return false;
    return userPurchases.some((purchase) => purchase.itemId === itemId);
  };

  if (!shopItems) {
    return (
      <ContentLayout title="Link Shop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardHeader>
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="aspect-square rounded-md" />
                <Skeleton className="h-4 w-[200px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Link Shop">
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <div className="space-y-8">
        <ShopHeader coins={user?.coins ?? 0} />

        <div className="relative">
          <div className="absolute inset-x-0 -top-40 -bottom-40 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />

          <h2 className="text-2xl font-bold text-center mb-8">Avatar Flair</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopItems
              .filter((item) => item.type === "BACKGROUND")
              .map((item) => (
                <ShopItemCard
                  key={item._id}
                  item={item}
                  user={user ?? null}
                  isItemPurchased={isItemPurchased(item._id)}
                  onPurchase={handlePurchase}
                  userBackgrounds={userBackgrounds}
                />
              ))}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
