"use client";

import { useEffect, useState } from "react";

import {
  enablePushNotifications,
  savePushSubscription,
  syncPushSubscription,
} from "@/services/notificationService";

export default function NotificationPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncOrShowPrompt = async () => {
      // Only clients should use notifications
      const role = localStorage.getItem("role");

      if (role !== "CLIENT") {
        return;
      }

      if (
        typeof window === "undefined" ||
        !("Notification" in window) ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        return;
      }

      try {
        // Permission already granted.
        // Do not show the popup again.
        // Just keep the subscription synced.
        if (Notification.permission === "granted") {
          await syncPushSubscription();
          return;
        }

        // User has denied notifications.
        // Do not keep asking.
        if (Notification.permission === "denied") {
          return;
        }

        // Permission has not been decided yet.
        if (Notification.permission === "default") {
          setShowPrompt(true);
        }
      } catch (error) {
        console.error(
          "Notification status check failed:",
          error
        );
      }
    };

    syncOrShowPrompt();

    // Check again when the user returns to the app.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncOrShowPrompt();
      }
    };

    const handleWindowFocus = () => {
      syncOrShowPrompt();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "focus",
      handleWindowFocus
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "focus",
        handleWindowFocus
      );
    };
  }, []);

  const handleAllowNotifications = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const subscription =
        await enablePushNotifications();

      await savePushSubscription(
        subscription
      );

      setShowPrompt(false);
    } catch (error) {
      console.error(
        "Notification setup failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLater = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }


  return (
  <div
    className="
      fixed
      inset-x-0
      top-4
      z-[9999]
      pointer-events-none
      px-3
      sm:px-4
      md:top-6
    "
  >
    <div
      className="
        pointer-events-auto
        mx-auto
        w-full
        max-w-md
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-[0_12px_40px_rgba(15,23,42,0.18)]
      "
    >
      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">

        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-100
              text-xl
              sm:h-12
              sm:w-12
              sm:text-2xl
            "
          >
            🔔
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-800 sm:text-lg">
              Stay Updated
            </h3>

            <p className="mt-1 text-sm leading-5 text-slate-600 sm:text-[15px]">
              Get notified when a new security
              report is available.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div
          className="
            mt-5
            flex
            flex-col
            gap-2.5
            sm:flex-row
            sm:gap-3
          "
        >
          <button
            type="button"
            onClick={handleAllowNotifications}
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-blue-600
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              hover:bg-blue-700
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:flex-1
            "
          >
            {loading
              ? "Enabling..."
              : "Allow Notifications"}
          </button>

          <button
            type="button"
            onClick={handleLater}
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-slate-100
              px-4
              py-3
              text-sm
              font-semibold
              text-slate-700
              transition-all
              hover:bg-slate-200
              active:scale-[0.98]
              disabled:cursor-not-allowed
              sm:w-auto
              sm:min-w-[90px]
            "
          >
            Later
          </button>
        </div>
      </div>
    </div>
  </div>
);

}