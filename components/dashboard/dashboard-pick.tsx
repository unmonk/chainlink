"use client";

import { useQuery } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { CircleArrowOutUpRightIcon } from "lucide-react";
import { RainbowButton } from "../ui/rainbow-button";
import MatchupCard from "../matchups/matchup-card";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const DashboardActivePick = () => {
  const pick = useQuery(api.picks.getUserActivePickWithMatchup, {});
  const router = useRouter();
  const goToPlay = () => router.push("/play");

  //Todo loading skeleton
  if (!pick)
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>My Pick</CardTitle>
          <CardDescription>No Active Pick</CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex flex-col items-center">
          <RainbowButton onClick={goToPlay} className="">
            <CircleArrowOutUpRightIcon
              size={16}
              className="mr-1 size-3 transition-transform duration-300 ease-in-out group-hover:-translate-x-0.5"
            />

            <SignedIn>
              <span>Make Pick</span>{" "}
            </SignedIn>
            <SignedOut>View Picks</SignedOut>
          </RainbowButton>
        </CardContent>
      </Card>
    );

  return (
    <MatchupCard
      matchup={pick.matchupWithPicks}
      activePick={pick.pick}
      userId={pick.pick.userId}
    />
  );
};

export default DashboardActivePick;
