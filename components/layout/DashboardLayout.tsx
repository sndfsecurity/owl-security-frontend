"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

import NotificationPermissionPrompt from "@/components/NotificationPermissionPrompt";

export default function DashboardLayout({

  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);


    useEffect(() => {
  const checkSession = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      const payload = JSON.parse(
        atob(
          token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      );

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp <= currentTime) {
        localStorage.clear();
        window.location.replace("/login");
      }
    } catch {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  checkSession();

  const interval = setInterval(checkSession, 1000);

  return () => clearInterval(interval);
}, []);


return (
  <div className="min-h-screen bg-slate-100">
    <NotificationPermissionPrompt />

    <Header
      onMenuClick={() =>
        setSidebarOpen(true)
      }
    />

    <Sidebar
      isOpen={sidebarOpen}
      onClose={() =>
        setSidebarOpen(false)
      }
    />

    <main className="p-4 lg:ml-64">
      {children}
    </main>
  </div>
);

  
} 