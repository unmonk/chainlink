"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { toast } from "sonner";
import { SignedIn, useUser } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";

export function FriendsList() {
  const user = useUser();

  const pendingRequests = useQuery(api.friends.getPendingFriendRequests);
  const friends = useQuery(api.friends.getFriends);
  const declineFriendRequest = useMutation(api.friends.denyFriendRequest);
  const acceptFriendRequest = useMutation(api.friends.acceptFriendRequest);
  const removeFriend = useMutation(api.friends.removeFriend);

  // Collect all unique user IDs
  const userIds = useMemo(() => {
    let senderIds: string[] = [];
    let friendIds: string[] = [];

    if (pendingRequests)
      senderIds = pendingRequests.map((request) => request.senderId);
    if (friends) friendIds = friends.map((friend) => friend.userId);

    const uniqueIds = Array.from(new Set([...senderIds, ...friendIds]));

    return uniqueIds;
  }, [pendingRequests, friends]);

  // Fetch user data only if we have IDs
  const users = useQuery(api.users.queryByClerkIds, {
    clerkUserIds: userIds,
  });

  //merge users into pendingRequests and friends
  const mergedRequests = useMemo(() => {
    if (!pendingRequests || !users) return [];
    return pendingRequests.map((request) => ({
      ...request,
      user: users.find((user) => user?.externalId === request.senderId),
    }));
  }, [pendingRequests, users]);

  const mergedFriends = useMemo(() => {
    if (!friends || !users) return [];
    return friends.map((friend) => ({
      ...friend,
      user: users.find((user) => user?.externalId === friend.userId),
    }));
  }, [friends, users]);

  const handleAcceptRequest = (requestId: Id<"friendRequests">) => {
    acceptFriendRequest({ requestId });
    toast.success("Friend request accepted");
  };
  const handleDeclineRequest = (requestId: Id<"friendRequests">) => {
    declineFriendRequest({ requestId });
    toast.success("Friend request declined");
  };

  const handleRemoveFriend = (friendId: string) => {
    removeFriend({ friendId });
    toast.success("Friend removed");
  };

  if (!mergedRequests || !mergedFriends) return null;

  return (
    <SignedIn>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Friends</CardTitle>
          <CardDescription>Manage your friends and requests</CardDescription>
        </CardHeader>
        <CardContent>
          {mergedRequests && mergedRequests.length > 0 && (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Pending Requests</h3>
                <ScrollArea className="h-[150px]">
                  {mergedRequests.map((request) => {
                    return (
                      <div
                        key={request._id}
                        className="flex items-center justify-between p-2"
                      >
                        <Link href={`/u/${request.user?.name}`} passHref>
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={request.user?.image} />
                              <AvatarFallback>
                                {request.user?.name
                                  ?.slice(0, 2)
                                  .toUpperCase() ?? "??"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {request.user?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(request.sentAt, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                        </Link>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request._id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeclineRequest(request._id)}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </ScrollArea>
              </div>
              <Separator className="my-4" />
            </>
          )}

          <div>
            <h3 className="text-sm font-medium mb-2">Friends</h3>
            <ScrollArea className="h-[200px] grid grid-cols-3 gap-2">
              {mergedFriends &&
                mergedFriends.map((friend) => {
                  return (
                    <div
                      key={friend.userId}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                    >
                      <Link href={`/u/${friend.user?.name}`}>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={friend.user?.image} />
                            <AvatarFallback>
                              {friend.user?.name?.slice(0, 2).toUpperCase() ??
                                "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {friend.user?.name ?? "Loading..."}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {friend.status.toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              friend.status === "ONLINE"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                        </div>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 hover:bg-red-500 hover:text-white rounded-md"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this friend? This
                              action cannot be undone. You have been friends
                              with{" "}
                              <Badge variant="outline">
                                {friend.user?.name}
                              </Badge>{" "}
                              for{" "}
                              <span className="font-medium">
                                {formatDistanceToNow(friend.addedAt)}
                              </span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveFriend(friend.userId)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  );
                })}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </SignedIn>
  );
}
