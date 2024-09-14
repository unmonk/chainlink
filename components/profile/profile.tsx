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

      <h2>All-Time Stats</h2>
      <h2>Current Stats</h2>

      <div className="flex flex-row gap-4 mx-2">
        <div className="friends-section">
          <h2>Friends</h2>
          <AvatarCircles
            avatarUrls={[
              "https://i.pravatar.cc/150?img=1",
              "https://i.pravatar.cc/150?img=2",
              "https://i.pravatar.cc/150?img=3",
              "https://i.pravatar.cc/150?img=4",
              "https://i.pravatar.cc/150?img=5",
            ]}
            numPeople={99}
          />
        </div>
        <div className="squads-section">
          <h2>Squads</h2>
          <AvatarCircles
            avatarUrls={[
              "https://i.pravatar.cc/150?img=1",
              "https://i.pravatar.cc/150?img=2",
              "https://i.pravatar.cc/150?img=3",
              "https://i.pravatar.cc/150?img=4",
              "https://i.pravatar.cc/150?img=5",
            ]}
            numPeople={99}
          />
        </div>
      </div>

      <div className="statistics-panel">
        <h2>Statistics</h2>
        {/* Add statistics content here */}
      </div>
    </div>
  );
}

export default Profile;
