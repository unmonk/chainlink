import { db } from "@/drizzle/db";
import { profiles, streaks } from "@/drizzle/schema";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

export const getUserProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }

  //get profile
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.user_id, user.id),
  });

  if (profile) {
    return profile;
  }

  // Doesnt exist, create new profile
  await db.insert(profiles).values({
    user_id: user.id,
  });

  const newProfile = await db.query.profiles.findFirst({
    where: eq(profiles.user_id, user.id),
  });
  return newProfile;
};

export const createProfile = async (userId: string) => {
  const profile = await db.insert(profiles).values({
    user_id: userId,
  });
  return profile;
};
