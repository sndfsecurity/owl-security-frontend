"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0 z-50
          w-64 bg-slate-900 text-white
          min-h-screen shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-32 md:h-40 flex items-center justify-center border-b border-slate-700">
          <Image
            src="/LOGO.png"
            alt="Owl Security Logo"
            width={130}
            height={130}
            className="object-contain w-24 md:w-32 h-auto"
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="p-4 mt-2">
          <ul className="space-y-2">

            <li>
              <Link
                href="/dashboard"
                className="block rounded-xl px-4 py-3 font-medium text-slate-200 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                href="/reports"
                className="block rounded-xl px-4 py-3 font-medium text-slate-200 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Reports
              </Link>
            </li>

            <li>
              <Link
                href="/clients"
                className="block rounded-xl px-4 py-3 font-medium text-slate-200 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Clients
              </Link>
            </li>

            <li>
              <Link
                href="/sites"
                className="block rounded-xl px-4 py-3 font-medium text-slate-200 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Sites
              </Link>
            </li>

            <li>
              <Link
                href="/profile"
                className="block rounded-xl px-4 py-3 font-medium text-slate-200 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Profile
              </Link>
            </li>

          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-6">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-sm font-semibold">
            N
          </div>
        </div>
      </aside>
    </>
  );
}