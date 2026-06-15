"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  getClients,
  createClient,
  deleteClient,
} from "@/services/clientService";
import {
  registerUser,
} from "@/services/authService";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    password: "",
    phone: "",
    status: "ACTIVE",
  });

  const loadClients = async () => {
    try {
      const data = await getClients();

      console.log("CLIENTS:", data);

      setClients(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const user = await registerUser(
        formData.companyName,
        formData.email,
        formData.password,
        "CLIENT"
      );

      await createClient({
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        userId: user.id,
      });

      alert("Client Added Successfully");

      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        password: "",
        phone: "",
        status: "ACTIVE",
      });

      setShowForm(false);

      loadClients();
    } catch (error) {
      console.error(error);
      alert("Failed to add client");
    }
  };


  const handleDelete = async (
  id: number
) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this client?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteClient(id);

    alert("Client Deleted Successfully");

    loadClients();
  } catch (error) {
    console.error(error);

    alert("Failed to delete client");
  }
};

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Clients
        </h1>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm
            ? "Close Form"
            : "Add Client"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow mb-6"
        >
          <div className="grid grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  companyName: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />

            <input
              type="text"
              placeholder="Contact Person"
              value={formData.contactPerson}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactPerson: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />

            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
              className="border p-2 rounded"
            >
              <option value="ACTIVE">
                ACTIVE
              </option>

              <option value="INACTIVE">
                INACTIVE
              </option>
            </select>

          </div>

          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Client
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading Clients...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Contact Person</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client: any) => (
                <tr
                  key={client.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    {client.id}
                  </td>

                  <td className="p-3">
                    {client.companyName}
                  </td>

                  <td className="p-3">
                    {client.contactPerson}
                  </td>

                  <td className="p-3">
                    {client.email}
                  </td>

                  <td className="p-3">
                    {client.phone}
                  </td>

                  <td className="p-3">
                    {client.status}
                  </td>

                  <td className="p-3">
                  <button
                    onClick={() =>
                      handleDelete(client.id)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                  
                  <button
                    onClick={() =>
                      window.location.href =
                        `/clients/${client.id}/reports`
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded mr-2">
                    View Reports
                  </button>
     
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}