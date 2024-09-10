"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { streakColor, streakLetter } from "../chains/user-chain";
import { BackgroundGradient } from "../ui/background-gradient";

export const LeaderboardList = () => {
  const leaderboardData = useQuery(api.leaderboards.getChainLeaderboard, {});
  if (!leaderboardData) return null;
  leaderboardData.sort((a, b) => b.chain.chain - a.chain.chain);
  const leaderboardList = leaderboardData.slice(3, leaderboardData.length);
  return (
    <div className="flex flex-col items-center">
      <Tabs defaultValue="chain" className="w-full text-center">
        <TabsList>
          <TabsTrigger value="chain">Chain</TabsTrigger>
          <TabsTrigger value="wins">Wins</TabsTrigger>
        </TabsList>
        <TabsContent value="chain">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-6">
              {leaderboardData[0] && (
                <BackgroundGradient
                  key={leaderboardData[0].user._id}
                  animate={true}
                  className="rounded-lg overflow-hidden shadow-lg"
                >
                  <Card
                    key={leaderboardData[0].user?._id}
                    className="flex flex-col items-center gap-2 p-4"
                  >
                    <Avatar>
                      <AvatarImage
                        src={leaderboardData[0].user?.image}
                        alt={leaderboardData[0].user?.name}
                      />
                      <AvatarFallback>
                        {leaderboardData[0].user?.name}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">
                      {leaderboardData[0].user?.name}
                    </h3>
                    <h2>
                      Current Chain:{" "}
                      <span
                        className={streakColor(leaderboardData[0].chain.chain)}
                      >
                        {streakLetter(leaderboardData[0].chain.chain)}
                        {leaderboardData[0].chain.chain}
                      </span>
                    </h2>
                    <p className="text-xl font-bold">Leader</p>
                  </Card>
                </BackgroundGradient>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {leaderboardData[1] && (
                <Card
                  key={leaderboardData[1].user?._id}
                  className="flex flex-col items-center gap-1 p-2"
                >
                  <Avatar>
                    <AvatarImage
                      src={leaderboardData[1].user?.image}
                      alt={leaderboardData[1].user?.name}
                    />
                    <AvatarFallback>
                      {leaderboardData[1].user?.name}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">
                    {leaderboardData[1].user?.name}
                  </h3>
                  <h2>
                    Current Chain:{" "}
                    <span
                      className={streakColor(leaderboardData[1].chain.chain)}
                    >
                      {streakLetter(leaderboardData[1].chain.chain)}
                      {leaderboardData[1].chain.chain}
                    </span>
                  </h2>
                  <p className="text-xl font-bold">2nd</p>
                </Card>
              )}
              {leaderboardData[2] && (
                <Card
                  key={leaderboardData[2].user?._id}
                  className="flex flex-col items-center gap-1 p-2"
                >
                  <Avatar>
                    <AvatarImage
                      src={leaderboardData[2].user?.image}
                      alt={leaderboardData[2].user?.name}
                    />
                    <AvatarFallback>
                      {leaderboardData[2].user?.name}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">
                    {leaderboardData[2].user?.name}
                  </h3>
                  <h2>
                    Current Chain:{" "}
                    <span
                      className={streakColor(leaderboardData[2].chain.chain)}
                    >
                      {streakLetter(leaderboardData[2].chain.chain)}
                      {leaderboardData[2].chain.chain}
                    </span>
                  </h2>
                  <p className="text-xl font-bold">3rd</p>
                </Card>
              )}
            </div>
            <Card className="">
              {leaderboardList &&
                leaderboardList.map((leaderboard) => (
                  <div
                    className="flex items-center gap-4 p-2"
                    key={leaderboard.user?._id}
                  >
                    <p className="text-xl font-bold">{leaderboard.rank}</p>

                    <p>{leaderboard.user?.name}</p>
                    <h2>
                      <span
                        className={streakColor(leaderboardData[2].chain.chain)}
                      >
                        {streakLetter(leaderboardData[2].chain.chain)}
                        {leaderboardData[2].chain.chain}
                      </span>
                    </h2>
                  </div>
                ))}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="wins">
          <div className="grid grid-cols-1 gap-6">
            {leaderboardData
              .sort((a, b) => b.chain.wins - a.chain.wins)
              .map((leaderboard) => (
                <Card key={leaderboard.user?._id}>
                  <h2>{leaderboard.chain.wins}</h2>
                  <p>{leaderboard.user?.name}</p>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
