"use client";

import Image from "next/image";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="h-20 md:h-28 lg:h-40 bg-slate-200 border-b border-slate-400 flex items-center justify-between px-4 md:px-8 shadow-sm">

      {/* Left Section */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden bg-slate-900 text-white p-2 rounded-lg shadow-lg"
        >
          ☰
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden">
          <Image
            src="/LOGO.png"
            alt="Owl Security Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-base sm:text-lg md:text-3xl lg:text-5xl font-extrabold tracking-wide leading-tight">
          <span className="text-slate-900">OWL</span>{" "}
          <span className="text-blue-600">SECURITY</span>
         <span className="text-slate-700">
  {" "}PORTAL
</span>
        </h1>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">

        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-xl shadow-md">
          A
        </div>

        <span className="hidden sm:block text-slate-800 font-semibold text-base md:text-xl">
          Admin
        </span>

      </div>

    </header>
  );
}