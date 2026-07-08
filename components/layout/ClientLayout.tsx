"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setCurrentDate(
        now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );

      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateDateTime();

    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b-2 border-red-500 shadow-md z-50">
        <div className="h-full px-4 md:px-8 flex items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-3">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-3xl text-slate-800"
            >
              ☰
            </button>

            {/* Logo */}
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
              <Image
                src="/LOGO.png"
                alt="OWL Security"
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Title */}
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-slate-900">
              Owl Security Surveillance Portal
            </h1>

          </div>

          {/* Live Date & Time */}
        <div
          className="
            hidden lg:flex
            items-center
            px-6
            py-3
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-lg">

          <span className="text-slate-700 font-bold text-xl">
            {currentDate}
          </span>

          <span className="mx-3 text-slate-400 font-bold">
            |
          </span>

          <span className="text-slate-800 font-bold text-xl">
            {currentTime}
          </span>

        </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-lg">
              C
            </div>

            <span className="hidden sm:block text-lg font-medium text-slate-700">
              Client 
            </span>

          </div>

        </div> 
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-20
          h-[calc(100vh-80px)]
          w-64
          bg-[#061540]
          text-white 
          z-50
          transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      > 

        <nav className="flex flex-col pt-4">

          <Link
            href="/client/dashboard"
            className="px-6 py-4 hover:bg-blue-900 transition font-medium"
          >
            Dashboard
          </Link>

          <Link
            href="/client/reports"
            className="px-6 py-4 hover:bg-blue-900 transition font-medium"
          >
            My Reports
          </Link>

          <Link
            href="/client/profile"
            className="px-6 py-4 hover:bg-blue-900 transition font-medium"
          >
            My Profile
          </Link>

          <button
            onClick={handleLogout}
            className="text-left px-6 py-4 hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>

        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="pt-24 lg:ml-64 p-4 md:p-6">
        {children}
      </main>
 
    </div>
  );
}