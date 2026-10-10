"use client";
import { Suspense } from "react";

import dynamic from "next/dynamic";

import NotesViewer from "@/components/NotesViewer";

const PdfViewer = dynamic(
  () => import("@/components/PdfViewer"),
  { ssr: false }
);

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ClientLayout from "@/components/layout/ClientLayout";

import {
  getClientByUserId,
} from "@/services/clientService";

import {
  getSubmittedReportsByClientId,
  getSubmittedReportsByDateRange,
  downloadImage,
} from "@/services/reportService";

import { FiDownload } from "react-icons/fi";


 function  ReportsContent() {

  const [client, setClient] = useState<any>(null);

  const [reports, setReports] = useState<any[]>([]);

  const [isFilterMode, setIsFilterMode] = useState(false);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [selectedImages, setSelectedImages] =
  useState<string[]>([]);

  const [currentImageIndex, setCurrentImageIndex] =
  useState(0);

  const [selectedViewVideos, setSelectedViewVideos] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

 const [fromDate, setFromDate] = useState("");

 const [toDate, setToDate] = useState("");

const [selectedNote, setSelectedNote] =
useState<string | null>(null);

const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

const searchParams = useSearchParams();

const getPlainText = (html: string) =>
  html.replace(/<[^>]*>/g, "").trim();

const statusFilter =
  searchParams.get("status");


useEffect(() => {
  const loadData = async () => {
    try {
      const userId = Number(localStorage.getItem("userId"));

      const clientData = await getClientByUserId(userId);
      setClient(clientData);

      const reportData = isFilterMode
        ? await getSubmittedReportsByDateRange(
            fromDate,
            toDate,
            clientData.id,
            page,
            5
          )
        : await getSubmittedReportsByClientId(
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
}, [page, isFilterMode]);

 const reportList = useMemo(() => {

  const list = Array.isArray(reports)
    ? reports
    : [];

  if (!statusFilter) {
    return list;
  }

  return list.filter(
    (report) => report.status === statusFilter
  );

}, [reports, statusFilter]);
  

const handleSearch = async () => {
  if (!fromDate || !toDate) {
    alert("Please select both dates");
    return;
  }

  if (!client?.id) {
    console.error("Client information not loaded");
    return;
  }

  try {
    const data = await getSubmittedReportsByDateRange(
      fromDate,
      toDate,
      client.id,
      0,
      5
    );

    setIsFilterMode(true);
    setPage(0);
    setReports(data.content || []);
    setTotalPages(data.totalPages || 0);
  } catch (error) {
    console.error(error);
  }
};
 

const handleClear = async () => {
  setFromDate("");
  setToDate("");
  setIsFilterMode(false);
  setPage(0);

  if (!client?.id) return;

  try {
    const reportData = await getSubmittedReportsByClientId(
      client.id,
      0,
      5
    );

    setReports(reportData.content || []);
    setTotalPages(reportData.totalPages || 0);
  } catch (error) {
    console.error(error);
  }
};

const handleDownloadImage = async () => {

if (selectedImages.length === 0) return;

  try {

    const response = await fetch(
        selectedImages[currentImageIndex]
      );
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "report-image.jpg";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.error(error);

    alert("Failed to download image");

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

  <div className="relative">
    <input
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      className={`border p-2 rounded ${
        !fromDate ? "date-empty" : ""
      }`}
    />

    {!fromDate && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none">
        dd-mm-yyyy
      </span>
    )}
  </div>

  <div className="relative">
    <input
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      className={`border p-2 rounded ${
        !toDate ? "date-empty" : ""
      }`}
    />

    {!toDate && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none">
        dd-mm-yyyy
      </span>
    )}
  </div>

  <button
    onClick={handleSearch}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Search
  </button>

  <button
    onClick={handleClear}
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
  {report.notes ? (
    <>
      <span>
        {getPlainText(report.notes).substring(0, 50)}
        {getPlainText(report.notes).length > 50 ? "..." : ""}
      </span>

      {getPlainText(report.notes).length > 50 && (
        <button
          onClick={() => setSelectedNote(report.notes)}
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
            duration-200
          "
        >
          Read More
        </button>
      )}
    </>
  ) : (
    <span>No Notes</span>
  )}

  {report.pdfUrl && (
    <button
      onClick={() => setSelectedPdf(report.pdfUrl)}
      className="mt-1 block text-xs font-semibold text-red-600 hover:text-red-700"
    >
      📄 View PDF
    </button>
  )}
</td>


<td className="p-3">
  <div className="flex flex-col gap-2">
    {report.imageUrls?.length > 0 && (
      <button
        onClick={() => {
          setSelectedImages(report.imageUrls);
          setCurrentImageIndex(0);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
      >
        View Image
        {report.imageUrls.length > 1
          ? ` (${report.imageUrls.length})`
          : ""}
      </button>
    )}

    {(report.videoUrls?.length > 0 || report.videoUrl) && (
          <button
            onClick={() => {
              const videos = report.videoUrls?.length
                ? report.videoUrls
                : [report.videoUrl];

              setSelectedViewVideos(videos);
              setCurrentVideoIndex(0);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
          >
            ▶ View ({report.videoUrls?.length || 1})
          </button>
        )}

        {!report.imageUrls?.length &&
          !report.videoUrls?.length &&
          !report.videoUrl && (
            <span className="text-slate-500 text-sm">
              No Attachment
            </span>
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
      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

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
            }`}>
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
            }`}>
            {report.priority}
          </span>

        </div>

       
{/* Notes Section */}

<div className="bg-slate-50 rounded-xl p-3 mb-3">
  <p className="text-xs text-gray-500 mb-1">
    Notes
  </p>

  {report.notes ? (
    <>
      <p className="text-sm text-gray-700 break-words">
        {getPlainText(report.notes).substring(0, 100)}
        {getPlainText(report.notes).length > 100 ? "..." : ""}
      </p>

      {getPlainText(report.notes).length > 100 && (
        <button
          onClick={() => setSelectedNote(report.notes)}
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
      )}
    </>
  ) : (
    <p className="text-sm text-gray-700 break-words">
      No Notes
    </p>
  )}

  {report.pdfUrl && (
    <button
      onClick={() => setSelectedPdf(report.pdfUrl)}
      className="mt-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all"
    >
      📄 View PDF
    </button>
  )}
</div>

        {/* Image */}
        
            {report.imageUrls?.length > 0 && (

            <button
              onClick={() => {
                setSelectedImages(report.imageUrls);
                setCurrentImageIndex(0);
              }}
              className="w-full bg-blue-600 text-white py-2 rounded-xl"
            >
              View Image
              {report.imageUrls.length > 1
                ? ` (${report.imageUrls.length})`
                : ""}
            </button>

          )}

          
          {(report.videoUrls?.length > 0 || report.videoUrl) && (
              <button
                onClick={() => {
                  const videos = report.videoUrls?.length
                    ? report.videoUrls
                    : [report.videoUrl];

                  setSelectedViewVideos(videos);
                  setCurrentVideoIndex(0);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl"
              >
                ▶ View Videos ({report.videoUrls?.length || 1})
              </button>
            )}

        {/* No Attachment */}

        {!report.imageUrls?.length &&
            !report.videoUrls?.length &&
            !report.videoUrl && (
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

{selectedImages.length > 0 && (

  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">

    <div className="bg-white rounded-2xl p-4 w-full max-w-5xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <h3 className="font-semibold text-lg">
          Image {currentImageIndex + 1} of {selectedImages.length}
        </h3>

        <div className="flex gap-3">

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
            title="Download Image"
          >
            <FiDownload size={20} />
          </button>

          <button
            onClick={() => {
              setSelectedImages([]);
              setCurrentImageIndex(0);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>

        </div>

      </div>

      {/* Image */}

      <div className="flex justify-center items-center h-[60vh]">

        <img
          src={selectedImages[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          className="
            max-w-full
            max-h-full
            object-contain
            rounded-xl
          "
        />

      </div>

      {/* Footer */}

      {selectedImages.length > 1 && (

        <div className="flex justify-between items-center mt-5">

          <button
            disabled={currentImageIndex === 0}
            onClick={() =>
              setCurrentImageIndex(currentImageIndex - 1)
            }
            className="
              bg-gray-600
              text-white
              px-4
              py-2
              rounded
              disabled:opacity-50
            "
          >
            Previous
          </button>

          <div className="flex gap-2">

            {selectedImages.map((_, index) => (

              <button
                key={index}
                onClick={() =>
                  setCurrentImageIndex(index)
                }
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              />

            ))}

          </div>

          <button
            disabled={
              currentImageIndex ===
              selectedImages.length - 1
            }
            onClick={() =>
              setCurrentImageIndex(currentImageIndex + 1)
            }
            className="
              bg-blue-600
              text-white
              px-4
              py-2
              rounded
              disabled:opacity-50
            "
          >
            Next
          </button>

        </div>

      )}

    </div>

  </div>

)}


{/* Video Viewer Modal */}
{selectedViewVideos.length > 0 && (
  <div className="fixed inset-x-0 bottom-0 top-[96px] z-[9999] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5">
    <div className="flex max-h-[calc(100dvh-120px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      {/* Modal Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
        <h2 className="text-lg font-bold text-slate-800">
          Video {currentVideoIndex + 1} of {selectedViewVideos.length}
        </h2>

        <button
          type="button"
          onClick={() => {
            setSelectedViewVideos([]);
            setCurrentVideoIndex(0);
          }}
          className="flex shrink-0 items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
        >
          Close
        </button>
      </div>

      {/* Video */}
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black p-2 sm:p-4">
        <video
          key={selectedViewVideos[currentVideoIndex]}
          controls
          autoPlay
          playsInline
          className="block h-auto max-h-[calc(100dvh-220px)] w-auto max-w-full rounded-lg object-contain"
        >
          <source src={selectedViewVideos[currentVideoIndex]} />
        </video>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 border-t p-4">
        <button
          disabled={currentVideoIndex === 0}
          onClick={() => setCurrentVideoIndex(currentVideoIndex - 1)}
          className="px-5 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          ← Previous
        </button>

        <button
          disabled={currentVideoIndex === selectedViewVideos.length - 1}
          onClick={() => setCurrentVideoIndex(currentVideoIndex + 1)}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          Next →
        </button>
      </div>
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

      <div className="max-h-[60vh] overflow-y-auto">
        <NotesViewer content={selectedNote} />
      </div>

    </div>

  </div>
)}


{/* PDF Viewer Modal */}

{selectedPdf && (
  <PdfViewer
    pdfUrl={selectedPdf}
    onClose={() => setSelectedPdf(null)}
  />
)}


</ClientLayout>
  );
}   // <-- THIS MUST EXIST

export default function ClientReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsContent />
    </Suspense>
  );
}