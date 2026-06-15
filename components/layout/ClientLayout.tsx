"use client";

import Link from "next/link";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-56 bg-[#07143a] text-white">

        <div className="p-6 text-3xl font-bold">
          Owl Security
        </div>

        <nav className="mt-8 flex flex-col">

          <Link
            href="/client/dashboard"
            className="px-6 py-4 hover:bg-blue-900"
          >
            Dashboard
          </Link>

          <Link
            href="/client/reports"
            className="px-6 py-4 hover:bg-blue-900"
          >
            My Reports
          </Link>

          <Link
            href="/client/profile"
            className="px-6 py-4 hover:bg-blue-900"
          >
            My Profile
          </Link>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="text-left px-6 py-4 hover:bg-red-700"
          >
            Logout
          </button>

        </nav>

      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">

        <div className="bg-white p-4 rounded shadow mb-6">

          <div className="flex justify-between">

            <h1 className="font-bold">
              Owl Security Portal
            </h1>

            <span>
              Client
            </span>

          </div>

        </div>

        {children}

      </div>

    </div>
  );
}