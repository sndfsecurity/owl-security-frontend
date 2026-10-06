"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiFileText,
  FiUser,
  FiLogOut,
  FiX,
} from "react-icons/fi";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const date = now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setCurrentTime(`${date} | ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/client/dashboard",
      icon: <FiHome size={20} />,
    },
    {
      name: "My Reports",
      href: "/client/reports",
      icon: <FiFileText size={20} />,
    },
    {
      name: "My Profile",
      href: "/client/profile",
      icon: <FiUser size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200/80 shadow-sm backdrop-blur-md bg-white/95">
        <div className="h-16 sm:h-20 md:h-24 lg:h-28 flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto">

          {/* Left Side */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 min-w-0">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="lg:hidden bg-gradient-to-br from-slate-800 to-slate-900 text-white p-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-xl"></div>
              <Image
                src="/LOGO.png"
                alt="OWL Security Logo"
                width={120}
                height={120}
                priority
                className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain drop-shadow-lg"
              />
            </div>

            {/* Title */}
            <div className="min-w-0">
              <h1 className="font-extrabold leading-tight tracking-tight">
                <span className="text-xs sm:text-base md:text-2xl lg:text-3xl xl:text-4xl whitespace-nowrap">
                  <span className="text-slate-800">OWL </span>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    SECURITY
                  </span>
                  <span className="text-slate-800"> Surveillance</span>
                </span>
                <span className="hidden sm:inline text-xs sm:text-base md:text-2xl lg:text-3xl xl:text-4xl whitespace-nowrap">
                  <span className="text-slate-800"> </span>
                  <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    PORTAL
                  </span>
                </span>
              </h1>
              {/* Mobile subtitle */}
              <div className="sm:hidden text-[8px] font-semibold text-slate-400 tracking-wider mt-0.5">
                CLIENT PANEL
              </div>
            </div>

          </div>

          {/* Desktop Date & Time - Hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 group">
              <div className="flex items-center gap-2 sm:gap-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-xs sm:text-sm lg:text-base font-semibold tracking-wide text-slate-700 group-hover:text-slate-900 transition-colors whitespace-nowrap">
                  {currentTime}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Client Info & Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-shrink-0">
            
            {/* Client Info - Hidden on mobile */}
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-800 tracking-wide">
                Client
              </span>
              <span className="text-[8px] sm:text-[10px] md:text-xs text-slate-500 font-medium">
                Phoenix Mall Pune
              </span>
            </div>

            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500"></div>
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <span className="relative z-10">C</span>
              </div>
              {/* Status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 border-2 border-white rounded-full"></div>
            </div>

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
          fixed top-20 left-0
          h-[calc(100vh-80px)]
          w-64
          bg-gradient-to-b
          from-[#07143A]
          via-[#061332]
          to-[#04102d]
          text-white
          z-50
          shadow-2xl
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        {/* Close Button - Only visible on mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          aria-label="Close menu"
        >
          <FiX size={24} />
        </button>

        <nav className="h-full flex flex-col px-4 pt-20 pb-5">
          <ul className="space-y-5 flex-1">
            {menuItems.map((item) => {
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group
                      flex
                      items-center
                      gap-3
                      px-5
                      py-3.5
                      rounded-xl
                      text-[18px]
                      font-semibold
                      tracking-[1px]
                      transition-all
                      duration-200
                      text-white
                      hover:bg-white/10
                      hover:text-blue-300
                      hover:translate-x-1
                      hover:shadow-lg
                    `}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-white/10 my-5"></div>

          <button
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-gradient-to-r
              from-red-600
              to-red-500
              hover:from-red-700
              hover:to-red-600
              text-white
              font-semibold
              tracking-wide
              py-3.5
              text-[18px]
              rounded-xl
              shadow-lg
              transition-all
              duration-200
              hover:scale-[1.02]
            "
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="lg:ml-64 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}  