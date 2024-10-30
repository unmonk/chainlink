"use client";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ThumbsDownIcon, Trophy, User, Users2Icon } from "lucide-react";
import { LinkIcon } from "lucide-react";
import { RiP2PLine } from "react-icons/ri";
import { Card, CardContent } from "../ui/card";
import { api } from "@/convex/_generated/api";
import { clerkClient } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "convex/react";
import SquadMembers from "./squad-members";
import Loading from "../ui/loading";
import { CopyButton } from "../ui/copy-button";

export default function SquadPageContent({ squad }: { squad: Doc<"squads"> }) {
  // Add a default empty array if members is undefined
  const memberIds = squad.members?.map((member) => member.userId) ?? [];

  const users = useQuery(api.users.queryByUserIds, {
    userIds: memberIds,
  });

  if (!users) return <Loading />;
  console.log(users, "users");

  //loop through users and add squadInfo to each user
  const mergedUsers = users.map((user) => {
    return {
      ...user,
      squadInfo: squad.members?.find((member) => member.userId === user?._id),
    };
  });

  console.log(mergedUsers, "merged users");

  // Update stats to handle potentially undefined members
  const stats = [
    {
      title: "Links",
      value: squad.stats.coins || 0,
      icon: LinkIcon,
      description: "Total links",
      href: false,
    },
    {
      title: "Wins",
      value: squad.stats.wins || 0,
      icon: Trophy,
      description: "Total wins",
      href: false,
    },
    {
      title: "Members",
      value: squad.members?.length ?? 0, // Add null check here
      icon: Users2Icon,
      description: "Total members",
      href: false,
    },
    {
      title: "Losses",
      value: squad.stats.losses || 0,
      icon: ThumbsDownIcon,
      description: "Total losses",
      href: false,
    },
  ];

  const url = `https://chainlink.st/squads/${squad.slug}`;
  return (
    <Suspense fallback={<SquadSkeleton />}>
      {/* Header Section with Centered Content */}
      <div className="flex flex-col items-center text-center my-8">
        <Image
          src={squad.image}
          alt={squad.name}
          width={150}
          height={150}
          className="h-24 w-24 rounded-full object-cover mb-4"
        />
        <div>
          <h1 className="text-4xl font-bold mb-2">{squad.name}</h1>
          <p className="text-muted-foreground max-w-2xl">{squad.description}</p>
          <p className="text-muted-foreground text-xs flex items-center justify-center">
            <span className="mr-2 px-2 py-1 bg-background/40 rounded-md">
              {url}
            </span>
            <CopyButton value={url} />
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-3">
              <div className="flex items-center gap-x-2">
                <stat.icon className="h-8 w-8 text-muted-foreground" />
                <span className=" font-medium">{stat.title}</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Members Section */}
      <div className="my-8">
        <h2 className="text-2xl text-center font-semibold">Members</h2>
        <p className="text-muted-foreground text-center mb-4 text-xs">
          Score is calculated based on the number of wins and links contributed
          since joining the squad
        </p>

        {/* @ts-ignore */}

        <SquadMembers members={mergedUsers} />
      </div>
    </Suspense>
  );
}

export function SquadSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Skeleton className="col-span-2 h-[400px]" />
        <Skeleton className="col-span-1 h-[400px]" />
      </div>
    </div>
  );
}
