"use client";

import ClientLayout from "@/components/layout/ClientLayout";

export default function ClientProfilePage() {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <p>
          <strong>Name:</strong> {name}
        </p>

        <p className="mt-3">
          <strong>Email:</strong> {email}
        </p>
      </div>
    </ClientLayout>
  );
}