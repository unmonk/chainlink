"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { QueueIndicator } from "./queue-indicator";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { X } from "lucide-react";
import { useMutation } from "convex/react";

export function QueueDetails() {
  const queue = useQuery(api.pickqueue.getUserQueuedPicks);
  const removeFromQueue = useMutation(api.pickqueue.removePickFromQueue);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="fixed bottom-4 right-4">
          <QueueIndicator />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Pick Queue</SheetTitle>
          <SheetDescription>
            Your upcoming picks will be activated automatically
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {queue?.picks?.map((queuedPick, index) => (
            <div
              key={queuedPick?._id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-md overflow-hidden">
                  <Image
                    src={queuedPick?.pick?.image ?? ""}
                    alt={queuedPick?.pick?.name ?? "Queue Pick"}
                    fill
                    className="object-cover "
                  />
                </div>
                <div>
                  <p className="font-semibold">{queuedPick?.pick?.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log(queuedPick)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(!queue || queue.picks?.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              No picks in queue
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
