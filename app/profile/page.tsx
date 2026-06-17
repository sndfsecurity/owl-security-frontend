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
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            My Profile
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome to OWL Security Portal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Card */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

            <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-8">

              <div className="flex flex-col items-center">

                <div className="
                  w-28 h-28
                  rounded-full
                  bg-white
                  flex items-center
                  justify-center
                  text-5xl
                  font-bold
                  text-blue-600
                ">
                  {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <h2 className="text-white text-2xl font-bold mt-5">
                  {profile?.name}
                </h2>

                <p className="text-blue-100 mt-2 break-all text-center">
                  {profile?.email}
                </p>

                <span className="
                  mt-4
                  px-5 py-2
                  bg-white/20
                  rounded-full
                  text-white
                  font-medium
                ">
                  {profile?.role}
                </span>

              </div>

            </div>

          </div>

          {/* Right Card */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl shadow-lg p-8 h-full">

              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Profile Overview
              </h3>

              <div className="space-y-5">

                <div className="border-b pb-4">
                  <p className="text-sm text-slate-500">
                    Full Name
                  </p>

                  <p className="text-lg font-semibold text-slate-800 mt-1">
                    {profile?.name}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-slate-500">
                    Email Address
                  </p>

                  <p className="text-lg font-semibold text-slate-800 mt-1 break-all">
                    {profile?.email}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-slate-500">
                    User Role
                  </p>

                  <p className="text-lg font-semibold text-slate-800 mt-1">
                    {profile?.role}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Account Status
                  </p>

                  <span className="
                    inline-block
                    mt-2
                    px-4 py-2
                    bg-green-100
                    text-green-700
                    rounded-full
                    font-medium
                  ">
                    Active
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}