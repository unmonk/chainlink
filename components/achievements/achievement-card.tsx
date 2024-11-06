"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { getImageUrl } from "@/convex/utils";
import { Badge } from "../ui/badge";

export default function AchievementCard({
  achievement,
}: {
  achievement: Doc<"achievements"> & {
    awardedAt: number;
    count: number;
    image: string;
  };
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={achievement.image}
              alt={achievement.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 flex flex-col min-h-[80px]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-balance">{achievement.name}</h3>
              <span className="text-sm text-muted-foreground capitalize text-pretty">
                {formatDistanceToNow(achievement.awardedAt, {
                  addSuffix: true,
                }).replace("about ", "")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-pretty">
              {achievement.description}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <p className="text-lg font-semibold mr-1 text-primary">
                  {achievement.count}
                </p>
                x
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
