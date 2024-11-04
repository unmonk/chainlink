import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function MatchupSkeleton() {
  return (
    <Card className="rounded-t-none flex flex-col h-full">
      {/* Header */}
      <div className="bg-secondary">
        <div className="grid grid-cols-2 p-1.5">
          <Skeleton className="h-4 w-16" /> {/* League */}
          <Skeleton className="h-4 w-24 ml-auto" /> {/* Time/Status */}
        </div>
      </div>

      {/* Title */}
      <div className="px-1 pt-2 min-h-12">
        <Skeleton className="h-6 w-3/4" />
      </div>

      {/* Teams and Buttons */}
      <div className="flex flex-col">
        <div className="grid grid-cols-3 items-center text-center py-2">
          <Skeleton className="h-4 w-20 mx-auto" /> {/* Away team */}
          <Skeleton className="h-4 w-8 mx-auto" /> {/* VS */}
          <Skeleton className="h-4 w-20 mx-auto" /> {/* Home team */}
        </div>

        <div className="grid grid-cols-6 items-center text-center py-1">
          <div className="col-span-2">
            <Skeleton className="h-12 w-12 rounded mx-auto" />
          </div>
          <div className="col-span-2">
            <div className="flex gap-2 justify-center">
              <Skeleton className="h-2 w-16" /> {/* Progress bars */}
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
          <div className="col-span-2">
            <Skeleton className="h-12 w-12 rounded mx-auto" />
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-3 items-center text-center p-2 min-h-12 mt-auto bg-background/20 border-t border-border">
          <Skeleton className="h-4 w-16 mx-auto" />
          <Skeleton className="h-4 w-20 mx-auto" />
          <Skeleton className="h-4 w-16 mx-auto" />
        </div>
      </div>
    </Card>
  );
}
