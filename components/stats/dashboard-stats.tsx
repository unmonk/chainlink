import { useQuery } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { api } from "@/convex/_generated/api";
import { leagueLogos } from "@/convex/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

const DashboardStats = () => {
  const user = useQuery(api.users.currentUser, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
        <CardDescription>All-Time Statistics</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center px-2 py-2 flex-wrap gap-1">
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-green-500 text-white text-nowrap">
            {user.stats.wins} Wins
          </Badge>
        )}
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-red-500 text-white text-nowrap">
            {user.stats.losses} Losses
          </Badge>
        )}
        {!user && (
          <Skeleton className="h-8 w-16 inline-flex items-center rounded-full border px-2.5 py-0.5" />
        )}
        {user && (
          <Badge className="bg-gray-500 text-white text-nowrap">
            {user.stats.pushes} Pushes
          </Badge>
        )}
      </CardContent>
      <CardContent>
        <h3 className="text-lg mt-2">Stats By League</h3>
        <div className="grid gap-2 grid-cols-2 mt-1 items-center">
          {!user &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-40 rounded-lg " />
            ))}
          {user &&
            Object.keys(user.stats.statsByLeague).map((league) => (
              <div
                key={league}
                className="flex flex-col gap-1 items-center rounded-lg bg-accent text-center p-1"
              >
                <span className="sr-only">{league}</span>
                <Image
                  src={leagueLogos[league] ? leagueLogos[league] : "/logo.svg "}
                  alt={league}
                  width={40}
                  height={40}
                />
                <div className="flex justify-center px-2 py-2 flex-wrap gap-1">
                  <Badge className="bg-green-500 text-white text-nowrap">
                    {user.stats.statsByLeague[league].wins} Wins
                  </Badge>
                  <Badge className="bg-red-500 text-white text-nowrap">
                    {user.stats.statsByLeague[league].losses} Losses
                  </Badge>
                  <Badge className="bg-gray-500 text-white text-nowrap">
                    {user.stats.statsByLeague[league].pushes} Pushes
                  </Badge>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
