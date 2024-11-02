"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChainLeaderboard } from "./tabs/chain-leaderboard";
import { WinsLeaderboard } from "./tabs/wins-leaderboard";
import { AllTimeLeaderboard } from "./tabs/alltime-leaderboard";
import { LinksLeaderboard } from "./tabs/links-leaderboard";

export const LeaderboardList = () => {
  const leaderboardData = useQuery(api.leaderboards.getChainLeaderboard, {});
  if (!leaderboardData) return null;

  return (
    <div className="flex flex-col items-center">
      <Tabs defaultValue="chain" className="w-full text-center">
        <TabsList>
          <TabsTrigger value="chain">Chain</TabsTrigger>
          <TabsTrigger value="wins">Wins</TabsTrigger>
          <TabsTrigger value="alltime">All-Time</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="chain">
          <ChainLeaderboard data={leaderboardData} />
        </TabsContent>

        <TabsContent value="wins">
          <WinsLeaderboard data={leaderboardData} />
        </TabsContent>

        <TabsContent value="alltime">
          <AllTimeLeaderboard data={leaderboardData} />
        </TabsContent>

        <TabsContent value="links">
          <LinksLeaderboard data={leaderboardData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
