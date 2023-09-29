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
      className="flex flex-row justify-center items-center p-2 border-y-2 cursor-pointer"
    >
      <div className="w-1/3 flex flex-row justify-center items-center gap-4">
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
