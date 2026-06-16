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

  const [formData, setFormData] =
    useState({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
    });


    useEffect(() => {

  const loadProfile =
    async () => {

      try {

        const userId =
          Number(
            localStorage.getItem(
              "userId"
            )
          );

        const clientData =
          await getClientByUserId(
            userId
          );

        setClient(clientData);

        setFormData({
          companyName:
            clientData.companyName,
          contactPerson:
            clientData.contactPerson,
          email:
            clientData.email,
          phone:
            clientData.phone,
        });

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  loadProfile();

}, []);



const handleUpdate =
  async () => {

    try {

     await updateClientProfile(
        client.id,
        {
          ...formData,

          status:
            client.status,

          userId:
            client.userId,
        }
      );

      alert(
        "Profile Updated Successfully"
      );

      setShowEditModal(false);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to update profile"
      );

    }

  };


  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>
      

      <div className="bg-white p-6 rounded-xl shadow max-w-2xl">

  <div className="space-y-4">

    <div>
      <strong>Company Name:</strong>
      <p>{formData.companyName}</p>
    </div>

    <div>
      <strong>Contact Person:</strong>
      <p>{formData.contactPerson}</p>
    </div>

    <div>
      <strong>Email:</strong>
      <p>{formData.email}</p>
    </div>

    <div>
      <strong>Phone:</strong>
      <p>{formData.phone}</p>
    </div>

  </div>

  <button
    onClick={() =>
      setShowEditModal(true)
    }
    className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
  >
    Edit Profile
  </button>

</div>


{showEditModal && (

<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

  <div className="bg-white p-6 rounded-xl w-full max-w-lg">

    <h2 className="text-xl font-bold mb-4">
      Edit Profile
    </h2>

    <div className="space-y-3">

      <input
        type="text"
        value={formData.companyName}
        onChange={(e) =>
          setFormData({
            ...formData,
            companyName: e.target.value
          })
        }
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        value={formData.contactPerson}
        onChange={(e) =>
          setFormData({
            ...formData,
            contactPerson: e.target.value
          })
        }
        className="border p-2 rounded w-full"
      />

      <input
          type="email"
          value={formData.email}
          disabled
          className="
            border
            p-2
            rounded
            w-full
            bg-gray-100
            cursor-not-allowed"/>

      <input
        type="text"
        value={formData.phone}
        onChange={(e) =>
          setFormData({
            ...formData,
            phone: e.target.value
          })
        }
        className="border p-2 rounded w-full"
      />

    </div>

    <div className="flex justify-end gap-3 mt-5">

      <button
        onClick={() =>
          setShowEditModal(false)
        }
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>

    </div>

  </div>

</div>

)}
   

    </ClientLayout>
  );
}