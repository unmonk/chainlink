import { Separator } from "../ui/separator";
import { getUserStats } from "@/lib/actions/profiles";
import { auth } from "@clerk/nextjs";
import { FC } from "react";

interface ProfileStatsProps {}

const ProfileStats: FC<ProfileStatsProps> = async ({}) => {
  const { userId } = auth();
  if (!userId) return null;
  const stats = await getUserStats(userId);
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Stats</h2>
      <div className="border rounded-md">
        <h3 className="text-xl text-center p-2">Wins By League</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 p-2">
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
