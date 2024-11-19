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

      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      toast.error("Failed to purchase item");
    }
  };

  const userBackgrounds = user?.metadata?.avatarBackgrounds ?? [];
  const isItemPurchased = (itemId: Id<"shopItems">) => {
    if (!userPurchases || !user) {
      return false;
    }

    // Check if item is in user's purchases
    if (userPurchases.some((purchase) => purchase.itemId === itemId)) {
      return true;
    }

    return false;
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
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Link Shop</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="text-cyan-500 flex items-center gap-1">
              <span>🔗</span>
              <span className="font-bold">
                {new Intl.NumberFormat().format(user?.coins ?? 0)}
              </span>
            </span>
            <Badge variant="secondary">Available Links</Badge>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 -top-40 -bottom-40 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />

          <h2 className="text-2xl font-bold text-center mb-8">
            Avatar Borders
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopItems
              .filter((item) => item.type === "BACKGROUND")
              .map((item) => {
                const isBackground = item.type === "BACKGROUND";
                return (
                  <Card
                    key={item._id}
                    className={cn(
                      "relative overflow-hidden backdrop-blur-sm bg-card/50 border-primary/20",
                      "hover:border-primary/40 transition-colors",
                      isItemPurchased(item._id) && "opacity-50"
                    )}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-center">
                        {item.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex justify-center">
                        {item.type === "BACKGROUND" && (
                          <Avatar
                            height="h-32"
                            width="w-32"
                            hasGlow={true}
                            cosmetic={
                              item.metadata?.avatarBackground as COSMETIC_STYLE
                            }
                            className="hover:scale-105 transition-transform"
                          >
                            <AvatarImage src={user?.image} />
                            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-cyan-500">🔗</span>
                          <span className="font-bold text-cyan-500 text-lg">
                            {new Intl.NumberFormat().format(item.price)}
                          </span>
                        </div>
                        {userBackgrounds.includes(item._id) ? (
                          <Badge variant="secondary" className="px-4 py-1">
                            Owned
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handlePurchase(item._id)}
                            disabled={
                              isItemPurchased(item._id) ||
                              !user ||
                              (user.coins ?? 0) < item.price
                            }
                            className="px-6 hover:scale-105 transition-transform"
                          >
                            {isItemPurchased(item._id) ? "Owned" : "Purchase"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
