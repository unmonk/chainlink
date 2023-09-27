import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { PushSubscription, sendNotification, WebPushError } from "web-push";

export async function POST(req: Request) {
  try {
    const { userId, notification } = await req.json();
    if (!userId) {
      throw Error("User id not found");
    }
    if (!notification) {
      throw Error("Notification not found");
    }
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      throw Error("User not found");
    }
    const subscriptions = user.privateMetadata?.pushSubscriptions || [];
    const pushPromises = subscriptions.map((subscription) => {
      sendNotification(
        subscription,
        JSON.stringify({
          title: notification.title,
          body: notification.body,
          icon: notification.icon ?? "/icon-512x512.png",
          badge: notification.badge ?? "/android-chrome-192x192.png",
          image: notification.image ?? "/images/notification.png",
          vibrate: notification.vibrate ?? [100, 50, 100],
          tag: notification.tag ?? "default",
          data: notification.data ?? {},
        }),
        {
          vapidDetails: {
            subject: "mailto:admin@chainlink.st",
            publicKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
            privateKey: process.env.WEB_PUSH_PRIVATE_KEY!,
          },
        },
      ).catch((e) => {
        if (e instanceof WebPushError && e.statusCode === 410) {
          clerkClient.users.updateUser(userId, {
            privateMetadata: {
              pushSubscriptions: subscriptions.filter(
                (s) => s.endpoint !== subscription.endpoint,
              ),
            },
          });
        }
      });
    });
    await Promise.all(pushPromises);
    return NextResponse.json(
      {
        message: "Push notification sent",
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error: "Invalid push notification",
      },
      { status: 500 },
    );
  }
}
