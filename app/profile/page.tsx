"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getProfile } from "@/services/profileService";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const data = getProfile();
    setProfile(data);
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Profile
      </h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-lg">

        <div className="mb-4">
          <label className="font-semibold">
            Name
          </label>

          <p>{profile?.name}</p>
        </div>

        <div className="mb-4">
          <label className="font-semibold">
            Email
          </label>

          <p>
            {profile?.email}
          </p>
        </div>

        <div className="mb-4">
          <label className="font-semibold">
            Role
          </label>

          <p>
            {profile?.role}
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}