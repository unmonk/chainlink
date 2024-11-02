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
import { UserMonthlyStats } from "@/convex/utils";

export const LeaderboardList = () => {
  const leaderboardData = useQuery(api.leaderboards.getChainLeaderboard, {});
  if (!leaderboardData) return null;

  leaderboardData.sort((a, b) => b.chain.chain - a.chain.chain);
  const leaderboardList = leaderboardData.slice(3, leaderboardData.length);

  const sortedByChainWins = leaderboardData.sort(
    (a, b) => b.chain.wins - a.chain.wins
  );

  // Function to calculate total wins from monthly stats
  const calculateTotalWins = (
    monthlyStats: UserMonthlyStats | undefined
  ): number => {
    if (!monthlyStats) return 0;
    return Object.values(monthlyStats).reduce(
      (total, month) => total + (month.wins || 0),
      0
    );
  };

  // Sort leaderboard data by total wins
  const sortedByAllTimeWins = [...leaderboardData].sort((a, b) => {
    const aWins = calculateTotalWins(a.user?.monthlyStats as UserMonthlyStats);
    const bWins = calculateTotalWins(b.user?.monthlyStats as UserMonthlyStats);
    return bWins - aWins;
  });

  const sortByUserCoins = leaderboardData.sort((a, b) => {
    const aCoins = a.user?.coins || 0;
    const bCoins = b.user?.coins || 0;
    return bCoins - aCoins;
  });

  // Get top 3 winners and the rest
  const topThreeWinners = sortedByAllTimeWins.slice(0, 3);
  const remainingWinners = sortedByAllTimeWins.slice(3);

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
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Current Best Chain</h2>
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
                      <h3 className="text-xl font-semibold">
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
                      <p className="text-sm font-bold">Leader</p>
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
                    <h3 className="text-xl font-semibold">
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
                    <p className="text-sm font-bold">2nd</p>
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
                    <h3 className="text-xl font-semibold">
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
                    <p className="text-sm font-bold">3rd</p>
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
            <h2 className="text-2xl font-bold">Current Wins</h2>
            <div className="grid grid-cols-1 gap-6">
              {sortedByChainWins[0] && (
                <BackgroundGradient
                  key={sortedByChainWins[0].user?._id}
                  animate={true}
                  className="rounded-lg overflow-hidden shadow-lg"
                >
                  <Link href={`/u/${sortedByChainWins[0].user?.name}`} passHref>
                    <Card
                      key={sortedByChainWins[0].user?._id}
                      className="flex flex-col items-center gap-2 p-4"
                    >
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={sortedByChainWins[0].user?.image}
                          alt={sortedByChainWins[0].user?.name}
                        />
                        <AvatarFallback>
                          {sortedByChainWins[0].user?.name}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold">
                        {sortedByChainWins[0].user?.name}
                      </h3>
                      <h2>
                        Total Wins:{" "}
                        <span className="font-bold text-xl text-primary">
                          {sortedByChainWins[0].chain.wins}
                        </span>
                      </h2>
                      <p className="text-sm font-bold">Leader</p>
                    </Card>
                  </Link>
                </BackgroundGradient>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {sortedByChainWins[1] && (
                <Link href={`/u/${sortedByChainWins[1].user?.name}`} passHref>
                  <Card
                    key={sortedByChainWins[1].user?._id}
                    className="flex flex-col items-center gap-1 p-2"
                  >
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={sortedByChainWins[1].user?.image}
                        alt={sortedByChainWins[1].user?.name}
                      />
                      <AvatarFallback>
                        {sortedByChainWins[1].user?.name}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">
                      {sortedByChainWins[1].user?.name}
                    </h3>
                    <h2>
                      Total Wins:{" "}
                      <span className="font-bold text-xl text-primary">
                        {sortedByChainWins[1].chain.wins}
                      </span>
                    </h2>
                    <p className="text-sm font-bold">2nd</p>
                  </Card>
                </Link>
              )}
              {sortedByChainWins[2] && (
                <Link href={`/u/${sortedByChainWins[2].user?.name}`} passHref>
                  <Card
                    key={sortedByChainWins[2].user?._id}
                    className="flex flex-col items-center gap-1 p-2"
                  >
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={sortedByChainWins[2].user?.image}
                        alt={sortedByChainWins[2].user?.name}
                      />
                      <AvatarFallback>
                        {sortedByChainWins[2].user?.name}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">
                      {sortedByChainWins[2].user?.name}
                    </h3>
                    <h2>
                      Total Wins:{" "}
                      <span className="font-bold text-xl text-primary">
                        {sortedByChainWins[2].chain.wins}
                      </span>
                    </h2>
                    <p className="text-sm font-bold">3rd</p>
                  </Card>
                </Link>
              )}
            </div>
            <Card className="">
              {sortedByChainWins.slice(3).map((leaderboard, index) => (
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
        <TabsContent value="alltime">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">All-Time Wins</h2>
            <div className="grid grid-cols-1 gap-6">
              {topThreeWinners[0] && (
                <BackgroundGradient
                  key={topThreeWinners[0].user?._id}
                  animate={true}
                  className="rounded-lg overflow-hidden shadow-lg"
                >
                  <Link href={`/u/${topThreeWinners[0].user?.name}`} passHref>
                    <Card
                      key={topThreeWinners[0].user?._id}
                      className="flex flex-col items-center gap-2 p-4"
                    >
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={topThreeWinners[0].user?.image}
                          alt={topThreeWinners[0].user?.name}
                        />
                        <AvatarFallback>
                          {topThreeWinners[0].user?.name}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold">
                        {topThreeWinners[0].user?.name}
                      </h3>
                      <div className="flex flex-row gap-2 items-center justify-center">
                        Total Wins:{" "}
                        <h2 className="text-xl font-bold text-primary">
                          {calculateTotalWins(
                            topThreeWinners[0].user
                              ?.monthlyStats as UserMonthlyStats
                          )}
                        </h2>
                      </div>
                      <p className="text-sm font-bold">All-Time Leader</p>
                    </Card>
                  </Link>
                </BackgroundGradient>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {topThreeWinners.slice(1).map((winner, index) => (
                <Link
                  href={`/u/${winner.user?.name}`}
                  key={winner.user?._id}
                  passHref
                >
                  <Card className="flex flex-col items-center gap-1 p-2">
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={winner.user?.image}
                        alt={winner.user?.name}
                      />
                      <AvatarFallback>{winner.user?.name}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">
                      {winner.user?.name}
                    </h3>
                    <h2>
                      Total Wins:{" "}
                      <span className="font-bold text-xl text-primary">
                        {calculateTotalWins(
                          winner.user?.monthlyStats as UserMonthlyStats
                        )}
                      </span>
                    </h2>
                    <p className="text-sm font-bold">
                      {index === 0 ? "2nd" : "3rd"}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
            <Card>
              {remainingWinners.map((winner, index) => (
                <Link
                  href={`/u/${winner.user?.name}`}
                  key={winner.user?._id}
                  passHref
                >
                  <div className="flex items-center gap-4 p-2">
                    <p className="text-xl font-bold">{index + 4}</p>
                    <p className="text-sm text-muted-foreground">\</p>
                    <p>{winner.user?.name}</p>
                    <h2>
                      <span className="font-bold text-xl text-primary">
                        {calculateTotalWins(
                          winner.user?.monthlyStats as UserMonthlyStats
                        )}
                      </span>
                    </h2>
                  </div>
                </Link>
              ))}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="links">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Most Links</h2>
            <div className="grid grid-cols-1 gap-6">
              {sortByUserCoins[0] && (
                <BackgroundGradient
                  key={sortByUserCoins[0].user?._id}
                  animate={true}
                  className="rounded-lg overflow-hidden shadow-lg"
                >
                  <Link href={`/u/${sortByUserCoins[0].user?.name}`} passHref>
                    <Card
                      key={sortByUserCoins[0].user?._id}
                      className="flex flex-col items-center gap-2 p-4"
                    >
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={sortByUserCoins[0].user?.image}
                          alt={sortByUserCoins[0].user?.name}
                        />
                        <AvatarFallback>
                          {sortByUserCoins[0].user?.name}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold">
                        {sortByUserCoins[0].user?.name}
                      </h3>
                      <div className="flex flex-row gap-2 items-center justify-center ">
                        <span className="text-cyan-600 text-nowrap text-xl">
                          🔗{" "}
                          {sortByUserCoins[0].user?.coins.toLocaleString(
                            "en-US"
                          )}
                        </span>
                      </div>
                      <p className="text-sm font-bold">Leader</p>
                    </Card>
                  </Link>
                </BackgroundGradient>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {sortByUserCoins[1] && (
                <Link href={`/u/${sortByUserCoins[1].user?.name}`} passHref>
                  <Card
                    key={sortByUserCoins[1].user?._id}
                    className="flex flex-col items-center gap-1 p-2"
                  >
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={sortByUserCoins[1].user?.image}
                        alt={sortByUserCoins[1].user?.name}
                      />
                      <AvatarFallback>
                        {sortByUserCoins[1].user?.name}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">
                      {sortByUserCoins[1].user?.name}
                    </h3>
                    <div className="flex flex-row gap-2 items-center justify-center ">
                      <span className="text-cyan-600 text-nowrap text-xl">
                        🔗{" "}
                        {sortByUserCoins[1].user?.coins.toLocaleString("en-US")}
                      </span>
                    </div>
                    <p className="text-sm font-bold">2nd</p>
                  </Card>
                </Link>
              )}
              {sortByUserCoins[2] && (
                <Link href={`/u/${sortByUserCoins[2].user?.name}`} passHref>
                  <Card
                    key={sortByUserCoins[2].user?._id}
                    className="flex flex-col items-center gap-1 p-2"
                  >
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={sortByUserCoins[2].user?.image}
                        alt={sortByUserCoins[2].user?.name}
                      />
                      <AvatarFallback>
                        {sortByUserCoins[2].user?.name}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">
                      {sortByUserCoins[2].user?.name}
                    </h3>
                    <div className="flex flex-row gap-2 items-center justify-center ">
                      <span className="text-cyan-600 text-nowrap text-xl">
                        🔗{" "}
                        {sortByUserCoins[2].user?.coins.toLocaleString("en-US")}
                      </span>
                    </div>
                    <p className="text-sm font-bold">3rd</p>
                  </Card>
                </Link>
              )}
            </div>
            <Card className="">
              {sortByUserCoins.slice(3).map((leaderboard, index) => (
                <Link
                  href={`/u/${leaderboard.user?.name}`}
                  key={leaderboard.user?._id}
                  passHref
                >
                  <div className="flex items-center gap-4 p-2">
                    <p className="text-xl font-bold">{index + 4}</p>
                    <p className="text-sm text-muted-foreground">\</p>
                    <p>{leaderboard.user?.name}</p>
                    <span className="text-cyan-600 text-nowrap text-xl">
                      🔗 {leaderboard.user?.coins?.toLocaleString("en-US")}
                    </span>
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
