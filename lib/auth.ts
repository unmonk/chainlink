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
