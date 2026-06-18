"use client";

import ClientLayout from "@/components/layout/ClientLayout";
import { useEffect, useState } from "react";
import {
  getClientByUserId,
  updateClientProfile,
} from "@/services/clientService";

export default function ClientProfilePage() {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));

        const clientData = await getClientByUserId(userId);

        setClient(clientData);

        setFormData({
          companyName: clientData.companyName || "",
          contactPerson: clientData.contactPerson || "",
          email: clientData.email || "",
          phone: clientData.phone || "",
        });
      } catch (error) {
        console.error(error);
      } finally { 
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await updateClientProfile(client.id, {
        ...formData,
        status: client.status,
        userId: client.userId,
      });

      setClient({
        ...client,
        ...formData,
      });

      alert("Profile Updated Successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    <ClientLayout>
<div className="min-h-screen bg-slate-50 p-4 md:p-6 mt-10">        
        {/* Header */}
        <div className="mb-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h1 className="text-3xl font-bold text-slate-800">
            My Profile
          </h1>

          <p className="text-slate-500 mt-2">
            View and manage your profile information
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Profile Header */}
              <div className="bg-blue-50 border-b border-slate-200 px-6 md:px-8 py-6">

                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4">

                  <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center shadow-sm">

                    <span className="text-2xl font-bold text-blue-700">
                      {formData.companyName?.charAt(0).toUpperCase()}
                    </span>

                  </div>

                  <div className="text-center sm:text-left">

                    <h2 className="text-2xl font-semibold text-slate-800">
                      {formData.companyName}
                    </h2>

                    <p className="text-slate-500">
                      Client Profile
                    </p>

                  </div>

                </div>

              </div>

              {/* Profile Details */}
              <div className="p-6 md:p-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">
                      Contact Person
                    </label>

                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm text-slate-800">
                      {formData.contactPerson}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">
                      Email Address
                    </label>

                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm text-slate-800 break-all">
                      {formData.email}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-500 mb-2">
                      Phone Number
                    </label>

                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm text-slate-800">
                      {formData.phone}
                    </div>
                  </div>

                </div>

                <div className="flex justify-end mt-8">

                  <button
                    onClick={() => setShowEditModal(true)}
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-6
                      py-3
                      rounded-xl
                      font-medium
                      shadow-sm
                      transition-all
                    "
                  >
                    Edit Profile
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

              {/* Modal Header */}
              <div className="bg-blue-50 border-b border-slate-200 px-6 py-5">

                <h2 className="text-xl font-semibold text-slate-800">
                  Edit Profile
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update your company details
                </p>

              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Company Name
                  </label>

                  <input
                    type="text"
                    value={formData.companyName} 
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        companyName: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Contact Person
                  </label>

                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-slate-200">

                <button
                  onClick={() => setShowEditModal(false)}
                  className="
                    px-5
                    py-2.5
                    bg-slate-200
                    hover:bg-slate-300
                    text-slate-700
                    rounded-xl
                    font-medium
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="
                    px-5
                    py-2.5
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    rounded-xl
                    font-medium
                  "
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </ClientLayout>
  );
}