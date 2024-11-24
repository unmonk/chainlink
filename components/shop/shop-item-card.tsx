import { Doc } from "@/convex/_generated/dataModel";

import { Id } from "@/convex/_generated/dataModel";

import { COSMETIC_STYLE } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";

interface ShopItemCardProps {
  item: Doc<"shopItems">;
  user: Doc<"users"> | null;
  isItemPurchased: boolean;
  onPurchase: (itemId: Id<"shopItems">) => void;
  userBackgrounds: string[];
}

export function ShopItemCard({
  item,
  user,
  isItemPurchased,
  onPurchase,
  userBackgrounds,
}: ShopItemCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden backdrop-blur-sm bg-card/50 border-primary/20",
        "hover:border-primary/40 transition-colors",
        isItemPurchased && "opacity-50"
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
              cosmetic={item.metadata?.avatarBackground as COSMETIC_STYLE}
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
              onClick={() => onPurchase(item._id)}
              disabled={
                isItemPurchased || !user || (user.coins ?? 0) < item.price
              }
              className="px-6 hover:scale-105 transition-transform"
            >
              {isItemPurchased && (
                <span className="flex items-center gap-1">
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Owned
                </span>
              )}
              {!isItemPurchased && "Purchase"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
