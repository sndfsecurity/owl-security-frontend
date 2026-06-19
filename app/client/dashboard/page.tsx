"use client";

import { useEffect, useState } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { getClientByUserId } from "@/services/clientService";
import { getReportsByClientId } from "@/services/reportService";

import Link from "next/link";
export default function ClientDashboardPage() {
  const [name, setName] = useState("");
  const [client, setClient] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const storedName =
      localStorage.getItem("name") || "Client";

    setName(storedName);

    const loadData = async () => {
      try {
        const userId = Number(
          localStorage.getItem("userId")
        );

        const clientData =
          await getClientByUserId(userId);

        setClient(clientData);

        const reportData =
            await getReportsByClientId(
              clientData.id
            );

          console.log(reportData);

          setReports(reportData.content || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  
  const reportList = Array.isArray(reports)
  ? reports
  : [];

const totalReports = reportList.length;

const normalReports = reportList.filter(
  (r) => r.status === "NORMAL"
).length;

const observationReports = reportList.filter(
  (r) => r.status === "OBSERVATION"
).length;

const incidentReports = reportList.filter(
  (r) => r.status === "INCIDENT"
).length;

  return (
    <ClientLayout>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Client Dashboard
      </h1>

      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-xl shadow mb-6 border-l-4 border-blue-600">
        <p className="text-lg font-medium text-slate-700">
          Welcome {name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* Total Reports */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition duration-300">
          <h3 className="text-blue-100">
            Total Reports
          </h3>

          <p className="text-4xl font-bold mt-2">
            {totalReports}
          </p>
        </div>

        {/* Normal Reports */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition duration-300">
          <h3 className="text-green-100">
            Normal Reports
          </h3>

          <p className="text-4xl font-bold mt-2">
            {normalReports}
          </p>
        </div>

        {/* Observation Reports */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition duration-300">
          <h3 className="text-yellow-100">
            Observation Reports
          </h3>

          <p className="text-4xl font-bold mt-2">
            {observationReports}
          </p>
        </div>

        {/* Incident Reports */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition duration-300">
          <h3 className="text-red-100">
            Incident Reports
          </h3>

          <p className="text-4xl font-bold mt-2">
            {incidentReports}
          </p>
        </div>

      </div>

      {/* Client Information */}
<div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mb-6">

  <div className="mb-6">
    <h2 className="text-2xl font-bold text-slate-800">
      Client Information
    </h2>

    <p className="text-slate-500 mt-1">
      Company & Contact Details
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

    {/* Company */}
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200 hover:shadow-lg transition-all duration-300">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-blue-200 text-white flex items-center justify-center text-2xl">
          🏢
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Company Name
          </p>

          <p className="text-xl font-bold text-slate-800">
            {client?.companyName || "-"}
          </p>
        </div>

      </div>

    </div>

    {/* Contact */}
    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-5 border border-green-200 hover:shadow-lg transition-all duration-300">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-green-200 text-white flex items-center justify-center text-2xl">
          👤
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Company Owner Name
          </p>

          <p className="text-xl font-bold text-slate-800">
            {client?.contactPerson || "-"}
          </p>
        </div>

      </div>

    </div>

    {/* Email */}
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200 hover:shadow-lg transition-all duration-300">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-purple-200 text-white flex items-center justify-center text-2xl">
          📧
        </div>

        <div className="min-w-0">
          <p className="text-sm text-slate-500">
            Email Address
          </p>

          <p className="text-base font-semibold text-slate-800 break-all">
            {client?.email || "-"}
          </p>
        </div>

      </div>

    </div>

    {/* Phone */}
    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-5 border border-red-200 hover:shadow-lg transition-all duration-300">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-red-200 text-white flex items-center justify-center text-2xl">
          📞
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Phone Number
          </p>

          <p className="text-xl font-bold text-slate-800">
            {client?.phone || "-"}
          </p>
        </div>

      </div>

    </div>

  </div>

</div>

  <div className="bg-white p-6 rounded-xl shadow mt-6 border border-slate-200">

  <div className="flex items-center justify-between mb-4">

    <h2 className="text-2xl font-bold text-slate-800">
      Recent Reports
    </h2>

    <Link
      href="/client/reports"
      className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-red-800 text-red-800 bg-white text-sm font-bold rounded-xl shadow-sm hover:bg-red-800 hover:text-white transition-all duration-300"
    >
      View All Reports →
    </Link>

  </div>

  {/* Mobile View */}
  <div className="block md:hidden space-y-4">

    {reportList.slice(0, 5).map((report: any) => (
      <div
        key={report.id}
        className="border rounded-xl p-4 shadow-sm bg-slate-50"
      >
        <p>
          <strong>Date:</strong> {report.reportDate}
        </p>

        <p className="mt-2">
          <strong>Time:</strong> {report.reportTime}
        </p>

        <p className="mt-2">
          <strong>Status:</strong>

          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              report.status === "NORMAL"
                ? "bg-green-100 text-green-700"
                : report.status === "OBSERVATION"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {report.status}
          </span>
        </p>

        <p className="mt-2">
          <strong>Priority:</strong> {report.priority}
        </p>
      </div>
    ))}

  </div>

  {/* Desktop View */}
  <div className="hidden md:block overflow-x-auto">

    <table className="w-full min-w-[700px]">

      <thead>
        <tr className="bg-red-900 text-white">
          <th className="p-3 text-left">Date</th>
          <th className="p-3 text-left">Time</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Priority</th>
        </tr>
      </thead>

      <tbody>

        {reportList.slice(0, 5).map((report: any) => (

          <tr
            key={report.id}
            className="border-b hover:bg-slate-50 transition"
          >
            <td className="p-3">{report.reportDate}</td>

            <td className="p-3">{report.reportTime}</td>

            <td className="p-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  report.status === "NORMAL"
                    ? "bg-green-100 text-green-700"
                    : report.status === "OBSERVATION"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {report.status}
              </span>
            </td>

            <td className="p-3">{report.priority}</td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>
    </ClientLayout>
    
  );
}