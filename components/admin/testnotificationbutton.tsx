"use client";

import { Button } from "../ui/button";
import { sendPushNotificationToUser } from "@/lib/notifications";
import { useUser } from "@clerk/nextjs";
import { FC } from "react";

interface TestNotificationButtonProps {}

const TestNotificationButton: FC<TestNotificationButtonProps> = ({}) => {
  const { user } = useUser();
  const userId = user?.id;

  const handleButtonClick = async () => {
    if (!userId) return;
    await sendPushNotificationToUser(userId, {
      title: "Test Push Notification",
      body: "This is a test push notification from ChainLink",
      icon: "/android-chrome-192x192.png",
      badge: "/android-chrome-512x512.png",
      data: {
        url: "https://chainlink.st/play",
      },
      tag: "open",
      vibrate: [200, 100, 200, 200, 100, 200],
    });
    return;
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleButtonClick}
      className="m-2"
    >
      Test Push Notifications
    </Button>
  );
};

export default TestNotificationButton;
