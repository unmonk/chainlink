import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { subscription, userId, type, value } = await request.json();

  const user = await clerkClient().users.getUser(userId);
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" });
  }
  const privateMetadata: any = user.privateMetadata;
  const publicMetadata: any = user.publicMetadata;

  if (type === "subscribe") {
    if (!privateMetadata.pushSubscriptions) {
      privateMetadata.pushSubscriptions = [] as PushSubscription[];
    }
    privateMetadata.pushSubscriptions.push(subscription);
  }

  if (type === "unsubscribe") {
    privateMetadata.pushSubscriptions =
      privateMetadata.pushSubscriptions.filter(
        (sub: PushSubscription) => sub.endpoint !== subscription.endpoint
      );
  }

  if (type === "pickCompletionNotifications") {
    publicMetadata.pickCompletionNotifications =
      !publicMetadata.pickCompletionNotifications || value;
  }

  if (type === "promotionalNotifications") {
    publicMetadata.promotionalNotifications =
      !publicMetadata.promotionalNotifications || value;
  }

  if (type === "promotionalEmails") {
    publicMetadata.promotionalEmails =
      !publicMetadata.promotionalEmails || value;
  }

  if (type === "weeklyReportEmails") {
    publicMetadata.weeklyReportEmails =
      !publicMetadata.weeklyReportEmails || value;
  }

  await clerkClient().users.updateUserMetadata(userId, {
    privateMetadata: privateMetadata,
    publicMetadata: publicMetadata,
  });

  return NextResponse.json({ success: true });
}
