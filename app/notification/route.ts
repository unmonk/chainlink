import { type NextRequest, NextResponse } from "next/server";
import webPush from "web-push";

export const POST = async (req: NextRequest) => {
  if (
    !process.env.NEXT_PUBLIC_WEB_PUSH_KEY ||
    !process.env.WEB_PUSH_EMAIL ||
    !process.env.WEB_PUSH_PRIVATE_KEY
  ) {
    throw new Error("Environment variables supplied not sufficient.");
  }
  const { subscription, payload } = (await req.json()) as {
    subscription: webPush.PushSubscription;
    payload: {
      notification: {
        title: string;
        message: string;
        icon: string;
        actions: {
          action: string;
          title: string;
        }[];
        data: Record<string, any>;
      };
    };
  };
  try {
    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_KEY!,
      process.env.WEB_PUSH_PRIVATE_KEY!
    );
    const response = await webPush.sendNotification(
      subscription,
      JSON.stringify({
        title: payload.notification.title,
        message: payload.notification.message,
        icon: payload.notification.icon,
        actions: payload.notification.actions,
        data: payload.notification.data,
      })
    );
    return new NextResponse(response.body, {
      status: response.statusCode,
      headers: response.headers,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof webPush.WebPushError) {
      return new NextResponse(err.body, {
        status: err.statusCode,
        headers: err.headers,
      });
    }

    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
};
