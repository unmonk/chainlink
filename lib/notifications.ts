export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service worker not supported");
  }
  await navigator.serviceWorker.register("/serviceworker.js");
}

export async function getReadyServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service worker not supported");
  }
  const registration = await navigator.serviceWorker.ready;
  return registration;
}

export async function getSubscription(): Promise<PushSubscription | null> {
  const sw = await getReadyServiceWorker();
  const subscription = await sw.pushManager.getSubscription();
  return subscription;
}

export async function registerPushNotifications() {
  if (!("PushManager" in window)) {
    throw Error("Push notifications not supported");
  }

  const existingSubscription = await getSubscription();
  if (existingSubscription) {
    throw Error("Push subscription already exists");
  }
  const sw = await getReadyServiceWorker();
  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  });

  await sendPushSubscriptionToServer(subscription);
  return subscription;
}

export async function unregisterPushNotifications() {
  const existingSubscription = await getSubscription();
  if (!existingSubscription) {
    throw Error("Push subscription does not exist");
  }
  await deletePushSubscriptionFromServer(existingSubscription);
  await existingSubscription.unsubscribe();
}

export async function sendPushSubscriptionToServer(
  subscription: PushSubscription,
) {
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  if (!response.ok) {
    throw Error("Could not send push subscription to server");
  }
}

export async function deletePushSubscriptionFromServer(
  subscription: PushSubscription,
) {
  const response = await fetch("/api/notifications", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  if (!response.ok) {
    throw Error("Could not delete push subscription from server");
  }

  console.log("deletePushSubscriptionFromServer");
}

export async function sendPushNotificationToUser(
  userId: string,
  notification: {
    title: string;
    body: string;
    icon?: string;
    image?: string;
    badge?: string;
    vibrate?: number[];
    tag?: string;
    data?: any;
  },
) {
  const response = await fetch("/api/notifications/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      notification,
    }),
  });
  if (!response.ok) {
    throw Error("Could not send push subscription to server");
  }
}
