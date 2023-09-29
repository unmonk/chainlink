import { FC } from "react";

interface ProfileAchievementsProps {}

const ProfileAchievements: FC<ProfileAchievementsProps> = ({}) => {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold">Achievements</h2>
      <p className="text-muted-foreground">None Yet. Play to unlock more.</p>
      {/* <div className="grid grid-cols-10 gap-2 mb-4">
            <div className="rounded-full bg-neutral-800 h-20 w-20 flex items-center justify-center">
              <Image
                alt="Achievement"
                src="/images/testbadge.png"
                width={100}
                height={100}
              />
            </div>
            <div className="rounded-full bg-neutral-900 h-20 w-20 flex items-center justify-center">
              <Image
                alt="Achievement"
                src="/images/testbadge.png"
                width={100}
                height={100}
              />
            </div>
            <div className="rounded-full bg-emerald-500 h-20 w-20 flex items-center justify-center">
              <Image
                alt="Achievement"
                src="/images/testbadge.png"
                width={100}
                height={100}
              />
            </div>
            <div className="rounded-full bg-sky-500 h-20 w-20 flex items-center justify-center">
              <Image
                alt="Achievement"
                src="/images/testbadge.png"
                width={100}
                height={100}
              />
            </div>
            <div className="rounded-full bg-red-500 h-20 w-20 flex items-center justify-center">
              <Image
                alt="Achievement"
                src="/images/testbadge.png"
                width={100}
                height={100}
              />
            </div>
            <div className="rounded-full bg-neutral-700 h-20 w-20 flex items-center justify-center">
              <Image
                alt="Achievement"
                src="/images/testbadge.png"
                width={100}
                height={100}
              />
            </div>
          </div> */}
    </div>
  );
};

export default ProfileAchievements;
