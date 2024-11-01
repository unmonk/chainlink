"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import type { MouseEventHandler } from "react";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const base64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default function SendNotification() {
  const user = useUser();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [pickCompletion, setPickCompletion] = useState(false);
  const [promotional, setPromotional] = useState(false);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.serwist !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (
            sub &&
            !(
              sub.expirationTime &&
              Date.now() > sub.expirationTime - 5 * 60 * 1000
            )
          ) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
        setRegistration(reg);
      });
    }
    if (user) {
      if (user.user?.publicMetadata?.pickCompletionNotifications) {
        setPickCompletion(true);
      }
      if (user.user?.publicMetadata?.promotionalNotifications) {
        setPromotional(true);
      }
      if (user.user?.publicMetadata?.promotionalEmails) {
        setPromotionalEmails(true);
      }
      if (user.user?.publicMetadata?.weeklyReportEmails) {
        setWeeklyReports(true);
      }
    }
  }, [user]);

  if (!user.isLoaded) {
    return null;
  }

  const updateMetadata = async (key: string, value: boolean) => {
    if (user) {
      try {
        await fetch("/notification/metadata", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userId: user.user?.id,
            type: key,
            value: value,
          }),
        });
      } catch (error) {
        console.error("Error updating metadata:", error);
      }
    }
  };

  const handleToggle =
    (
      setter: React.Dispatch<React.SetStateAction<boolean>>,
      metadataKey: string
    ) =>
    (checked: boolean) => {
      setter(checked);
      updateMetadata(metadataKey, checked);
      if (metadataKey === "pickCompletionNotifications") {
        setPickCompletion(checked);
      } else if (metadataKey === "promotionalNotifications") {
        setPromotional(checked);
      } else if (metadataKey === "promotionalEmails") {
        setPromotionalEmails(checked);
      } else if (metadataKey === "weeklyReportEmails") {
        setWeeklyReports(checked);
      }
    };

  const handleSubscriptionToggle = async (checked: boolean) => {
    if (checked) {
      await subscribeToNotifications();
    } else {
      await unsubscribeFromNotifications();
    }
  };

  const subscribeToNotifications = async () => {
    if (!process.env.NEXT_PUBLIC_WEB_PUSH_KEY) {
      throw new Error("Environment variables supplied not sufficient.");
    }
    if (!registration) {
      console.error("No SW registration available.");
      return;
    }
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(
        process.env.NEXT_PUBLIC_WEB_PUSH_KEY
      ),
    });
    // TODO: you should call your API to save subscription data on the server in order to send web push notification from the server
    const response = await fetch("/notification/metadata", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription: sub,
        userId: user.user?.id,
        type: "subscribe",
      }),
    });
    const data = await response.json();
    if (data.success) {
      setSubscription(sub);
      setIsSubscribed(true);
    } else {
      setSubscription(null);
      setIsSubscribed(false);
    }
  };

  const unsubscribeFromNotifications = async () => {
    if (!subscription) {
      console.error("Web push not subscribed");
      return;
    }
    await subscription.unsubscribe();
    const response = await fetch("/notification/metadata", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription: subscription,
        userId: user.user?.id,
        type: "unsubscribe",
      }),
    });
    const data = await response.json();
    if (data.success) {
      setSubscription(null);
      setIsSubscribed(false);
    }
  };

  const sendNotificationButtonOnClick: MouseEventHandler<
    HTMLButtonElement
  > = async (event) => {
    event.preventDefault();

    if (!subscription) {
      alert("Web push not subscribed");
      return;
    }

    try {
      await fetch("/notification", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          payload: {
            notification: {
              title: "Test Notification",
              message: "This is a test notification from ChainLink",
            },
          },
        }),
        signal: AbortSignal.timeout(10000),
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "TimeoutError") {
          console.error("Timeout: It took too long to get the result.");
        } else if (err.name === "AbortError") {
          console.error(
            "Fetch aborted by user action (browser stop button, closing tab, etc.)"
          );
        } else if (err.name === "TypeError") {
          console.error("The AbortSignal.timeout() method is not supported.");
        } else {
          // A network error, or some other problem.
          console.error(`Error: type: ${err.name}, message: ${err.message}`);
        }
      } else {
        console.error(err);
      }
      alert("An error happened.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
          <span>Push Notifications</span>
          <span className="font-normal leading-snug text-muted-foreground">
            Receive push notifications on this device.
          </span>
        </Label>
        <Switch
          id="push-notifications"
          checked={isSubscribed}
          onCheckedChange={handleSubscriptionToggle}
        />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Button
          onClick={sendNotificationButtonOnClick}
          disabled={!isSubscribed}
          variant="default"
          size="sm"
        >
          Test Notification
        </Button>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="pick-completion" className="flex flex-col space-y-1">
          <span>Pick Completion Notifications</span>
          <span className="font-normal leading-snug text-muted-foreground">
            Receive notifications when your pick is completed.
          </span>
        </Label>
        <Switch
          id="pick-completion"
          checked={pickCompletion}
          disabled={!isSubscribed}
          onCheckedChange={handleToggle(
            setPickCompletion,
            "pickCompletionNotifications"
          )}
        />
      </div>
      {/*  <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="promotional" className="flex flex-col space-y-1">
          <span>Promotional Notifications</span>
          <span className="font-normal leading-snug text-muted-foreground">
            Receive notifications about special events, featured matchups, and
            promotions.
          </span>
        </Label>
        <Switch
          id="promotional"
          checked={promotional}
          disabled={!isSubscribed}
          onCheckedChange={handleToggle(
            setPromotional,
            "promotionalNotifications"
          )}
        />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="promotional-emails" className="flex flex-col space-y-1">
          <span>Promotional Emails</span>
          <span className="font-normal leading-snug text-muted-foreground">
            Receive emails about special events, featured matchups, and
            promotions.
          </span>
        </Label>
        <Switch
          id="promotional-emails"
          checked={promotionalEmails}
          disabled={!isSubscribed}
          onCheckedChange={handleToggle(
            setPromotionalEmails,
            "promotionalEmails"
          )}
        />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="weekly-reports" className="flex flex-col space-y-1">
          <span>Weekly Report Emails</span>
          <span className="font-normal leading-snug text-muted-foreground">
            Receive a weekly report of your picks and standings.
          </span>
        </Label>
        <Switch
          id="weekly-reports"
          checked={weeklyReports}
          disabled={!isSubscribed}
          onCheckedChange={handleToggle(setWeeklyReports, "weeklyReportEmails")}
        />
      </div> */}
    </>
  );
}
