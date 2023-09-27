// @ts-check

/// <reference lib="webworker" />
/// <reference no-default-lib="true" />
/// <reference lib="esnext" />

const sw = /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (
  globalThis
);

sw.addEventListener("push", (event) => {
  const message = event.data?.json();
  const { title, body, icon, image, badge, vibrate, data } = message;
  console.log("Push received", message);

  async function handlePushEvent() {
    await sw.registration.showNotification(title, {
      body,
      icon,
      image,
      badge,
      vibrate,
      data,
      actions: [
        {
          action: "open",
          title: "Make Next Pick",
          icon: "/android-chrome-192x192.png",
        },
      ],
    });
  }

  event.waitUntil(handlePushEvent());
});

sw.addEventListener("notificationclick", async (event) => {
  console.log("Notification clicked", event);
  event.notification.close();

  async function handleNotificationClick() {
    const clients = await sw.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });
    if (clients.length > 0) {
      const client = clients[0];
      await client.focus();
      client.postMessage({
        type: "notificationclick",
        url: event.notification.data.url,
      });
    } else {
      sw.clients.openWindow(
        event.notification.data.url || "https://chainlink.st",
      );
    }
  }

  event.waitUntil(handleNotificationClick());
});
