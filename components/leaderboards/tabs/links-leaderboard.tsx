import { LeaderCard, RunnerUpCard } from "./leaderboard-cards";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMonthlyStats } from "@/convex/utils";
import { COSMETIC_STYLE } from "@/lib/utils";

export function LinksLeaderboard({ data }: { data: any[] }) {
  // Sort leaderboard data by total wins
  const sortedData = [...data].sort((a, b) => {
    const aCoins = a.user?.coins || 0;
    const bCoins = b.user?.coins || 0;
    return bCoins - aCoins;
  });
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Current 🔗Links</h2>

      {/* Leader Card */}
      <div className="grid grid-cols-1 gap-6">
        {sortedData[0] && (
          <LeaderCard
            user={sortedData[0].user}
            stats={
              <div className="flex flex-row gap-2 items-center justify-center">
                Total Links:{" "}
                <h2 className="text-xl font-bold text-cyan-500">
                  🔗 {sortedData[0].user.coins.toLocaleString("en-US")}
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
                Total Links:{" "}
                <h2 className="text-xl font-bold text-cyan-500">
                  🔗 {sortedData[1].user.coins.toLocaleString("en-US")}
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
                Total Links:{" "}
                <h2 className="text-xl font-bold text-cyan-500">
                  🔗 {sortedData[2].user.coins.toLocaleString("en-US")}
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
                  <Avatar
                    height="h-8"
                    width="w-8"
                    cosmetic={
                      entry.user.metadata?.avatarBackground as COSMETIC_STYLE
                    }
                    hasGlow={!!entry.user.metadata?.avatarBackground}
                  >
                    <AvatarImage src={entry.user.image} alt={entry.user.name} />
                    <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{entry.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  Total Links:{" "}
                  <h2 className="text-xl font-bold text-cyan-500">
                    🔗 {entry.user.coins.toLocaleString("en-US")}
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
