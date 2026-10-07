import API_BASE_URL from "./api";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  );

  const base64 = (
    base64String + padding
  )
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
}

export async function enablePushNotifications() {
  if (!("serviceWorker" in navigator)) {
    throw new Error(
      "Service Worker is not supported."
    );
  }

  if (!("PushManager" in window)) {
    throw new Error(
      "Push notifications are not supported."
    );
  }

  if (!VAPID_PUBLIC_KEY) {
    throw new Error(
      "VAPID public key is missing."
    );
  }

  const permission =
    await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error(
      "Notification permission was not granted."
    );
  }

  const registration =
    await navigator.serviceWorker.ready;

  let subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription =
      await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          urlBase64ToUint8Array(
            VAPID_PUBLIC_KEY
          ),
      });
  }

  return subscription;
}

export async function savePushSubscription(
  subscription: PushSubscription
) {
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId");

  if (!token || !clientId) {
    throw new Error(
      "User session not found."
    );
  }

  const subscriptionJson =
    subscription.toJSON();

  if (
    !subscriptionJson.endpoint ||
    !subscriptionJson.keys?.p256dh ||
    !subscriptionJson.keys?.auth
  ) {
    throw new Error(
      "Invalid push subscription."
    );
  }

  const response = await fetch(
  `${API_BASE_URL}/api/notifications/subscribe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({
          userId: Number(clientId),
          endpoint: subscriptionJson.endpoint,
          p256dh: subscriptionJson.keys.p256dh,
          auth: subscriptionJson.keys.auth,
        }),
    }
  );

  if (!response.ok) {
    const message =
      await response.text();

    throw new Error(
      message ||
        "Failed to save push subscription."
    );
  }

  return response.json();
}


export async function syncPushSubscription() {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  if (!("PushManager" in window)) {
    return false;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.error("VAPID public key is missing.");
    return false;
  }

  // User ne notification permission nahi di hai
  if (Notification.permission !== "granted") {
    return false;
  }

  const registration =
    await navigator.serviceWorker.ready;

  let subscription =
    await registration.pushManager.getSubscription();

  // Existing subscription nahi hai
  if (!subscription) {
    try {
      subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(
              VAPID_PUBLIC_KEY
            ),
        });
    } catch (error) {
      console.error(
        "Unable to create push subscription:",
        error
      );

      // Browser user interaction require kar raha ho
      // to existing Enable Notifications button use hoga.
      return false;
    }
  }

  // Current subscription ko backend ke saath sync karo
  await savePushSubscription(subscription);

  return true;
}


export async function deactivateCurrentPushSubscription() {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    return false;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  const registration =
    await navigator.serviceWorker.ready;

  const subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {
    return false;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/notifications/deactivate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to deactivate push subscription."
    );
  }

  return true;
}