import { PickStatus } from "@/drizzle/schema";
import { clerkClient } from "@clerk/nextjs";

export async function sendDiscordStreakNotification(
  userId: string,
  pick_status: PickStatus,
) {
  const user = await clerkClient.users.getUser(userId);
  if (!user) {
    return;
  }
  const discordId = user.externalAccounts.find(
    (account) => account.provider === "oauth_discord",
  )?.externalId;
  if (!discordId) {
    return;
  }

  let message = "";

  if (pick_status === "WIN") {
    message = `<@${discordId}> your last pick **WON** 🎉 . Make your next pick now!`;
  }
  if (pick_status === "LOSS") {
    message = `<@${discordId}> your last pick **LOST** 😭. Make your next pick now!`;
  }
  if (pick_status === "PUSH") {
    message = `<@${discordId}> your last pick **PUSHED** 🫸. Make your next pick now!`;
  }

  const response = await fetch(
    process.env.DISCORD_PICK_NOTIFICATIONS_WEBHOOK!,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    },
  );
  if (!response.ok) {
    throw Error("Could not send Discord Notification");
  }
  return;
}
