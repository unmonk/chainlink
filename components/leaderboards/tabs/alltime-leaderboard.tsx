import { LeaderCard, RunnerUpCard } from "./leaderboard-cards";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMonthlyStats } from "@/convex/utils";

export function AllTimeLeaderboard({ data }: { data: any[] }) {
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
  const sortedData = [...data].sort((a, b) => {
    const aWins = calculateTotalWins(a.user?.monthlyStats as UserMonthlyStats);
    const bWins = calculateTotalWins(b.user?.monthlyStats as UserMonthlyStats);
    return bWins - aWins;
  });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Current Best Chain</h2>

      {/* Leader Card */}
      <div className="grid grid-cols-1 gap-6">
        {sortedData[0] && (
          <LeaderCard
            user={sortedData[0].user}
            stats={
              <div className="flex flex-row gap-2 items-center justify-center">
                Total Wins:{" "}
                <h2 className="text-xl font-bold">
                  {calculateTotalWins(
                    sortedData[0].user?.monthlyStats as UserMonthlyStats
                  )}
                </h2>
              </div>
            }
          />
        )}
      </div>

      {/* Runner Ups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedData[1] && (
          <RunnerUpCard
            user={sortedData[1].user}
            position="2nd"
            stats={
              <div className="flex flex-row gap-2 items-center justify-center">
                Total Wins:{" "}
                <h2 className="text-xl font-bold">
                  {calculateTotalWins(
                    sortedData[1].user?.monthlyStats as UserMonthlyStats
                  )}
                </h2>
              </div>
            }
          />
        )}
        {sortedData[2] && (
          <RunnerUpCard
            user={sortedData[2].user}
            position="3rd"
            stats={
              <div className="flex flex-row gap-2 items-center justify-center">
                Total Wins:{" "}
                <h2 className="text-xl font-bold">
                  {calculateTotalWins(
                    sortedData[2].user?.monthlyStats as UserMonthlyStats
                  )}
                </h2>
              </div>
            }
          />
        )}
      </div>

      {/* Rest of Leaderboard */}
      <div className="grid grid-cols-1 gap-2">
        {sortedData.slice(3).map((entry, index) => (
          <Link key={entry.user._id} href={`/u/${entry.user.name}`} passHref>
            <Card className="p-4 hover:bg-accent transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold">{index + 4}</p>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.user.image} alt={entry.user.name} />
                    <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{entry.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  Total Wins:{" "}
                  <h2 className="text-xl font-bold">
                    {calculateTotalWins(
                      entry.user?.monthlyStats as UserMonthlyStats
                    )}
                  </h2>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
