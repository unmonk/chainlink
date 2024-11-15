import { LeaderCard, RunnerUpCard } from "./leaderboard-cards";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function WinsLeaderboard({ data }: { data: any[] }) {
  const sortedData = [...data].sort((a, b) => b.chain.wins - a.chain.wins);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Current Wins</h2>

      {/* Leader Card */}
      <div className="grid grid-cols-1 gap-6">
        {sortedData[0] && (
          <LeaderCard
            user={sortedData[0].user}
            stats={
              <div className="flex flex-row gap-2 items-center justify-center">
                Current Wins:{" "}
                <h2 className="text-xl font-bold text-primary">
                  {sortedData[0].chain.wins}
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
                Current Wins:{" "}
                <h2 className="text-xl font-bold text-primary">
                  {sortedData[1].chain.wins}
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
                Current Wins:{" "}
                <h2 className="text-xl font-bold text-primary">
                  {sortedData[2].chain.wins}
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
                  Current Wins:{" "}
                  <h2 className="text-xl font-bold text-primary">
                    {entry.chain.wins}
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
