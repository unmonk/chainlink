"use client";
import React, { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ThumbsDownIcon, Trophy, User, Users2Icon } from "lucide-react";
import { LinkIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { api } from "@/convex/_generated/api";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import SquadMembers from "./squad-members";
import Loading from "../ui/loading";
import { CopyButton } from "../ui/copy-button";
import AnimatedGridPattern from "../ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogContent } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function EditSquadButton({
  ownerId,
  squadSlug,
}: {
  ownerId: Id<"users">;
  squadSlug: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useQuery(api.users.currentUser);
  const isOwner = ownerId === user?._id;

  if (!isOwner) return null;

  return (
    <Link href={`/squads/${squadSlug}/edit`} prefetch={false}>
      <Button variant="outline" size="sm">
        Edit Squad
      </Button>
    </Link>
  );
}

export default function SquadPageContent({ squad }: { squad: Doc<"squads"> }) {
  const currentUser = useUser();
  // Add a default empty array if members is undefined
  const memberIds = squad.members?.map((member) => member.userId) ?? [];
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const users = useQuery(api.users.queryByUserIds, {
    userIds: memberIds,
  });

  const joinSquad = useMutation(api.squads.joinSquad);
  const leaveSquad = useMutation(api.squads.leaveSquad);

  if (!users) return <Loading />;

  //loop through users and add squadInfo to each user
  const mergedUsers = users.map((user) => {
    return {
      ...user,
      squadInfo: squad.members?.find((member) => member.userId === user?._id),
    };
  });

  const isUserInSquad = mergedUsers.find(
    (user) => user.externalId === currentUser?.user?.id
  );

  const handleJoinSquad = async () => {
    setLoading(true);
    const result = await joinSquad({ squadId: squad._id });

    if ("error" in result) {
      // Show error to user (e.g., using toast)
      toast.error(result.error);
      setLoading(false);
      return;
    }

    // Success case
    toast.success("Successfully joined squad!");
    router.refresh();
    setLoading(false);
  };

  const handleLeaveSquad = async () => {
    setLoading(true);
    const result = await leaveSquad({ squadId: squad._id });

    if ("error" in result) {
      toast.error(result.error as string);
      setLoading(false);
      return;
    }

    toast.success("Successfully left squad!");
    router.refresh();
    setLoading(false);
  };

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
      description: "Members",
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
      {/* Header Section with Three Columns */}
      <div className="relative flex flex-col md:flex-row h-[620px] w-full items-center justify-between overflow-hidden rounded-lg border bg-background p-4 md:p-20 md:shadow-xl mb-4">
        {/* Left Number */}
        <div className="flex flex-col items-center justify-center w-1/4">
          {squad.rank && (
            <div className="text-4xl md:text-8xl font-bold bg-gradient-to-b from-[#88d681] to-[#257532] bg-clip-text text-transparent">
              {squad.rank}
            </div>
          )}
          {!squad.rank && (
            <span className="text-xs md:text-sm text-muted-foreground mt-2">
              Unranked
            </span>
          )}
          <span className="text-xs md:text-sm text-muted-foreground mt-2">
            RANK
          </span>
          <div className="md:hidden text-xl font-bold bg-gradient-to-b from-[#88d681] to-[#257532] bg-clip-text text-transparent">
            {squad.score}
          </div>
          <span className="md:hidden text-xs md:text-sm text-muted-foreground">
            SCORE
          </span>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center w-full md:w-2/4">
          <span className="pointer-events-none  whitespace-pre-wrap bg-gradient-to-b from-[#88d681] via-[#257532] to-[#000000] bg-clip-text text-center text-4xl md:text-7xl font-bold leading-none tracking-tighter text-transparent">
            {squad.name}
          </span>
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className={cn(
              "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
              "absolute inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            )}
          />

          <div className="flex flex-col items-center text-center my-8 relative z-10">
            <Image
              src={squad.image}
              alt={squad.name}
              width={150}
              height={150}
              className="h-24 w-24 rounded-full object-cover mb-4"
            />
            <div>
              <p className="text-muted-foreground max-w-2xl">
                {squad.description}
              </p>
              <p className="text-muted-foreground text-xs flex items-center justify-center mt-2">
                <span className="mr-2 px-2 py-1 bg-background/40 rounded-md">
                  {url}
                </span>
                <CopyButton value={url} />
              </p>
            </div>
          </div>
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-2">
                  <div className="flex items-center gap-x-2 text-center">
                    {/* <stat.icon className="hidden md:block h-8 w-8 text-muted-foreground" /> */}
                    <span className="text-sm font-medium text-center w-full">
                      {stat.title}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-col items-center justify-center">
                    <div className="text-xl font-bold bg-black/50 p-1 rounded-sm">
                      {stat.value}
                    </div>
                    <p className="text-xs text-nowrap text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Number */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/4">
          <div className="text-2xl md:text-4xl font-bold bg-gradient-to-b from-[#88d681] to-[#257532] bg-clip-text text-transparent">
            {squad.score || 0}
          </div>
          <span className="text-sm text-muted-foreground mt-2">
            SQUAD SCORE
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center mt-4">
        {squad.open && !isUserInSquad && (
          <Button
            onClick={handleJoinSquad}
            disabled={loading}
            className="bg-gradient-to-r from-[#88d681] to-[#257532] hover:opacity-90 transition-opacity"
            size={"sm"}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Joining</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Users2Icon className="h-4 w-4" />
                <span>Join Squad</span>
              </div>
            )}
          </Button>
        )}
      </div>

      {/* Members Section */}
      <div className="my-4">
        <h2 className="text-2xl text-center font-semibold">Members</h2>
        <p className="text-muted-foreground text-center mb-4 text-xs">
          Score is calculated based on the number of wins and links contributed
          since joining the squad
        </p>

        {/* @ts-ignore */}

        <SquadMembers members={mergedUsers} />
        <div className="flex items-center justify-center gap-2 mt-4">
          {isUserInSquad && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Leave Squad
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Leave Squad</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to leave this squad?.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLeaveSquad}
                    disabled={loading}
                  >
                    Leave Squad
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <EditSquadButton ownerId={squad.ownerId} squadSlug={squad.slug} />
        </div>
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
