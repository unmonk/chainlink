"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { CheckCircle2Icon, PlusIcon, UserMinusIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { SignedIn, useUser } from "@clerk/nextjs";
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
} from "@/components/ui/alert-dialog";

export default function AddFriendButton({ userId }: { userId: string }) {
  const { user } = useUser();
  const sendFriendRequest = useMutation(api.friends.sendFriendRequest);
  const removeFriend = useMutation(api.friends.removeFriend);
  const checkIfFriends = useQuery(api.friends.checkIfFriends, { userId });
  const [pending, setPending] = useState(false);

  const handleAddFriend = async () => {
    setPending(true);
    try {
      await sendFriendRequest({ receiverId: userId });
      toast.success("Friend request sent");
    } catch (error) {
      toast.error(`Failed to send friend request: ${error}`);
    } finally {
      setPending(false);
    }
  };

  const handleUnfriend = async () => {
    try {
      await removeFriend({ friendId: userId });
      toast.success("Friend removed");
    } catch (error) {
      toast.error("Failed to remove friend");
    }
  };

  const isCurrentUser = user?.id === userId;

  return (
    <SignedIn>
      {!isCurrentUser && (
        <>
          {checkIfFriends && checkIfFriends.isFriend ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <div className="flex items-center gap-2">
                    <UserMinusIcon /> Unfriend
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove this person from your friends list. You can
                    always add them back later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleUnfriend}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Unfriend
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddFriend}
              disabled={pending || (checkIfFriends && checkIfFriends.isPending)}
            >
              {pending || (checkIfFriends && checkIfFriends.isPending) ? (
                "Sent"
              ) : (
                <div className="flex items-center gap-2">
                  <PlusIcon /> Add Friend
                </div>
              )}
            </Button>
          )}
        </>
      )}
    </SignedIn>
  );
}
