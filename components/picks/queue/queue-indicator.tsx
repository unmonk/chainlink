"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Doc } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";

interface QueueSegmentProps {
  pick: Doc<"picks">;
  index: number;
}

function QueueSegment({ pick, index }: QueueSegmentProps) {
  if (!pick) {
    return (
      <Skeleton className="h-12 w-12 rounded-md border-2 border-muted-foreground/20 bg-muted" />
    );
  }

  const item = {
    hidden: { y: -20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <motion.div
            key={index}
            variants={item}
            className="h-14 w-14 rounded-md border-2 overflow-hidden relative hover:border-muted-foreground"
          >
            <Image
              src={pick.pick.image}
              alt={pick.pick.name}
              width={48}
              height={48}
              className={cn(
                "object-cover  hover:scale-110 transition-all duration-300 hover:opacity-100 opacity-80"
              )}
            />
            <p className="text-muted-foreground text-xs absolute bottom-0 right-0">
              00:29
            </p>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="text-xs">
            <p className="font-semibold">{pick.pick.name}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function QueueIndicator() {
  const queue = useQuery(api.pickqueue.getUserQueuedPicks);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  if (!queue?.pickQueue) {
    return (
      <Card className="fixed bottom-4 right-4 p-3 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-12 rounded-md" />
        ))}
      </Card>
    );
  }
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <Card className="fixed bottom-4 right-4 p-3 flex gap-2 z-60">
        {Array.from({ length: 3 }).map((_, i) => {
          const pick = queue.picks?.[i];
          return pick ? (
            <QueueSegment key={i} pick={pick} index={i} />
          ) : (
            <Skeleton
              key={i}
              className="h-12 w-12 rounded-md border-2 border-muted-foreground/20 bg-muted"
            />
          );
        })}
      </Card>
    </motion.div>
  );
}
