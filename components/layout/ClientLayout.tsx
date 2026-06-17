"use client";

import Link from "next/link";
import { useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-red-500 shadow-sm z-50">

        <div className="h-full px-4 md:px-6 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-2xl font-bold"
            >
              ☰
            </button>

            <h1 className="font-bold text-2xl md:text-3xl">
              Owl Security Portal
            </h1>

          </div>

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold">
              C
            </div>

            <span>Client</span>

          </div>

        </div>

      </header>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-16
          h-[calc(100vh-64px)]
          w-64
          bg-[#07143a]
          text-white
          z-40
          transform transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >

        <nav className="mt-4 flex flex-col">

          <Link
            href="/client/dashboard"
            className="px-6 py-4 hover:bg-blue-900 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/client/reports"
            className="px-6 py-4 hover:bg-blue-900 transition"
          >
            My Reports
          </Link>

          <Link
            href="/client/profile"
            className="px-6 py-4 hover:bg-blue-900 transition"
          >
            My Profile
          </Link>

          <button
            onClick={handleLogout}
            className="text-left px-6 py-4 hover:bg-red-700 transition"
          >
            Logout
          </button>

        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="pt-20 lg:ml-64 p-4 md:p-6">
        {children}
      </main>

    </div>
  );
}