import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function getAuthToken() {
  return (await auth().getToken({ template: "convex" })) ?? undefined;
}

export async function getUserByUsername(username: string) {
  const user = await clerkClient().users.getUserList({
    username: [username],
    limit: 1,
  });

  if (user.data.length === 0) {
    return null;
  }
  return user.data[0];
}

export async function getUsersByClerkIds(userIds: string[]) {
  const users = await clerkClient().users.getUserList({
    userId: userIds,
    limit: userIds.length,
  });
  return users.data;
}

export async function getClerkUser(userId: string) {
  return await clerkClient().users.getUser(userId);
}
