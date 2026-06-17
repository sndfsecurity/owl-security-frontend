"use client";

import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-20 left-0
          h-[calc(100vh-80px)]
          w-64
          bg-[#07143A]
          text-white
          z-50
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <nav className="p-6 pt-20">
          <ul className="space-y-6 text-lg font-medium">
            <li>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="block hover:text-blue-300"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                href="/reports"
                onClick={onClose}
                className="block hover:text-blue-300"
              >
                Reports
              </Link>
            </li>

            <li>
              <Link
                href="/clients"
                onClick={onClose}
                className="block hover:text-blue-300"
              >
                Clients
              </Link>
            </li>

            <li>
              <Link
                href="/sites"
                onClick={onClose}
                className="block hover:text-blue-300"
              >
                Sites
              </Link>
            </li>

            <li>
              <Link
                href="/profile"
                onClick={onClose}
                className="block hover:text-blue-300"
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}