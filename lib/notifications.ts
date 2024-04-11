import { getReadyServiceWorker } from "@/lib/utils";

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  const sw = await getReadyServiceWorker();
  return sw.pushManager.getSubscription();
}

export async function registerPushNotifications() {
  if (!("PushManager" in window)) {
    throw Error("Push notifications are not supported by this browser");
  }

  const existingSubscription = await getCurrentPushSubscription();

  if (existingSubscription) {
    throw Error("Existing push subscription found");
  }

  const sw = await getReadyServiceWorker();

  if (!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY) {
    throw Error("Web push public key not found");
  }
  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  });

  await sendPushSubscriptionToServer(subscription);
}

export async function unregisterPushNotifications() {
  const existingSubscription = await getCurrentPushSubscription();

  if (!existingSubscription) {
    throw Error("No existing push subscription found");
  }

  await deletePushSubscriptionFromServer(existingSubscription);

  await existingSubscription.unsubscribe();
}

export async function sendPushSubscriptionToServer(
  subscription: PushSubscription
) {
  const response = await fetch("/api/register-push", {
    method: "POST",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to send push subscription to server");
  }
}

export async function deletePushSubscriptionFromServer(
  subscription: PushSubscription
) {
  const response = await fetch("/api/register-push", {
    method: "DELETE",
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw Error("Failed to delete push subscription from server");
  }
}
