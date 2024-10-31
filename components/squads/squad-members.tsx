"use client";

import React from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { User } from "@clerk/nextjs/server";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDate, formatDistanceToNow } from "date-fns";

export default function SquadMembers({
  members,
}: {
  members: {
    _id: Id<"users">;
    image: string;
    name: string;
    squadInfo: {
      joinedAt: number;
      role: string;
      stats: {
        coins: number;
        wins: number;
        losses: number;
        pushes: number;
      };
    };
  }[];
}) {
  if (!members) return null;

  console.log(members, "members passed as props");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <Card
          key={member._id}
          className="hover:shadow-lg transition-shadow duration-200"
        >
          <CardContent className="pt-4">
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-4">
                <Avatar>
                  <AvatarImage src={member.image} />
                  <AvatarFallback>{member.name}</AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="font-medium text-xl">
                    {member.squadInfo.role === "OWNER" && "⭐"}
                    {member.name}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Joined{" "}
                    {formatDistanceToNow(member.squadInfo.joinedAt, {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Links Contributed:
                  </span>
                  <span className="font-medium">
                    {member.squadInfo.stats.coins}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wins:</span>
                  <span className="font-medium">
                    {member.squadInfo.stats.wins}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Losses:</span>
                  <span className="font-medium">
                    {member.squadInfo.stats.losses}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pushes:</span>
                  <span className="font-medium">
                    {member.squadInfo.stats.pushes}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
