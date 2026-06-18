"use client";

import { useEffect, useState } from "react";

import ClientLayout from "@/components/layout/ClientLayout";

import {
  getClientByUserId,
} from "@/services/clientService";

import {
  getReportsByClientId,
  getClientReportsByDate
} from "@/services/reportService";

export default function ClientReportsPage() {

  const [client, setClient] =
    useState<any>(null);

  const [reports, setReports] =
    useState<any[]>([]);

  const [selectedImage, setSelectedImage] =
  useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState("");


  const handleDateFilter = async (
  date: string
) => {

  setSelectedDate(date);

  try {

   if (!date) {

  if (client) {

    const reportData =
      await getReportsByClientId(
        client.id
      );

    console.log(reportData);

    setReports(
      Array.isArray(reportData)
        ? reportData
        : reportData?.content || []
    );

  }

  return;

}

    const formattedDate =
      date
        .split("-")
        .reverse()
        .join("-");

    const reportData =
      await getClientReportsByDate(
        client.id,
        formattedDate
      );

      

    setReports(reportData.content || []);

  } catch (error) {

    console.error(error);

  }

};

  useEffect(() => {

    const loadData = async () => {

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

        const reportData =
          await getReportsByClientId(
            clientData.id
          );

        console.log("CLIENT ID:", clientData.id);
        console.log("REPORT DATA:", reportData);

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

  return (
     <ClientLayout>

      <h1 className="text-3xl font-bold mb-6">
        My Reports
      </h1>

      {/* Client Information Card */}
<div
  className="
    bg-white
    rounded-3xl
    border-2 border-blue-100
    shadow-[0_12px_35px_rgba(59,130,246,0.08)]
    overflow-hidden
    mb-6
  "
>
  {/* Header */}
  <div
    className="
      bg-gradient-to-r
      from-white
      via-slate-50
      to-white
      px-6
      py-5
      border-b-2
      border-blue-100
    "
  >
    <h2 className="text-slate-800 text-2xl font-bold">
      Client Information
    </h2>

    <p className="text-slate-500 text-sm mt-1">
      Company Profile
    </p>
  </div>

  {/* Content */}
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {/* Company Card */}
      <div
        className="
          relative
          bg-white
          border-2
          border-blue-100
          rounded-2xl
          p-5
          shadow-[0_4px_15px_rgba(59,130,246,0.08)]
          hover:shadow-[0_12px_30px_rgba(59,130,246,0.15)]
          hover:-translate-y-1
          transition-all
          duration-300
        "
      >
        <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-500 rounded-l-2xl"></div>

        <p className="text-xs uppercase font-bold tracking-wider text-blue-600">
          Company
        </p>

        <h3 className="text-2xl font-bold text-slate-900 mt-3 break-words">
          {client?.companyName || "-"}
        </h3>
      </div>

      {/* Contact Person Card */}
      <div
        className="
          relative
          bg-white
          border-2
          border-emerald-100
          rounded-2xl
          p-5
          shadow-[0_4px_15px_rgba(16,185,129,0.08)]
          hover:shadow-[0_12px_30px_rgba(16,185,129,0.15)]
          hover:-translate-y-1
          transition-all
          duration-300
        "
      >
        <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-500 rounded-l-2xl"></div>

        <p className="text-xs uppercase font-bold tracking-wider text-emerald-600">
          Contact Person
        </p>

        <h3 className="text-2xl font-bold text-slate-900 mt-3 break-words">
          {client?.contactPerson || "-"}
        </h3>
      </div>

    </div>
  </div>
</div>

<div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
  <label className="font-medium">
    Filter By Date:
  </label>

  <input
    type="date"
    value={selectedDate}
    onChange={(e) =>
      handleDateFilter(
        e.target.value
      )
    }
    className="border p-2 rounded"
  />

  <button
    onClick={async () => {

      setSelectedDate("");

            const reportData =
        await getReportsByClientId(
          client.id
        );

      setReports(reportData.content || []);

    }}
    className="bg-gray-500 text-white px-4 py-2 rounded"
  >
    Clear
  </button>

</div>

      {/* Desktop Table */}
<div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">

  <table className="w-full min-w-[900px]">

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

        <th className="p-3 text-left">
          Notes
        </th>

        <th className="p-3 text-left">
          Image
        </th>

      </tr>

    </thead>

    <tbody>

      {reportList.map((report:any) =>( 

        <tr
          key={report.id}
          className="border-b hover:bg-slate-50"
        >

          <td className="p-3">
            {report.reportDate}
          </td>

          <td className="p-3">
            {report.reportTime}
          </td>

          <td className="p-3">
            {report.status}
          </td>

          <td className="p-3">
            {report.priority}
          </td>

          <td className="p-3">
            {report.notes}
          </td>

          <td className="p-3">

            {report.imageUrl ? (

              <button
                onClick={() =>
                  setSelectedImage(
                    `http://localhost:8080/uploads/${report.imageUrl}`
                  )
                }
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                View
              </button>

            ) : (
              <span>No Image</span>
            )}

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

{/* Mobile Cards */}
<div className="md:hidden space-y-5">

  {reportList.map((report: any) => (

    <div
      key={report.id}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
    >

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white p-3">

        <div className="flex justify-between items-center">

          <span className="font-semibold">
            {report.reportDate}
          </span>

          <span className="text-sm">
            {report.reportTime}
          </span>

        </div>

      </div>

      {/* Body */}
      <div className="p-4">

        <div className="flex justify-between items-center mb-3">

          <span className="text-gray-600 text-sm">
            Status
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold
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

        </div>

        <div className="flex justify-between items-center mb-3">

          <span className="text-gray-600 text-sm">
            Priority
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold
            ${
              report.priority === "HIGH"
                ? "bg-red-100 text-red-700"
                : report.priority === "MEDIUM"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {report.priority}
          </span>

        </div>

        <div className="bg-slate-50 rounded-xl p-3 mb-3">

          <p className="text-xs text-gray-500 mb-1">
            Notes
          </p>

          <p className="text-sm text-gray-700 break-words">
            {report.notes || "No Notes"}
          </p>

        </div>

        {report.imageUrl ? (

          <button
            onClick={() =>
              setSelectedImage(
                `http://localhost:8080/uploads/${report.imageUrl}`
              )
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
          >
            View Image
          </button>

        ) : (

          <div className="w-full bg-gray-100 text-center py-2 rounded-xl text-gray-500">
            No Image Available
          </div>

        )}

      </div>

    </div>

  ))}

</div>


{selectedImage && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">

    <div className="bg-white rounded-2xl p-4 max-w-[95vw]">

      <div className="flex justify-end mb-3">

        <button
          onClick={() => setSelectedImage(null)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

      <img
        src={selectedImage}
        alt="Report"
        className="max-h-[80vh] max-w-[90vw] rounded-lg"
      />

    </div>

  </div>
)}
    </ClientLayout>
  );
}