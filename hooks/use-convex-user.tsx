import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useConvexUser() {
  const { user } = useUser();
  const convexUser = useQuery(
    api.users.queryByClerkId,
    user?.id ? { clerkUserId: user.id } : "skip"
  );

  return {
    user: convexUser,
    userId: convexUser?._id as Id<"users"> | undefined,
    isLoading: convexUser === undefined,
  };
}
