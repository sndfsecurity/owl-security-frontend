// app/clients/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  getClients,
  createClient,
  deleteClient,
  updateClient
} from "@/services/clientService";
import {
  registerUser,
} from "@/services/authService";
import {
  resetPassword,
} from "@/services/userService";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [formErrors, setFormErrors] = useState<any>({});

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

  // Validation functions
  const validateForm = () => {
    const errors: any = {};

    // Company Name validation
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    }

    // Contact Person validation - Only letters and spaces
    const contactPersonRegex = /^[A-Za-z\s]+$/;
    if (!formData.contactPerson.trim()) {
      errors.contactPerson = "Contact person name is required";
    } else if (!contactPersonRegex.test(formData.contactPerson)) {
      errors.contactPerson = "Only letters and spaces are allowed";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Phone validation - Only 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

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
      setFormErrors({});
      setShowForm(false);
      loadClients();
    } catch (error) {
      console.error(error);
      alert("Failed to add client");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) return;

    try {
      await deleteClient(id);
      alert("Client Deleted Successfully");
      loadClients();
    } catch (error) {
      console.error(error);
      alert("Failed to delete client");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(selectedClient.userId, newPassword);
      alert("Password reset successfully");
      setShowResetModal(false);
      setNewPassword("");
    } catch (error) {
      console.error(error);
      alert("Failed to reset password");
    }
  };

  const handleStatusChange = async (client: any, status: string) => {
    try {
      await updateClient(client.id, { ...client, status });
      loadClients();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
              Clients
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your clients and their access
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`
              px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base
              transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95
              ${showForm 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
              }
            `}
          >
            {showForm ? '✕ Close Form' : '+ Add Client'}
          </button>
        </div>

        {/* Add Client Form */}
        {showForm && (
          <div className="mb-6 sm:mb-8 animate-slideDown">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-white font-bold text-lg sm:text-xl">
                  Add New Client
                </h2>
                <p className="text-blue-100 text-sm">Fill in the details below</p>
              </div>
              <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={(e) => {
                        setFormData({ ...formData, companyName: e.target.value });
                        if (formErrors.companyName) {
                          setFormErrors({ ...formErrors, companyName: "" });
                        }
                      }}
                      className={`w-full border ${
                        formErrors.companyName ? 'border-red-500' : 'border-slate-200'
                      } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    {formErrors.companyName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter contact person name"
                      value={formData.contactPerson}
                      onChange={(e) => {
                        // Only allow letters and spaces
                        const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                        setFormData({ ...formData, contactPerson: value });
                        if (formErrors.contactPerson) {
                          setFormErrors({ ...formErrors, contactPerson: "" });
                        }
                      }}
                      className={`w-full border ${
                        formErrors.contactPerson ? 'border-red-500' : 'border-slate-200'
                      } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    {formErrors.contactPerson && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.contactPerson}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) {
                          setFormErrors({ ...formErrors, email: "" });
                        }
                      }}
                      className={`w-full border ${
                        formErrors.email ? 'border-red-500' : 'border-slate-200'
                      } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter password (min 6 chars)"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (formErrors.password) {
                          setFormErrors({ ...formErrors, password: "" });
                        }
                      }}
                      className={`w-full border ${
                        formErrors.password ? 'border-red-500' : 'border-slate-200'
                      } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 10-digit phone number"
                      value={formData.phone}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: value });
                        if (formErrors.phone) {
                          setFormErrors({ ...formErrors, phone: "" });
                        }
                      }}
                      className={`w-full border ${
                        formErrors.phone ? 'border-red-500' : 'border-slate-200'
                      } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      required
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                  >
                    💾 Save Client
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormErrors({});
                    }}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Loading Clients...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">#</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Company</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact Person</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Registered On</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client: any, index: number) => (
                      <tr
                        key={client.id}
                        className={`border-b border-slate-100 hover:bg-blue-50/50 transition-colors duration-150 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="p-4 text-sm font-semibold text-slate-700">{index + 1}</td>
                        <td className="p-4 text-sm font-medium text-slate-800">{client.companyName}</td>
                        <td className="p-4 text-sm text-slate-600">{client.contactPerson}</td>
                        <td className="p-4 text-sm text-slate-600 max-w-[150px] truncate">{client.email}</td>
                        <td className="p-4 text-sm text-slate-600">{client.phone}</td>
                        <td className="p-4 text-sm text-slate-600">{formatDate(client.createdAt)}</td>
                        <td className="p-4">
                          <select
                            value={client.status}
                            onChange={(e) => handleStatusChange(client, e.target.value)}
                            className={`
                              px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer
                              transition-all duration-200 focus:ring-2 focus:ring-offset-2
                              ${client.status === 'ACTIVE' 
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus:ring-emerald-500' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                              }
                            `}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleDelete(client.id)}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => window.location.href = `/clients/${client.id}/reports`}
                              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                            >
                              Reports
                            </button>
                            <button
                              onClick={() => {
                                setSelectedClient(client);
                                setShowResetModal(true);
                              }}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                            >
                              Reset PW
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tablet View */}
            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-2 gap-4">
                {clients.map((client: any, index: number) => (
                  <div key={client.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-slate-400 font-medium">#{index + 1}</p>
                        <h3 className="text-sm font-bold text-slate-800 mt-1">{client.companyName}</h3>
                      </div>
                      <select
                        value={client.status}
                        onChange={(e) => handleStatusChange(client, e.target.value)}
                        className={`
                          px-2.5 py-1 rounded-full text-[10px] font-semibold border-0 cursor-pointer
                          ${client.status === 'ACTIVE' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                          }
                        `}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <p><span className="text-slate-400">Contact:</span> {client.contactPerson}</p>
                      <p className="truncate"><span className="text-slate-400">Email:</span> {client.email}</p>
                      <p><span className="text-slate-400">Phone:</span> {client.phone}</p>
                      <p><span className="text-slate-400">Registered:</span> {formatDate(client.createdAt)}</p>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => window.location.href = `/clients/${client.id}/reports`}
                        className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        Reports
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowResetModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        Reset PW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {clients.map((client: any, index: number) => (
                <div key={client.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">#{index + 1}</p>
                        <h3 className="text-base font-bold text-slate-800 mt-0.5">{client.companyName}</h3>
                      </div>
                      <select
                        value={client.status}
                        onChange={(e) => handleStatusChange(client, e.target.value)}
                        className={`
                          px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer
                          ${client.status === 'ACTIVE' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                          }
                        `}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-xs text-slate-400">Contact Person</span>
                      <span className="text-xs font-medium text-slate-700">{client.contactPerson}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-xs text-slate-400">Email</span>
                      <span className="text-xs font-medium text-slate-700 truncate max-w-[150px]">{client.email}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-xs text-slate-400">Phone</span>
                      <span className="text-xs font-medium text-slate-700">{client.phone}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-xs text-slate-400">Registered On</span>
                      <span className="text-xs font-medium text-slate-700">{formatDate(client.createdAt)}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => window.location.href = `/clients/${client.id}/reports`}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                    >
                      Reports
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setShowResetModal(true);
                      }}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                    >
                      Reset PW
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Reset Password Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-scaleIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Reset Password</h2>
                  <p className="text-sm text-slate-500">For {selectedClient?.companyName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                >
                  Save Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
}