import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@clerk/nextjs/server";
import SparklesText from "../magicui/sparkles-text";
import { format } from "timeago.js";
import ProfileAchievements from "./profile-achievements";
import AddFriendButton from "./add-friend-button";

function Profile({ user }: { user: User }) {
  const username = user.username ?? "";
  const textSize = username.length > 12 ? "text-4xl" : "text-6xl";

  return (
    <div className="relative flex flex-col items-center py-4 md:py-6">
      <div className="absolute top-0 right-0">
        <AddFriendButton userId={user.id} />
      </div>

      <Avatar className="w-28 h-28">
        <AvatarFallback>{username.charAt(0)}</AvatarFallback>
        <AvatarImage src={user.imageUrl} alt={username ?? "User Avatar"} />
      </Avatar>

      <SparklesText
        text={username}
        colors={{
          first: "#13782c",
          second: "#43cd65",
        }}
        className={`max-w-full mt-2 ${textSize}`}
      />

      <p className="text-sm text-muted-foreground">
        Joined: <span>{format(user.createdAt)}</span>
      </p>

      <div className="flex flex-col gap-2 items-center mt-4">
        <h2 className="text-lg font-bold">Achievements</h2>
        <ProfileAchievements userId={user.id} username={user.username} />
      </div>
    </div>
  );
}

export default Profile;
