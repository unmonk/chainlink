"use client";
import React from "react";
import AvatarCircles from "../magicui/avatar-circles";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { currentUser } from "@/convex/users";

export default function FriendsCircles({
  friends,
}: {
  friends: {
    userId: string;
    addedAt: number;
    status: string;
  }[];
}) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <AvatarCircles avatarUrls={[]} numPeople={0} />
      <Button variant="outline" size="sm">
        <PlusIcon /> Add Friend
      </Button>
    </div>
  );
}
