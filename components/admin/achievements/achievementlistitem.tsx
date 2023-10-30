import { Achievement } from "@/drizzle/schema";
import Image from "next/image";
import { FC } from "react";

interface AchievementListItemProps {
  achievement: Achievement;
}

const AchievementListItem: FC<AchievementListItemProps> = ({ achievement }) => {
  return (
    <div
      key={achievement.id}
      className="flex cursor-pointer flex-row items-center justify-center border-y-2 p-2"
    >
      <div className="flex w-1/3 flex-row items-center justify-center gap-4">
        <Image
          src={"/images/testbadge.png"}
          alt={achievement.name}
          width={85}
          height={85}
        />
        <p className="font-bold">{achievement.name}</p>
      </div>
      <div className="w-2/3">{achievement.description}</div>
    </div>
  );
};

export default AchievementListItem;
