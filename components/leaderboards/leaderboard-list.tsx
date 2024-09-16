"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { streakColor, streakLetter } from "../chains/user-chain";
import { BackgroundGradient } from "../ui/background-gradient";
import { Separator } from "../ui/separator";
import Link from "next/link";

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
            <h2 className="text-2xl font-bold">Current Campaign (Monthly)</h2>
            <div className="grid grid-cols-1 gap-6">
              {leaderboardData[0] && (
                <BackgroundGradient
                  key={leaderboardData[0].user?._id}
                  animate={true}
                  className="rounded-lg overflow-hidden shadow-lg"
                >
                  <Link href={`/u/${leaderboardData[0].user?.name}`} passHref>
                    <Card
                      key={leaderboardData[0].user?._id}
                      className="flex flex-col items-center gap-2 p-4"
                    >
                      <Avatar className="w-20 h-20">
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
                      <div className="flex flex-row gap-2 items-center justify-center ">
                        Current Chain:{" "}
                        <h2 className="text-xl font-bold">
                          <span
                            className={streakColor(
                              leaderboardData[0].chain.chain
                            )}
                          >
                            {streakLetter(leaderboardData[0].chain.chain)}
                            {Math.abs(leaderboardData[0].chain.chain)}
                          </span>
                        </h2>
                      </div>
                      <p className="text-xl font-bold">Leader</p>
                    </Card>
                  </Link>
                </BackgroundGradient>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {leaderboardData[1] && (
                <Link href={`/u/${leaderboardData[1].user?.name}`} passHref>
                  <Card
                    key={leaderboardData[1].user?._id}
                    className="flex flex-col items-center gap-1 p-2"
                  >
                    <Avatar className="w-20 h-20">
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
                    <div className="flex flex-row gap-2 items-center justify-center ">
                      Current Chain:{" "}
                      <h2 className="text-xl font-bold">
                        <span
                          className={streakColor(
                            leaderboardData[1].chain.chain
                          )}
                        >
                          {streakLetter(leaderboardData[1].chain.chain)}
                          {Math.abs(leaderboardData[1].chain.chain)}
                        </span>
                      </h2>
                    </div>
                    <p className="text-xl font-bold">2nd</p>
                  </Card>
                </Link>
              )}
              {leaderboardData[2] && (
                <Link href={`/u/${leaderboardData[2].user?.name}`} passHref>
                  <Card
                    key={leaderboardData[2].user?._id}
                    className="flex flex-col items-center gap-1 p-2"
                  >
                    <Avatar className="w-20 h-20">
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
                    <div className="flex flex-row gap-2 items-center justify-center ">
                      Current Chain:{" "}
                      <h2 className="text-xl font-bold">
                        <span
                          className={streakColor(
                            leaderboardData[2].chain.chain
                          )}
                        >
                          {streakLetter(leaderboardData[2].chain.chain)}
                          {Math.abs(leaderboardData[2].chain.chain)}
                        </span>
                      </h2>
                    </div>
                    <p className="text-xl font-bold">3rd</p>
                  </Card>
                </Link>
              )}
            </div>
            <Card className="">
              {leaderboardList &&
                leaderboardList.map((leaderboard) => (
                  <Link
                    href={`/u/${leaderboard.user?.name}`}
                    key={leaderboard.user?._id}
                    passHref
                  >
                    <div className="flex items-center gap-4 p-2">
                      <p className="text-xl font-bold">{leaderboard.rank}</p>
                      <p className="text-sm text-muted-foreground">\</p>

                      <p>{leaderboard.user?.name}</p>
                      <h2 className="text-xl font-bold">
                        <span className={streakColor(leaderboard.chain.chain)}>
                          {streakLetter(leaderboard.chain.chain)}
                          {Math.abs(leaderboard.chain.chain)}
                        </span>
                      </h2>
                    </div>
                  </Link>
                ))}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="wins">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">All-Time Wins</h2>
            <div className="grid grid-cols-1 gap-6">
              {leaderboardData.sort(
                (a, b) =>
                  (b.user?.stats?.wins || 0) - (a.user?.stats?.wins || 0)
              )[0] && (
                <BackgroundGradient
                  key={leaderboardData[0].user?._id}
                  animate={true}
                  className="rounded-lg overflow-hidden shadow-lg"
                >
                  <Link href={`/u/${leaderboardData[0].user?.name}`} passHref>
                    <Card
                      key={leaderboardData[0].user?._id}
                      className="flex flex-col items-center gap-2 p-4"
                    >
                      <Avatar className="w-20 h-20">
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
                        Total Wins:{" "}
                        <span className="font-bold text-xl text-primary">
                          {leaderboardData[0].chain.wins}
                        </span>
                      </h2>
                    </Card>
                  </Link>
                </BackgroundGradient>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {leaderboardData[1] && (
                <Link href={`/u/${leaderboardData[1].user?.name}`} passHref>
                  <Card
                    key={leaderboardData[1].user?._id}
                    className="flex flex-col items-center gap-1 p-2"
                  >
                    <Avatar className="w-20 h-20">
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
                      Total Wins:{" "}
                      <span className="font-bold text-xl text-primary">
                        {leaderboardData[1].chain.wins}
                      </span>
                    </h2>
                  </Card>
                </Link>
              )}
              {leaderboardData[2] && (
                <Link href={`/u/${leaderboardData[2].user?.name}`} passHref>
                  <Card
                    key={leaderboardData[2].user?._id}
                    className="flex flex-col items-center gap-1 p-2"
                  >
                    <Avatar className="w-20 h-20">
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
                      Total Wins:{" "}
                      <span className="font-bold text-xl text-primary">
                        {leaderboardData[2].chain.wins}
                      </span>
                    </h2>
                  </Card>
                </Link>
              )}
            </div>
            <Card className="">
              {leaderboardData.slice(3).map((leaderboard, index) => (
                <Link
                  href={`/u/${leaderboard.user?.name}`}
                  key={leaderboard.user?._id}
                  passHref
                >
                  <div
                    className="flex items-center gap-4 p-2"
                    key={leaderboard.user?._id}
                  >
                    <p className="text-xl font-bold">{index + 4}</p>
                    <p className="text-sm text-muted-foreground">\</p>
                    <p>{leaderboard.user?.name}</p>
                    <h2>
                      <span className="font-bold text-xl text-primary">
                        {leaderboard.chain.wins}
                      </span>
                    </h2>
                  </div>
                </Link>
              ))}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
