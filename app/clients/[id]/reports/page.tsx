// app/clients/[id]/reports/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FiDownload } from "react-icons/fi";
import { getClientById } from "@/services/clientService";
import {
  uploadImages,
  uploadVideo
} from "@/services/uploadService";
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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  const imageGalleryRef = useRef<HTMLInputElement>(null);
  const imageCameraRef = useRef<HTMLInputElement>(null);
  const videoGalleryRef = useRef<HTMLInputElement>(null);
  const videoCameraRef = useRef<HTMLInputElement>(null);

  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showVideoOptions, setShowVideoOptions] = useState(false);
  const [selectedViewImages, setSelectedViewImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedViewVideo, setSelectedViewVideo] = useState<string | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reportData, setReportData] = useState({
    reportDate: "",
    reportTime: "",
    status: "NORMAL",
    priority: "LOW",
    notes: "",
  });

  const loadClient = async () => {
    try {
      const data = await getClientById(clientId);
      setClient(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadReports = async (currentPage = page) => {
    try {
      const data = await getReportsByClientId(clientId, currentPage, 5);
      setReports(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];
      let videoUrl = "";

      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(selectedImages);
      }

      if (selectedVideo) {
        videoUrl = await uploadVideo(selectedVideo);
      }

      await createReport({
        clientId: clientId,
        reportDate: "",
        reportTime: "",
        status: reportData.status,
        priority: reportData.priority,
        notes: reportData.notes,
        imageUrls: imageUrls,
        videoUrl: videoUrl,
      });

      alert("Report Saved Successfully");
      setSelectedImages([]);
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

  const handleDeleteReport = async (reportId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this report?");
    if (!confirmDelete) return;

    try {
      await deleteReport(reportId);
      loadReports(page);
    } catch (error) {
      console.error(error);
      alert("Failed to delete report");
    }
  };

  useEffect(() => {
    loadClient();
  }, [clientId]);

  useEffect(() => {
    loadReports(page);
  }, [clientId, page]);

  const handleDownloadImage = async () => {
    if (!selectedViewImages) return;

    try {
      const response = await fetch(selectedViewImages[currentImageIndex]);
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Hidden Inputs */}
        <input
          ref={imageGalleryRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setSelectedImages((prev) => {
              const updated = [...prev, ...files];
              if (updated.length > 3) {
                alert("Maximum 3 images allowed");
                return prev;
              }
              return updated;
            });
            e.target.value = "";
          }}
        />

        <input
          ref={imageCameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setSelectedImages((prev) => {
              const updated = [...prev, ...files];
              if (updated.length > 3) {
                alert("Maximum 3 images allowed");
                return prev;
              }
              return updated;
            });
            e.target.value = "";
          }}
        />

        <input
          ref={videoGalleryRef}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => {
            setSelectedVideo(e.target.files?.[0] || null);
            e.target.value = "";
          }}
        />

        <input
          ref={videoCameraRef}
          type="file"
          accept="video/*"
          capture="environment"
          hidden
          onChange={(e) => {
            setSelectedVideo(e.target.files?.[0] || null);
            e.target.value = "";
          }}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
              {client?.companyName || "Client"} Reports
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage and monitor client reports
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
            {showForm ? '✕ Close Form' : '+ Create Report'}
          </button>
        </div>

        {/* Create Report Form */}
        {showForm && (
          <div className="mb-6 sm:mb-8 animate-slideDown">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-white font-bold text-lg sm:text-xl">
                  Create New Report
                </h2>
                <p className="text-blue-100 text-sm">Fill in the report details below</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Report Status
                    </label>
                    <select
                      value={reportData.status}
                      onChange={(e) =>
                        setReportData({ ...reportData, status: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="OBSERVATION">OBSERVATION</option>
                      <option value="INCIDENT">INCIDENT</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Priority
                    </label>
                    <select
                      value={reportData.priority}
                      onChange={(e) =>
                        setReportData({ ...reportData, priority: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Report Notes
                  </label>
                  <textarea
                    value={reportData.notes}
                    onChange={(e) =>
                      setReportData({ ...reportData, notes: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={4}
                    placeholder="Write report notes..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  {/* Image Upload - Desktop */}
                  <div className="hidden md:block">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      📷 Report Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setSelectedImages((prev) => {
                          const updated = [...prev, ...files];
                          if (updated.length > 3) {
                            alert("Maximum 3 images allowed");
                            return prev;
                          }
                          return updated;
                        });
                      }}
                      className="w-full border border-slate-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Image Upload - Mobile */}
                  <div className="md:hidden">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      📷 Report Image
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowImageOptions(true)}
                      className="w-full border border-slate-300 rounded-xl p-3 bg-white text-left hover:bg-slate-50 transition-colors"
                    >
                      Upload Image
                    </button>
                  </div>

                  {/* Image Preview */}
                  {selectedImages.length > 0 && (
                    <div className="flex gap-3 mt-3 flex-wrap col-span-2">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt="preview"
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedImages(selectedImages.filter((_, i) => i !== index))
                            }
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold flex items-center justify-center shadow-md"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Video Upload - Desktop */}
                  <div className="hidden md:block">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      🎥 Report Video
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
                      className="w-full border border-slate-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Video Upload - Mobile */}
                  <div className="md:hidden">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                      🎥 Report Video
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowVideoOptions(true)}
                      className="w-full border border-slate-300 rounded-xl p-3 bg-white text-left hover:bg-slate-50 transition-colors"
                    >
                      Upload Video
                    </button>
                  </div>

                  {/* Video Preview */}
                  {selectedVideo && (
                    <div className="relative mt-3 col-span-2">
                      <video controls className="w-full max-w-xs rounded-lg border-2 border-slate-200">
                        <source src={URL.createObjectURL(selectedVideo)} />
                      </video>
                      <button
                        type="button"
                        onClick={() => setSelectedVideo(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold flex items-center justify-center shadow-md"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '⏳ Submitting...' : '💾 Save Report'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report History - Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
            <h2 className="text-xl font-bold text-slate-800">Report History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50">
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Time</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Notes</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Attachment</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report: any, index: number) => (
                  <tr
                    key={report.id}
                    className={`border-b border-slate-100 hover:bg-blue-50/50 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="p-4 text-sm font-medium text-slate-700">{report.reportDate || "N/A"}</td>
                    <td className="p-4 text-sm text-slate-600">{report.reportTime || "N/A"}</td>
                    <td className="p-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${report.status === "INCIDENT"
                          ? "bg-red-100 text-red-700"
                          : report.status === "OBSERVATION"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        }
                      `}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${report.priority === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : report.priority === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                        }
                      `}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      <div className="break-words text-sm text-slate-600">
                        {report.notes ? report.notes.substring(0, 50) : "No Notes"}
                        {report.notes && report.notes.length > 50 && "..."}
                      </div>
                      {report.notes && report.notes.length > 50 && (
                        <button
                          onClick={() => setSelectedNotes(report.notes)}
                          className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Read More
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {report.imageUrls && report.imageUrls.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectedViewImages(report.imageUrls);
                              setCurrentImageIndex(0);
                            }}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all"
                          >
                            📷 View {report.imageUrls.length > 1 && `(${report.imageUrls.length})`}
                          </button>
                        )}
                        {report.videoUrl && (
                          <button
                            onClick={() => setSelectedViewVideo(report.videoUrl)}
                            className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-all"
                          >
                            ▶ Play
                          </button>
                        )}
                        {(!report.imageUrls || report.imageUrls.length === 0) && !report.videoUrl && (
                          <span className="text-xs text-slate-400">No Attachment</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report History - Mobile Cards */}
        <div className="md:hidden space-y-4 mt-6">
          <h2 className="text-xl font-bold text-slate-800">Report History</h2>
          {reports.map((report: any) => (
            <div key={report.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Report</p>
                    <h3 className="text-base font-bold text-slate-800 mt-0.5">
                      {report.reportDate || "N/A"} • {report.reportTime || "N/A"}
                    </h3>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${report.status === "INCIDENT"
                      ? "bg-red-100 text-red-700"
                      : report.status === "OBSERVATION"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                    }
                  `}>
                    {report.status}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Priority</span>
                  <span className={`
                    font-semibold text-xs
                    ${report.priority === "HIGH"
                      ? "text-red-600"
                      : report.priority === "MEDIUM"
                      ? "text-yellow-600"
                      : "text-blue-600"
                    }
                  `}>
                    {report.priority}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Notes</span>
                  <p className="text-sm text-slate-700 break-words">
                    {report.notes || "No Notes"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {report.imageUrls && report.imageUrls.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedViewImages(report.imageUrls);
                        setCurrentImageIndex(0);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                    >
                      📷 View {report.imageUrls.length > 1 && `(${report.imageUrls.length})`}
                    </button>
                  )}
                  {report.videoUrl && (
                    <button
                      onClick={() => setSelectedViewVideo(report.videoUrl)}
                      className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                    >
                      ▶ Play
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
          >
            ← Previous
          </button>

          <span className="font-semibold text-slate-700 text-sm">
            Page {page + 1} of {totalPages || 1}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
          >
            Next →
          </button>
        </div>

        {/* Image Viewer Modal */}
        {selectedViewImages.length > 0 && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl animate-scaleIn">
              <div className="flex justify-between items-center border-b p-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Image {currentImageIndex + 1} of {selectedViewImages.length}
                  </h2>
                  <p className="text-xs text-slate-500">Click download to save</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadImage}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all hover:shadow-md active:scale-95"
                    title="Download Image"
                  >
                    <FiDownload size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedViewImages([]);
                      setCurrentImageIndex(0);
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all hover:shadow-md active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="h-[60vh] sm:h-[65vh] flex items-center justify-center bg-slate-50 p-4">
                <img
                  src={selectedViewImages[currentImageIndex]}
                  alt="Report"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              <div className="flex justify-center gap-4 p-4 border-t">
                <button
                  disabled={currentImageIndex === 0}
                  onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                  className="px-5 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  ← Previous
                </button>
                <button
                  disabled={currentImageIndex === selectedViewImages.length - 1}
                  onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Viewer Modal */}
        {selectedViewVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl animate-scaleIn">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold text-slate-800">Video Report</h2>
                <button
                  onClick={() => setSelectedViewVideo(null)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all hover:shadow-md active:scale-95"
                >
                  Close
                </button>
              </div>
              <div className="p-4">
                <video controls className="w-full rounded-lg" autoPlay>
                  <source src={selectedViewVideo} />
                </video>
              </div>
            </div>
          </div>
        )}

        {/* Notes Viewer Modal */}
        {selectedNotes && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="font-bold text-lg text-slate-800">Report Notes</h3>
                <button
                  onClick={() => setSelectedNotes(null)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <p className="text-slate-700 whitespace-pre-wrap text-base leading-7">
                  {selectedNotes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Image Upload Options Modal - Mobile */}
        {showImageOptions && (
          <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 md:hidden animate-fadeIn">
            <div className="bg-white rounded-t-3xl w-full p-5 animate-slideUp">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-bold mb-5">Upload Image</h2>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl mb-3 font-semibold transition-all active:scale-95"
                onClick={() => {
                  setShowImageOptions(false);
                  imageCameraRef.current?.click();
                }}
              >
                📷 Camera
              </button>
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl mb-3 font-semibold transition-all active:scale-95"
                onClick={() => {
                  setShowImageOptions(false);
                  imageGalleryRef.current?.click();
                }}
              >
                🖼 Gallery
              </button>
              <button
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-xl font-semibold transition-all active:scale-95"
                onClick={() => setShowImageOptions(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Video Upload Options Modal - Mobile */}
        {showVideoOptions && (
          <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 md:hidden animate-fadeIn">
            <div className="bg-white rounded-t-3xl w-full p-5 animate-slideUp">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-bold mb-5">Upload Video</h2>
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl mb-3 font-semibold transition-all active:scale-95"
                onClick={() => {
                  setShowVideoOptions(false);
                  videoCameraRef.current?.click();
                }}
              >
                🎥 Record Video
              </button>
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl mb-3 font-semibold transition-all active:scale-95"
                onClick={() => {
                  setShowVideoOptions(false);
                  videoGalleryRef.current?.click();
                }}
              >
                📁 Gallery
              </button>
              <button
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-xl font-semibold transition-all active:scale-95"
                onClick={() => setShowVideoOptions(false)}
              >
                Cancel
              </button>
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
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
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
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
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