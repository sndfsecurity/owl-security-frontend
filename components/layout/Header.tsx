"use client";

import Image from "next/image";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[100] h-20 md:h-24 bg-slate-200 border-b-2 border-red-400 shadow-sm">
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
            width={80}
            height={80}
            priority
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain flex-shrink-0"
          />

          <h1 className="font-bold leading-tight text-sm sm:text-lg md:text-2xl lg:text-3xl whitespace-nowrap">
            <span className="text-slate-900">OWL </span>
            <span className="text-blue-600">SECURITY</span>
            <span className="text-slate-900"> PORTAL</span>
          </h1>
        </div>

        {/* Right Side */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
          A
        </div>

      </div>
    </header>
  );
}