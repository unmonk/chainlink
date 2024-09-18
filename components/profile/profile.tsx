import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "@clerk/nextjs/server";
import SparklesText from "../magicui/sparkles-text";
import { format } from "timeago.js";
import AvatarCircles from "../magicui/avatar-circles";

function Profile({ user }: { user: User }) {
  return (
    <div className="flex flex-col items-center py-4 md:py-6">
      <Avatar className="w-28 h-28">
        <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
        <AvatarImage src={user.imageUrl} alt={user.username ?? "User Avatar"} />
      </Avatar>
      <SparklesText
        text={user.username ?? ""}
        colors={{
          first: "#13782c",
          second: "#43cd65",
        }}
      />

      <p className="text-sm text-muted-foreground">
        Joined: <span>{format(user.createdAt)}</span>
      </p>

      <div className="grid grid-cols-2 gap-4 mx-2">
        <div className="friends-section flex flex-col gap-2 items-center">
          <h2>Friends</h2>

          <AvatarCircles avatarUrls={[]} numPeople={0} />
        </div>
        <div className="achievements-section flex flex-col gap-2 items-center">
          <h2>Achievements</h2>

          <AvatarCircles avatarUrls={[]} numPeople={0} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
