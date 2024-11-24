import { LeaderCard, RunnerUpCard } from "./leaderboard-cards";
import { Card } from "@/components/ui/card";
import { streakColor, streakLetter } from "@/components/chains/user-chain";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { COSMETIC_STYLE } from "@/lib/utils";

export function ChainLeaderboard({ data }: { data: any[] }) {
  const sortedData = [...data].sort((a, b) => b.chain.chain - a.chain.chain);

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
                Current Chain:{" "}
                <h2 className="text-xl font-bold">
                  <span className={streakColor(sortedData[0].chain.chain)}>
                    {streakLetter(sortedData[0].chain.chain)}
                    {Math.abs(sortedData[0].chain.chain)}
                  </span>
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
                Chain:{" "}
                <span className={streakColor(sortedData[1].chain.chain)}>
                  {streakLetter(sortedData[1].chain.chain)}
                  {Math.abs(sortedData[1].chain.chain)}
                </span>
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
                Chain:{" "}
                <span className={streakColor(sortedData[2].chain.chain)}>
                  {streakLetter(sortedData[2].chain.chain)}
                  {Math.abs(sortedData[2].chain.chain)}
                </span>
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
                  Chain:{" "}
                  <span className={streakColor(entry.chain.chain)}>
                    {streakLetter(entry.chain.chain)}
                    {Math.abs(entry.chain.chain)}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
