"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
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

  return (
    <header className="sticky top-0 z-[100] h-20 md:h-24 lg:h-28 bg-slate-200 border-b-2 border-red-400 shadow-sm">

      <div className="h-full flex items-center justify-between px-3 sm:px-4 md:px-8">

        {/* Left Side */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5 min-w-0">

          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="lg:hidden bg-slate-900 text-white p-2 rounded-lg shadow flex-shrink-0"
          >
            ☰
          </button>

          <Image
            src="/LOGO.png"
            alt="OWL Security Logo"
            width={120}
            height={120}
            priority
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain flex-shrink-0"
          />

          <div className="min-w-0">

            <h1 className="font-extrabold leading-tight text-sm sm:text-xl md:text-4xl lg:text-5xl whitespace-nowrap">
              <span className="text-slate-900">OWL </span>
              <span className="text-blue-600">SECURITY</span>
              <span className="text-slate-900"> PORTAL</span>
            </h1>

           
          </div>

        </div>

        {/* Desktop Date & Time Only */}
        <div className="hidden md:flex flex-1 justify-center">

          <div className="bg-white border border-slate-300 rounded-xl px-5 py-2 shadow-sm">

            <span className="text-sm lg:text-base font-semibold text-slate-700 whitespace-nowrap">
              {currentTime}
            </span>

          </div>

        </div>

        {/* Avatar */}
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-base shadow flex-shrink-0">
          A
        </div>

      </div>

    </header>
  );
}