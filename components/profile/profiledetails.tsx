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
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-20 w-20">
        <AvatarImage src={user?.imageUrl} alt="User Profile Picture" />
        <AvatarFallback className="bg-slate-500">
          {user?.username?.substring(0, 2) ??
            user?.emailAddresses[0].emailAddress?.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold">{user.username}</h1>

      <p className="text-sm text-muted-foreground">
        Joined: <span>{format(user?.createdAt)}</span>
      </p>

      <ProfileStreakDisplay size="lg" userId={user?.id} />
      <h2 className="text-xl font-bold"></h2>
    </div>
  );
};

export default ProfileDetails;
