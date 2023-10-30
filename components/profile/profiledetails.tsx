import ProfileAchievements from "@/components/profile/profileachievements";
import ProfileStats from "@/components/profile/profilestats";
import { ProfileStreakDisplay } from "@/components/streaks/profile-streak-display";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@clerk/nextjs/server";
import { FC } from "react";
import { format } from "timeago.js";

interface ProfileDetailsProps {
  user: User;
}

const ProfileDetails: FC<ProfileDetailsProps> = ({ user }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4 md:flex-row">
      <div className="flex w-full flex-col items-center justify-center md:w-1/3">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.imageUrl} alt="User Profile Picture" />
          <AvatarFallback className="bg-slate-500">
            {user?.username?.substring(0, 2) ??
              user?.emailAddresses[0].emailAddress?.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{user.username}</h1>

        <p className="text-muted-foreground text-sm">
          Joined: <span>{format(user?.createdAt)}</span>
        </p>

        <ProfileStreakDisplay size="lg" userId={user?.id} />
      </div>
      <div className="w-full rounded-md border p-4 md:w-2/3">
        <ProfileAchievements />
      </div>
      <div className="flex w-full flex-col items-center">
        <div className="w-full rounded-md border p-4 md:w-5/6">
          <ProfileStats userId={user.id} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
