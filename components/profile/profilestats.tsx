import { FC } from "react";

interface ProfileStatsProps {}

const ProfileStats: FC<ProfileStatsProps> = ({}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Stats</h2>
      <p className="text-muted-foreground">Coming Soon</p>
    </div>
  );
};

export default ProfileStats;
