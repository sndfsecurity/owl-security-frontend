"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getReports,   getReportsByDateRange,  downloadImage
 } from "@/services/reportService";
import { getClients } from "@/services/clientService";

import { FiDownload } from "react-icons/fi";


export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] =
  useState<string | null>(null);

  const [selectedVideo, setSelectedVideo] =
  useState<string | null>(null);

  const [selectedNotes, setSelectedNotes] =
  useState<string | null>(null);

  const [selectedClient, setSelectedClient] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isFilterMode, setIsFilterMode] = useState(false);

  const loadReports = async (
  currentPage = page
) => {

  try {

    setLoading(true);

    const reportsData =
      await getReports(
        currentPage,
        8
      );

    const clientsData =
      await getClients();

    setReports(
  reportsData?.content || []
);

setTotalPages(
  reportsData?.totalPages || 0
);

setClients(
  clientsData || []
);
  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

};

// ADD THIS HERE

useEffect(() => {

  loadReports(page);

}, [page]);

  const getClientName = (clientId: number) => {
    const client = clients.find(
      (c) => c.id === clientId
    );

    return client
      ? client.companyName
      : "Unknown";
  };

  const handleSearch = async () => {

  if (!fromDate || !toDate) {

    alert(
      "Please select From Date and To Date"
    );

    return;
  }

  try {

    const data =
      await getReportsByDateRange(
        fromDate,
        toDate,
        selectedClient
          ? Number(selectedClient)
          : undefined,
        0,
        10
      );

      setIsFilterMode(true);

      setPage(0);
setReports(
  data?.content || []
);

setTotalPages(
  data?.totalPages || 0
);

      return;

  } catch (error) {

    console.error(error);

    alert(
      "Failed to search reports"
    );

  }
};

const handleReset = async () => {

  setSelectedClient("");
  setFromDate("");
  setToDate("");

 setIsFilterMode(false);

  setPage(0);

  loadReports(0);
};

const handleDownloadImage = async () => {

  if (!selectedImage) return;

  const imageName = selectedImage.split("/").pop();

  if (imageName) {

    await downloadImage(imageName);

  }

};

  return (
  <DashboardLayout>
    <h1 className="text-2xl  md:text-3xl font-bold mb-10 mt-5 ml-5">
      Reports
    </h1>

    {loading ? (
      <p>Loading Reports...</p>
    ) : (
      <div className="bg-white rounded-xl shadow p-4">

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-7 mt-5">

          <select
            value={selectedClient}
            onChange={(e) =>
              setSelectedClient(e.target.value)
            }
            className="border p-2 rounded w-full md:w-auto">
            <option value="">
              All Clients
            </option>

{(clients || []).map((client) => (
              <option
                key={client.id}
                value={client.id}
              >
                {client.companyName}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(e.target.value)
            }
            className="border p-2 rounded w-full md:w-auto"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(e.target.value)
            }
            className="border p-2 rounded w-full md:w-auto"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            Search
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-600 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            Reset
          </button>

        </div>

        

{/* Mobile Cards */}
<div className="grid gap-3 md:hidden">
  {(reports || []).map((report: any) => (
    <div
      key={report.id}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >

      {/* Status Border */}
      <div
        className={`h-1 w-full ${
          report.priority === "High"
            ? "bg-red-500"
            : report.priority === "Medium"
            ? "bg-yellow-500"
            : "bg-green-500"
        }`}
      />

      <div className="p-4">

        {/* Top Row */}
        <div className="flex justify-between items-start mb-3">

          <div>
            <h3 className="font-bold text-xl text-slate-900">
              {getClientName(report.clientId)}
            </h3>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-md font-medium ${
              report.priority === "High"
                ? "bg-red-50 text-red-700"
                : report.priority === "Medium"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {report.priority}
          </span>

        </div>

        {/* Date & Time */}
        <div className="flex justify-between text-sm mb-3">

          <div>
            <p className="text-gray-400 text-xs">
              Date
            </p>

            <p className="font-medium">
              {report.reportDate}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs">
              Time
            </p>

            <p className="font-medium">
              {report.reportTime}
            </p>
          </div>

        </div>

        {/* Status */}
        <div className="mb-3">

          <span
            className={`inline-flex px-3 py-1 rounded-md text-xs font-medium ${
              report.status === "Completed"
                ? "bg-green-100 text-green-700"
                : report.status === "Pending"
                ? "bg-orange-100 text-orange-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {report.status}
          </span>

        </div>

        {/* Notes */}
<div className="mb-4">

  <p className="text-xs text-gray-400 mb-1">
    Notes
  </p>

  <p className="text-sm text-gray-700 line-clamp-2">
    {report.notes || "No notes available"}
  </p>

  {report.notes && report.notes.length > 10 && (
    <button
  onClick={() =>
    setSelectedNotes(report.notes)
  }
  className="
    mt-2
    px-3
    py-1.5
    text-sm
    font-medium
    bg-green-600
    text-white
    rounded-lg
    hover:bg-green-700
    transition
    shadow-sm
  "
>
  Read More
</button>
  )}

</div>

        {/* Footer */}
        <div className="flex justify-end border-t pt-3">

          
          {report.imageUrl && (

            <button
            onClick={() =>
            setSelectedImage(
            `http://localhost:8080/uploads/${report.imageUrl}`
            )
            }
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg"
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
            className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
            Play Video
            </button>

            )}

            {!report.imageUrl && !report.videoUrl && (

            <span className="text-gray-400 text-sm">
            No Attachment
            </span>

            )}

        </div>

      </div>

    </div>
  ))}
</div>


{/* Desktop Table */}
<div className="hidden md:block overflow-x-auto">
  <table className="w-full min-w-[1000px] border-collapse">
    <thead>
      <tr className="bg-gray-100 border-b">
        <th className="p-3 text-left">Client</th>
        <th className="p-3 text-left">Date</th>
        <th className="p-3 text-left">Time</th>
        <th className="p-3 text-left">Status</th>
        <th className="p-3 text-left">Priority</th>
        <th className="p-3 text-left">Notes</th>
        <th className="p-3 text-left">Attachment</th>
      </tr>
    </thead>

    <tbody>
      {(reports || []).map((report: any) => (
        <tr
          key={report.id}
          className="border-b hover:bg-gray-50">
          <td className="p-3">
            {getClientName(report.clientId)}
          </td>
          <td className="p-3">{report.reportDate}</td>
          <td className="p-3">{report.reportTime}</td>
          <td className="p-3">{report.status}</td>
          <td className="p-3">{report.priority}</td>
          <td className="p-3 max-w-[250px]">

  <div className="break-words">

    {report.notes
      ? report.notes.substring(0, 50)
      : "No Notes"}

    {report.notes &&
      report.notes.length > 50 &&
      "..."}

  </div>

  {report.notes &&
    report.notes.length > 50 && (

      <button
  onClick={() =>
    setSelectedNotes(report.notes)
  }
  className="
    mt-2
    px-3
    py-1.5
    text-sm
    font-medium
    bg-green-600
    text-white
    rounded-lg
    hover:bg-green-700
    transition
    shadow-sm
  "
>
  Read More
</button>

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


      </div>
    )}


  <div className="flex justify-center items-center gap-3 mt-6">

  <button
    disabled={page === 0}
    onClick={() =>
      setPage(page - 1)
    }
    className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50">
    Previous
  </button>

  <span className="font-medium">

    Page {page + 1}
    {" "}
    of
    {" "}
    {totalPages}

  </span>

  <button
    disabled={
      page >= totalPages - 1
    }
    onClick={() =>
      setPage(page + 1)
    }
    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
    Next
  </button>

</div>

    {selectedImage && (

      <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 mt-25">

        <div className="bg-white p-3 rounded-lg max-w-4xl w-full">

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
              onClick={() =>
                setSelectedImage(null)
              }
              className="bg-red-600 text-white px-3 py-1 rounded">
              Close
            </button>

          </div>

          <img
            src={selectedImage}
            alt="Report"
            className="max-w-full max-h-[65vh] mx-auto rounded"
          />

        </div>

      </div>

    )}



    {selectedVideo && (

<div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 mt-25">

<div className="bg-white p-3 rounded-lg max-w-5xl w-full">

<div className="flex justify-end mb-2">

<button
onClick={() =>
setSelectedVideo(null)
}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Close
</button>

</div>

<video
controls
className="max-w-full max-h-[70vh] mx-auto rounded"
>
<source src={selectedVideo} />
</video>

</div>

</div>

)}

{selectedNotes && (

  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">

    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

      <div className="flex justify-between items-center border-b p-4">

        <h3 className="font-semibold text-lg">
          Notes
        </h3>

        <button
          onClick={() =>
            setSelectedNotes(null)
          }
          className="text-red-600 font-medium">
          Close
        </button>

      </div>

      <div className="p-4 max-h-[60vh] overflow-y-auto">

        <p className="text-gray-700 whitespace-pre-wrap text-lg leading-8">
  {selectedNotes}
</p>

      </div>

    </div>

  </div>

)}

  </DashboardLayout>
)
}