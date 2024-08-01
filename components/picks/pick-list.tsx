"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { Badge } from "../ui/badge";

export const UserPickList = () => {
  const userPicks = useQuery(api.picks.getUserPicks, {});
  if (!userPicks) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
      {userPicks.map((pick) => (
        <Card
          key={pick._id}
          className={`h-full flex items-center flex-col text-center ${pick.status === "PENDING" || pick.status === "STATUS_IN_PROGRESS" ? "bg-blue-500/10" : pick.status === "WIN" ? "bg-green-500/10" : pick.status === "LOSS" ? "bg-red-500/10" : ""}`}
        >
          <CardHeader>
            <CardTitle>{pick.pick.name}</CardTitle>
            <CardDescription>
              {pick.status === "STATUS_IN_PROGRESS"
                ? "In Progress"
                : pick.status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              src={pick.pick.image}
              alt={pick.pick.name}
              width={100}
              height={100}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-1 flex-nowrap">
            <CardDescription className="text-nowrap">
              {formatDistance(new Date(), new Date(pick._creationTime), {
                includeSeconds: true,
              })}
            </CardDescription>
            {pick.coins !== undefined &&
              pick.status !== "STATUS_IN_PROGRESS" &&
              pick.status !== "PENDING" && (
                <Badge
                  variant={
                    pick.coins < 0
                      ? "destructive"
                      : pick.coins > 0
                        ? "default"
                        : "secondary"
                  }
                >
                  🔗{pick.coins}
                </Badge>
              )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
