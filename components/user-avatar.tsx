"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import { FC } from "react";

interface UserAvatarProps {}

const UserAvatar: FC<UserAvatarProps> = ({}) => {
  const { user } = useUser();
  return (
    <Avatar className="w-7 h-7 mx-2">
      <AvatarImage src={user?.imageUrl} alt="User Profile Picture" />
      <AvatarFallback className="bg-slate-500">
        {user?.username?.substring(0, 2) ??
          user?.emailAddresses[0].emailAddress?.substring(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
