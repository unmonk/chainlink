import { Separator } from "../ui/separator";
import { getUserStats } from "@/lib/actions/profiles";
import { auth } from "@clerk/nextjs";
import { FC } from "react";

interface ProfileStatsProps {
  userId: string;
}

const ProfileStats: FC<ProfileStatsProps> = async ({ userId }) => {
  const stats = await getUserStats(userId);
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold">Stats</h2>
      <div className="rounded-md border">
        <h3 className="p-2 text-center text-xl">Wins By League</h3>
        <div className="grid grid-cols-2 p-2 md:grid-cols-4 xl:grid-cols-6">
          {stats.length > 0 ? (
            stats?.map((stat) => (
              <div key={stat.leagues} className="flex flex-row gap-2">
                <Separator orientation="vertical" />
                <p>{stat.leagues}:</p>
                <p>{stat.win_count}</p>
                <Separator orientation="vertical" />
              </div>
            ))
          ) : (
            <p className="text-center">No Stats Yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
