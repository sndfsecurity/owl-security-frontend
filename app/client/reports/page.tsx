"use client";

import { useEffect, useState } from "react";

import ClientLayout from "@/components/layout/ClientLayout";

import {
  getClientByUserId,
} from "@/services/clientService";

import {
  getReportsByClientId,
  getReportsByDateRange,
  downloadImage
} from "@/services/reportService";

import { FiDownload } from "react-icons/fi";


export default function ClientReportsPage() {

  const [client, setClient] = useState<any>(null);

  const [reports, setReports] = useState<any[]>([]);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [selectedImage, setSelectedImage] =
  useState<string | null>(null);

  const [selectedVideo, setSelectedVideo] =
  useState<string | null>(null);

 const [fromDate, setFromDate] = useState("");

 const [toDate, setToDate] = useState("");

const [selectedNote, setSelectedNote] =
useState<string | null>(null);

  


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
              clientData.id,
              page,
              5
            );

          setReports(reportData.content || []);

          setTotalPages(reportData.totalPages || 0); 


      } catch (error) {

        console.error(error);

      }

    };

    loadData();

 }, [page]);

  const reportList = Array.isArray(reports)
  ? reports
  : [];


  const handleSearch = async () => {

  if (!fromDate || !toDate) {
    alert("Please select both dates");
    return;
  }

  try {

    setPage(0);

    const data =
      await getReportsByDateRange(
        fromDate,
        toDate,
        client.id,
        0,
        5
      );

    setReports(data.content || []);

    setTotalPages(data.totalPages || 0);

  } catch (error) {

    console.error(error);

  }

};


const handleClear = async () => {

  setFromDate("");

  setToDate("");
  
  setPage(0);

    const reportData =
      await getReportsByClientId(
        client.id,
        0,
        5
      );

    setReports(reportData.content || []);

    setTotalPages(reportData.totalPages || 0);

};


const handleDownloadImage = async () => {

  if (!selectedImage) return;

  const imageName = selectedImage.split("/").pop();

  if (imageName) {

    await downloadImage(imageName);

  }

};

  return (
     <ClientLayout>

      <h1 className="text-3xl font-bold mb-6 mt-5">
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
  ">
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
      border-blue-100">

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
          duration-300">

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
          duration-300">

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

<div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-wrap gap-3">

  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    className="border p-2 rounded"/>

  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    className="border p-2 rounded"/>

  <button
    onClick={handleSearch}
    className="bg-blue-600 text-white px-4 py-2 rounded">
    Search
  </button>

  <button
    onClick={handleClear}
    className="bg-gray-500 text-white px-4 py-2 rounded">
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
          Attachment
        </th>

      </tr>

    </thead>

    <tbody>

{reportList.map((report:any) =>( 

        <tr
  key={report.id}
  className="border-b hover:bg-slate-50">

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

    {report.notes &&
     report.notes.length > 80 ? (
      <>
        <span>
          {report.notes.substring(0, 50)}...
        </span>

        <button
  onClick={() =>
    setSelectedNote(report.notes)
  }
  className="
    ml-2
    bg-green-600
    hover:bg-green-700
    text-white
    px-4
    py-2
    rounded-lg
    text-sm
    font-semibold
    shadow-md
    transition-all
    duration-200 ">    
  Read More
</button>
      </>
    ) : (
      report.notes || "No Notes"
    )}

  </td>

  <td className="p-3">

  <div className="flex gap-2">

    {report.imageUrl && (

      <button
        onClick={() =>
          setSelectedImage(
            `http://localhost:8080/uploads/${report.imageUrl}`
          )
        }
        className="bg-blue-600 text-white px-3 py-1 rounded">
        View Image
      </button>

    )}

    {report.videoUrl && (

      <button
        onClick={() =>
          setSelectedVideo(
            `http://localhost:8080/uploads/${report.videoUrl}`
          )
        }
        className="bg-purple-600 text-white px-3 py-1 rounded"
      >
        Play Video
      </button>

    )}

    {!report.imageUrl && !report.videoUrl && (

      <span>No Attachment</span>

    )}

  </div>

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

        {/* Notes Section */}
        <div className="bg-slate-50 rounded-xl p-3 mb-3">

          <p className="text-xs text-gray-500 mb-1">
            Notes
          </p>

          {report.notes &&
          report.notes.length > 120 ? (

            <>
              <p className="text-sm text-gray-700 break-words">
                {report.notes.substring(0, 120)}...
              </p>

              <button
                onClick={() =>
                  setSelectedNote(report.notes)
                }
                className="
                  mt-3
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-semibold
                  shadow-md
                  transition-all
                  duration-200
                "
              >
                Read More
              </button>
            </>

          ) : (

            <p className="text-sm text-gray-700 break-words">
              {report.notes || "No Notes"}
            </p>

          )}

        </div>

        {/* Image */}
        
         {report.imageUrl && (

    <button
      onClick={() =>
        setSelectedImage(
          `http://localhost:8080/uploads/${report.imageUrl}`
        )
      }
      className="w-full bg-blue-600 text-white py-2 rounded-xl"
    >
      View Image
    </button>

  )}

  {report.videoUrl && (

    <button
      onClick={() =>
        setSelectedVideo(
          `http://localhost:8080/uploads/${report.videoUrl}`
        )
      }
      className="w-full bg-purple-600 text-white py-2 rounded-xl"
    >
      Play Video
    </button>

  )}

  {!report.imageUrl && !report.videoUrl && (

    <div className="w-full bg-gray-100 text-center py-2 rounded-xl text-gray-500">
      No Attachment 
    </div>

  )}

      </div>

    </div>

  ))}

</div>

{/* pagination............. */}

<div className="flex justify-center items-center gap-4 mt-6">

  <button
    disabled={page === 0}
    onClick={() => setPage(page - 1)}
    className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50">
    Previous
  </button>

  <span className="font-medium">
    Page {page + 1} of {totalPages}
  </span>

  <button
    disabled={page >= totalPages - 1}
    onClick={() => setPage(page + 1)}
    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
    Next
  </button>

</div>


{selectedImage && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">

    <div className="bg-white rounded-2xl p-4 max-w-[95vw]">

      <div className="flex justify-end mb-3 gap-3">

        <button
              onClick={handleDownloadImage}
              className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        p-2
                        rounded-lg
                        transition
                      "
                title="Download Image">
                <FiDownload size={20} />
        </button>

        <button
          onClick={() => setSelectedImage(null)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg">
          Close
        </button>

      </div>

        <img
          src={selectedImage}
          alt="Report"
          className="max-w-full max-h-[50vh] rounded"/>

    </div>

  </div>
)}

{selectedVideo && (

  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">

    <div className="bg-white rounded-2xl p-4 max-w-[95vw]">

      <div className="flex justify-end mb-3">

        <button
          onClick={() =>
            setSelectedVideo(null)
          }
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

      <video
        controls
        className="max-w-full max-h-[65vh] rounded"

      >
        <source src={selectedVideo} />
      </video>

    </div>

  </div>

)}


{selectedNote && (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">

    <div className="bg-white rounded-xl w-full max-w-2xl p-6">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-bold">
          Report Notes
        </h2>

        <button
          onClick={() =>
            setSelectedNote(null)
          }
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>

      </div>

      <p className="whitespace-pre-wrap">
        {selectedNote}
      </p>

    </div>

  </div>
)}
    </ClientLayout>
  );
}