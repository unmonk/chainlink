"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface SquadsListProps {
  limit?: number;
}

export function SquadsList({ limit = 10 }: SquadsListProps) {
  const squads = useQuery(api.squads.getMostRecentSquads, { limit });

  if (!squads) {
    return <SquadsListSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h2 className="text-xl text-center font-semibold">Recent Squads</h2>

      {/* Show ScrollArea only on md and above */}
      <div className="hidden md:block">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max space-x-4 p-4">
            {squads.map((squad) => (
              <SquadCard key={squad._id} squad={squad} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Show vertical stack on smaller screens */}
      <div className="flex flex-col gap-4 md:hidden px-4">
        {squads.map((squad) => (
          <SquadCard key={squad._id} squad={squad} />
        ))}
      </div>
    </div>
  );
}

function SquadCard({ squad }: { squad: any }) {
  return (
    <Link href={`/squads/${squad.slug}`}>
      <Card className="w-full md:w-[300px] md:shrink-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
          <Image
            src={squad.image || "/placeholder-squad.jpg"}
            alt={squad.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
            priority={false}
          />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="truncate">{squad.name}</span>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(squad._creationTime), {
                addSuffix: true,
              })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {squad.description}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm">Members: {squad.members.length}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function SquadsListSkeleton() {
  return (
    <div className="flex space-x-4 p-4 w-full overflow-x-auto">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="w-[300px] shrink-0">
          <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
          <CardHeader>
            <Skeleton className="h-6 w-[250px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[250px] mb-2" />
            <Skeleton className="h-4 w-[100px]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
