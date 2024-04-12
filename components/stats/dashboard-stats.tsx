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

const DashboardStats = () => {
  const user = useQuery(api.users.currentUser, {});
  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
        <CardDescription>All-Time Statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription className="flex justify-center px-2 py-2 flex-wrap gap-1">
          <Badge className="bg-green-500 text-white text-nowrap">
            {user.stats.wins} Wins
          </Badge>
          <Badge className="bg-red-500 text-white text-nowrap">
            {user.stats.losses} Losses
          </Badge>
          <Badge className="bg-gray-500 text-white text-nowrap">
            {user.stats.pushes} Pushes
          </Badge>
        </CardDescription>
      </CardContent>
      <CardContent>
        <h3 className="text-lg mt-2">Stats By League</h3>
        <CardDescription className="grid gap-2 grid-cols-2 mt-1">
          {Object.keys(user.stats.statsByLeague).map((league) => (
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
              <div className="flex flex-row gap-0.5 text-sm">
                <p>
                  W:
                  <span className="font-semibold">
                    {user.stats.statsByLeague[league].wins}
                  </span>
                </p>
                |
                <p>
                  L:
                  <span className="font-semibold">
                    {user.stats.statsByLeague[league].losses}
                  </span>
                </p>
                |
                <p>
                  P:
                  <span className="font-semibold">
                    {user.stats.statsByLeague[league].pushes}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
