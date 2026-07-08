"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

import { FiDownload } from "react-icons/fi";

import { getClientById } from "@/services/clientService";

import { uploadImage }
  from "@/services/uploadService";

import {
  createReport,
  getReportsByClientId,
  deleteReport,
} from "@/services/reportService";


export default function ClientReportsPage() {
  const params = useParams();

  const clientId = Number(params.id);

  const [showForm, setShowForm] = useState(false);

  const [client, setClient] = useState<any>(null);

  const [reports, setReports] = useState<any[]>([]);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

    const [selectedVideo, setSelectedVideo] =
    useState<File | null>(null);

  const [selectedViewImage, setSelectedViewImage] =
  useState<string | null>(null);

  const [selectedViewVideo, setSelectedViewVideo] =
  useState<string | null>(null);

  const [selectedNotes, setSelectedNotes] =
  useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reportData, setReportData] =
    useState({
      reportDate: "",
      reportTime: "",
      status: "NORMAL",
      priority: "LOW",
      notes: "",
    });

  const loadClient = async () => {
    try {
      const data =
        await getClientById(clientId);

      setClient(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadReports = async (
  currentPage = page
) => {

  try {

    const data =
      await getReportsByClientId(
        clientId,
        currentPage,
        5
      );

    setReports(
      data.content
    );

    setTotalPages(
      data.totalPages
    );

  } catch (error) {

    console.error(error);

  }

};

const handleSubmit = async () => {

  if (isSubmitting) return;

  setIsSubmitting(true);

  try {

    let imagePath = "";
    let videoPath = "";

    if (selectedImage) {
      imagePath = await uploadImage(selectedImage);
    }

    if (selectedVideo) {
      videoPath = await uploadImage(selectedVideo);
    }

    await createReport({

      clientId: clientId,

      reportDate: "",

      reportTime: "",

      status: reportData.status,

      priority: reportData.priority,

      notes: reportData.notes,

      imageUrl: imagePath,

      videoUrl: videoPath,

    });

    alert("Report Saved Successfully");

    setSelectedImage(null);
    setSelectedVideo(null);

    setReportData({
      reportDate: "",
      reportTime: "",
      status: "NORMAL",
      priority: "LOW",
      notes: "",
    });

    setShowForm(false);

    loadReports();

  } catch (error) {

    console.error(error);

    alert("Failed to save report");

  } finally {

    setIsSubmitting(false);

  }

};


const handleDeleteReport =
  async (
    reportId: number
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this report?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await deleteReport(reportId);

      loadReports(page);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete report"
      );

    }

};
  
useEffect(() => {

  loadClient();

}, [clientId]);

useEffect(() => {

  loadReports(page);

}, [clientId, page]);


const handleDownloadImage = async () => {

  if (!selectedViewImage) return;

  try {

    const response = await fetch(selectedViewImage);

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

    alert("Download failed");

  }

};

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 mt-5">
        {client?.companyName} Reports
      </h1>

      <div className="mb-6">
        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm
            ? "Close Form"
            : "Create Report"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <label className="font-medium">
              Report Status:
            </label>

            <select
              value={reportData.status}
              onChange={(e) =>
                setReportData({
                  ...reportData,
                  status: e.target.value,
                })
              }
              className="border p-2 rounded">
              <option value="NORMAL">
                NORMAL
              </option>

              <option value="OBSERVATION">
                OBSERVATION
              </option>

              <option value="INCIDENT">
                INCIDENT
              </option>
            </select>

            <label className="font-medium">
              Priority:
            </label>

            <select
              value={reportData.priority}
              onChange={(e) =>
                setReportData({
                  ...reportData,
                  priority: e.target.value,
                })
              }
              className="border p-2 rounded"
            >
              <option value="LOW">
                LOW
              </option>

              <option value="MEDIUM">
                MEDIUM
              </option>

              <option value="HIGH">
                HIGH
              </option>
            </select>

          </div>

          <div className="mt-4">

            <label className="font-medium block mb-2">
              Report Notes:
            </label>

            <textarea
              value={reportData.notes}
              onChange={(e) =>
                setReportData({
                  ...reportData,
                  notes: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
              rows={4}
              placeholder="Write report notes..."
            />

          </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

  {/* Image Upload */}
  <div>
    <label className="block font-semibold text-slate-700 mb-2">
      📷 Report Image
    </label>

    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        setSelectedImage(
          e.target.files?.[0] || null
        )
      }
      className="
        w-full
        border
        border-slate-300
        rounded-xl
        p-3
        bg-white
      "
    />
  </div>

  {/* Video Upload */}
  <div>
    <label className="block font-semibold text-slate-700 mb-2">
      🎥 Report Video
    </label>

    <input
      type="file"
      accept="video/*"
      onChange={(e) =>
        setSelectedVideo(
          e.target.files?.[0] || null
        )
      }
      className="
        w-full
        border
        border-slate-300
        rounded-xl
        p-3
        bg-white
      "
    />
  </div>

</div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
             {isSubmitting ? "Submitting Report..." : "Save Report"}
          </button>
        </div>
      )}



<div className="hidden md:block mt-6 bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">
          Report History
        </h2>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
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

              <th className="p-3 text-left">
                Action
              </th>



            </tr>
          </thead>

          <tbody>
            {reports.map(
              (report: any) => (
                <tr
                  key={report.id}
                  className="border-b"
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

                  
                  <td className="p-3 max-w-[280px]">

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
                            setSelectedNotes(
                              report.notes
                            )
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

                   
                   <td className="p-3 space-x-2">

                      {report.imageUrl && (

                      <button
                      onClick={() =>
                      setSelectedViewImage(
                      report.imageUrl
                      )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                      View Image
                      </button>

                      )}

                      {report.videoUrl && (

                      <button
                      onClick={() =>
                      setSelectedViewVideo(
                      report.videoUrl
                      )
                      }
                      className="bg-purple-600 text-white px-3 py-1 rounded"
                      >
                      Play Video
                      </button>

                      )}

                      {!report.imageUrl &&
                      !report.videoUrl && (

                      <span>No Attachment</span>

                      )}

                      </td>


                    <td className="p-3">

                        <button
                          onClick={() =>
                            handleDeleteReport(
                              report.id
                            )
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded">
                          Delete
                        </button>

                      </td>

                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

<div className="md:hidden space-y-4 mt-6">

  <h2 className="text-2xl font-bold text-slate-800">
    Report History
  </h2>

  {reports.map((report: any) => (

    <div
      key={report.id}
      className="
      bg-white
      rounded-2xl
      shadow-lg
      border
      border-slate-200
      p-5
      "
    >

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <div>
          <h3 className="font-bold text-lg text-slate-800">
            CCTV Monitoring Report
          </h3>

          <p className="text-sm text-slate-500">
            {report.reportDate} • {report.reportTime}
          </p>
        </div>

        <span
          className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${
              report.status === "INCIDENT"
                ? "bg-red-100 text-red-700"
                : report.status === "OBSERVATION"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }
          `}
        >
          {report.status}
        </span>

      </div>

      {/* Details */}
      <div className="space-y-3">

        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">
            Priority
          </span>

          <span
            className={`
              font-bold
              ${
                report.priority === "HIGH"
                  ? "text-red-600"
                  : report.priority === "MEDIUM"
                  ? "text-yellow-600"
                  : "text-green-600"
              }
            `}
          >
            {report.priority}
          </span>
        </div>

        {/* Notes */}
        <div className="border-t pt-4">

          <p className="text-lg font-semibold text-slate-700 mb-2">
            Note
          </p>

          <p className="text-base leading-7 text-slate-900 break-words">
            {report.notes || "No Notes Available"}
          </p>

        </div>

      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-5">

        
        {report.imageUrl && (

          <button
          onClick={() =>
          setSelectedViewImage(
          report.imageUrl
          )
          }
          className="
          bg-blue-600
          text-white
          py-3
          rounded-xl
          font-semibold"
          >
          View Image
          </button>

          )}

          {report.videoUrl && (

          <button
          onClick={() =>
          setSelectedViewVideo(
          report.videoUrl
          )
          }
          className="
          bg-purple-600
          text-white
          py-3
          rounded-xl
          font-semibold"
          >
          Play Video
          </button>

          )}

          {!report.imageUrl &&
          !report.videoUrl && (

          <button
          disabled
          className="
          bg-slate-200
          text-slate-500
          py-3
          rounded-xl"
          >
          No Attachment
          </button>

          )}


        <button
          onClick={() =>
            handleDeleteReport(
              report.id
            )
          }
          className="
          bg-red-600
          text-white
          py-3
          rounded-xl
          font-semibold
          "
        >
          Delete
        </button>

      </div>

    </div>

  ))}

</div>


<div className="flex justify-center items-center gap-3 mt-6">

  <button
    disabled={page === 0}
    onClick={() =>
      setPage(page - 1)
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

{selectedViewImage && (

  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

    <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto mt-25">

      <div className="flex justify-end gap-3 mb-3">

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
          onClick={() => setSelectedViewImage(null)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Close
        </button>

      </div>

      <img
        src={selectedViewImage}
        alt="Report"
        className="max-w-full max-h-[65vh] rounded"
      />

    </div>

  </div>

)}


{selectedViewVideo && (

  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto mt-25">

      <div className="flex justify-end mb-3">

        <button
          onClick={() =>
            setSelectedViewVideo(null)
          }
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Close
        </button>

      </div>

      <video
        controls
        className="max-w-full max-h-[65vh] rounded"
      >
        <source
          src={selectedViewVideo}
        />
      </video>

    </div>

  </div>

)}


{selectedNotes && (

  <div className="
    fixed
    inset-0
    bg-black/60
    flex
    justify-center
    items-center
    z-50
    p-4
  ">

    <div className="
      bg-white
      rounded-2xl
      w-full
      max-w-md
      shadow-xl
    ">

      <div className="
        flex
        justify-between
        items-center
        border-b
        p-4
      ">

        <h3 className="
          font-semibold
          text-lg
        ">
          Notes
        </h3>

        <button
          onClick={() =>
            setSelectedNotes(null)
          }
          className="
            text-red-600
            font-medium
          "
        >
          Close
        </button>

      </div>

      <div className="
        p-4
        max-h-[60vh]
        overflow-y-auto
      ">

        <p className="
          text-gray-700
          whitespace-pre-wrap
          text-lg
          leading-8
        ">
          {selectedNotes}
        </p>

      </div>

    </div>

  </div>

)}
   

    </DashboardLayout>
  );
}