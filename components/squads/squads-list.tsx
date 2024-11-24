"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";
import UserCounter from "../ui/user-counter";

interface SquadsListProps {
  limit?: number;
}

export function SquadsList({ limit = 5 }: SquadsListProps) {
  const squads = useQuery(api.squads.getMostRecentSquads, { limit });
  const squadsByScore = useQuery(api.squads.getSquadsByScore, { limit });

  if (!squads) {
    return <SquadsListSkeleton />;
  }
  if (!squadsByScore) {
    return <SquadsListSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 mt-2 items-center">
      <div className="flex flex-col gap-4 mt-1">
        <h2 className="text-xl text-center font-semibold">Top Squads</h2>

        {/* Show ScrollArea only on md and above */}
        <div className="hidden md:block">
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-4 p-4">
              {squadsByScore.map((squad) => (
                <SquadCard key={squad._id} squad={squad} type="top" />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Show vertical stack on smaller screens */}
        <div className="flex flex-col gap-4 md:hidden px-4">
          {squadsByScore.map((squad) => (
            <SquadCard key={squad._id} squad={squad} type="top" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-1">
        <h2 className="text-xl text-center font-semibold">Recent Squads</h2>
        {/* Show ScrollArea only on md and above */}
        <div className="hidden md:block">
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-4 p-4">
              {squads.map((squad) => (
                <SquadCard key={squad._id} squad={squad} type="recent" />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Show vertical stack on smaller screens */}
        <div className="flex flex-col gap-4 md:hidden px-4">
          {squads.map((squad) => (
            <SquadCard key={squad._id} squad={squad} type="recent" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SquadCard({
  squad,
  type,
}: {
  squad: Doc<"squads">;
  type: "recent" | "top";
}) {
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-balance line-clamp-2 min-h-[40px]">
            {squad.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          {type === "recent" && (
            <span className="text-sm text-muted-foreground text-balance">
              {formatDistanceToNow(new Date(squad._creationTime), {
                addSuffix: true,
              })}
            </span>
          )}
          {type === "top" && (
            <span className="text-sm text-muted-foreground">
              Level: <span className="font-bold">{squad.rank}</span> • XP:{" "}
              <span className="font-bold">{squad.score}</span>
            </span>
          )}
          <div className="flex justify-end">
            <UserCounter value={squad.members.length} />
          </div>
        </CardFooter>
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
