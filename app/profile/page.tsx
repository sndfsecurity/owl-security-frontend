// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getProfile } from "@/services/profileService";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">

        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
                My Profile
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                Welcome to OWL Security Portal
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* Left Card - Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-violet-300 rounded-full blur-md opacity-75"></div>
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center text-4xl sm:text-5xl font-bold text-blue-600 shadow-xl">
                      {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    {/* Status dot */}
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-md"></div>
                  </div>

                  <h2 className="text-white text-xl sm:text-2xl font-bold mt-4 sm:mt-5 text-center">
                    {profile?.name || "User"}
                  </h2>

                  <p className="text-blue-100 text-sm sm:text-base mt-1.5 break-all text-center px-2">
                    {profile?.email || "user@example.com"}
                  </p>

                  <span className="mt-3 sm:mt-4 px-4 sm:px-5 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium border border-white/10">
                    {profile?.role || "User"}
                  </span>

                  <div className="mt-4 sm:mt-5 flex gap-2">
                    <span className="px-3 py-1 bg-emerald-400/20 backdrop-blur-sm rounded-full text-emerald-100 text-[10px] sm:text-xs font-medium border border-emerald-400/20">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-1 p-3 sm:p-4 bg-slate-50">
                <div className="text-center p-2">
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider">Role</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5 truncate">{profile?.role || "-"}</p>
                </div>
                <div className="text-center p-2 border-l border-slate-200">
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider">Status</p>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-600 mt-0.5">Active</p>
                </div>
                <div className="text-center p-2 border-l border-slate-200">
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider">ID</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5 truncate">#001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 h-full hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Profile Overview
                </h3>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="group p-4 sm:p-5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 border border-slate-100 hover:border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Full Name
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-slate-800 mt-1">
                        {profile?.name || "Not set"}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="group p-4 sm:p-5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 border border-slate-100 hover:border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Email Address
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-slate-800 mt-1 break-all">
                        {profile?.email || "Not set"}
                      </p>
                    </div>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
                      ✓ Verified
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 border border-slate-100 hover:border-blue-200">
                    <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">
                      User Role
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                        {profile?.role || "User"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 border border-slate-100 hover:border-blue-200">
                    <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider">
                      Account Status
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-emerald-600">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional info */}
                <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Last Login
                      </p>
                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        {new Date().toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Member Since
                      </p>
                      <p className="text-sm font-semibold text-slate-700 mt-1">
                        {new Date().toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}