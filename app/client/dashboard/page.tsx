"use client";

import { useEffect, useState } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { getClientByUserId } from "@/services/clientService";
import { getReportsByClientId } from "@/services/reportService";

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
      <div className="bg-white p-6 rounded-xl shadow border border-slate-200">

        <h2 className="text-xl font-bold mb-4 text-slate-800">
          Client Information
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Company:</strong>{" "}
            {client?.companyName}
          </p>

          <p>
            <strong>Contact:</strong>{" "}
            {client?.contactPerson}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {client?.email}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {client?.phone}
          </p>

        </div>

      </div>

      {/* Recent Reports */}
<div className="bg-white p-6 rounded-xl shadow mt-6 border border-slate-200">

  <h2 className="text-xl font-bold mb-4 text-slate-800">
    Recent Reports
  </h2>

  {/* Mobile View */}
  <div className="block md:hidden space-y-4">

    {reportList.slice(0, 5).map((report: any) => (
      <div
        key={report.id}
        className="border rounded-xl p-4 shadow-sm bg-slate-50"
      >
        <p>
          <strong>Date:</strong>{" "}
          {report.reportDate}
        </p>

        <p className="mt-2">
          <strong>Time:</strong>{" "}
          {report.reportTime}
        </p>

        <p className="mt-2">
          <strong>Status:</strong>

          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold
            ${
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
          <strong>Priority:</strong>{" "}
          {report.priority}
        </p>
      </div>
    ))}

  </div>

  {/* Desktop View */}
  <div className="hidden md:block overflow-x-auto">

    <table className="w-full min-w-[700px]">

      <thead>

        <tr className="bg-red-900 text-white">

          <th className="p-3 text-left">
            Date
          </th>

          <th className="p-3 text-left">
            Time
          </th>

          <th className="p-3 text-left">
            Status
          </th>

          <th className="p-3 text-left">
            Priority
          </th>

        </tr>

      </thead>

      <tbody>

        {reports
          .slice(0, 5)
          .map((report: any) => (

            <tr
              key={report.id}
              className="border-b hover:bg-slate-50 transition"
            >

              <td className="p-3">
                {report.reportDate}
              </td>

              <td className="p-3">
                {report.reportTime}
              </td>

              <td className="p-3">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
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

              <td className="p-3">
                {report.priority}
              </td>

            </tr>

          ))}

      </tbody>

    </table>

  </div>

</div>
    </ClientLayout>
  );
}