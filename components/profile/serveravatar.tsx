import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@clerk/nextjs/server";
import { FC } from "react";

interface ServerAvatarProps {
  user: User;
}

const ServerAvatar: FC<ServerAvatarProps> = ({ user }) => {
  return (
    <Avatar className="mx-2 h-7 w-7">
      <AvatarImage src={user?.imageUrl} alt="User Profile Picture" />
      <AvatarFallback className="bg-slate-500">
        {user?.username?.substring(0, 2) ??
          user?.emailAddresses[0].emailAddress?.substring(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ServerAvatar;
