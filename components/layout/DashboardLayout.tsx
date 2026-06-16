"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">

        <Header
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="flex-1 p-3 sm:p-4 md:p-6">
          {children}
        </main>

      </div>

    </div>
  );
}