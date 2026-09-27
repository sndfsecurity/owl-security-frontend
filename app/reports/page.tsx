// app/reports/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getReports, getReportsByDateRange, downloadImage } from "@/services/reportService";
import { getClients } from "@/services/clientService";
import { FiDownload } from "react-icons/fi";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedViewImages, setSelectedViewImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);

  const [selectedClient, setSelectedClient] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterMode, setIsFilterMode] = useState(false);

  const loadReports = async (currentPage = page) => {
    try {
      setLoading(true);
      const reportsData = await getReports(currentPage, 8);
      const clientsData = await getClients();

      setReports(reportsData?.content || []);
      setTotalPages(reportsData?.totalPages || 0);
      setClients(clientsData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports(page);
  }, [page]);

  const getClientName = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.companyName : "Unknown";
  };

  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    try {
      const data = await getReportsByDateRange(
        fromDate,
        toDate,
        selectedClient ? Number(selectedClient) : undefined,
        0,
        10
      );

      setIsFilterMode(true);
      setPage(0);
      setReports(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      return;
    } catch (error) {
      console.error(error);
      alert("Failed to search reports");
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
    if (selectedViewImages.length === 0) return;

    try {
      const response = await fetch(selectedViewImages[currentImageIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-image-${currentImageIndex + 1}.jpg`;
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
              Reports
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View and manage all client reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              Total: {reports.length} reports
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Loading Reports...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Filters */}
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="">All Clients</option>
                  {(clients || []).map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.companyName}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />

                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-4 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  🔍 Search
                </button>

                <button
                  onClick={handleReset}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl px-4 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  ↺ Reset
                </button>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 p-4 md:hidden">
              {(reports || []).map((report: any) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  {/* Priority Border */}
                  <div
                    className={`h-1 w-full ${
                      report.priority === "HIGH"
                        ? "bg-red-500"
                        : report.priority === "MEDIUM"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />

                  <div className="p-4">
                    {/* Top Row */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 truncate">
                          {getClientName(report.clientId)}
                        </h3>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ml-2 flex-shrink-0 ${
                          report.priority === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : report.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {report.priority}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex gap-4 text-sm mb-3">
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Date</p>
                        <p className="font-medium text-slate-700">{report.reportDate || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Time</p>
                        <p className="font-medium text-slate-700">{report.reportTime || "N/A"}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          report.status === "INCIDENT"
                            ? "bg-red-100 text-red-700"
                            : report.status === "OBSERVATION"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    {/* Notes with Read More */}
                    <div className="mb-4">
                      <p className="text-xs text-slate-400 font-medium mb-1">Notes</p>
                      <p className="text-sm text-slate-700 line-clamp-2">
                        {report.notes || "No notes available"}
                      </p>
                      {report.notes && report.notes.length > 50 && (
                        <button
                          onClick={() => setSelectedNotes(report.notes)}
                          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Read More →
                        </button>
                      )}
                    </div>

                    {/* Attachments */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                      {report.imageUrls && report.imageUrls.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedViewImages(report.imageUrls);
                            setCurrentImageIndex(0);
                          }}
                          className="flex-1 min-w-[80px] px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                        >
                          📷 View {report.imageUrls.length > 1 && `(${report.imageUrls.length})`}
                        </button>
                      )}
                      {report.videoUrl && (
                        <button
                          onClick={() => setSelectedVideo(report.videoUrl)}
                          className="flex-1 min-w-[80px] px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                        >
                          ▶ Play
                        </button>
                      )}
                      {(!report.imageUrls || report.imageUrls.length === 0) && !report.videoUrl && (
                        <span className="text-xs text-slate-400 py-2">No Attachment</span>
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
                  <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Time</th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Notes</th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {(reports || []).map((report: any, index: number) => (
                    <tr
                      key={report.id}
                      className={`border-b border-slate-100 hover:bg-blue-50/50 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="p-4 text-sm font-medium text-slate-800">
                        {getClientName(report.clientId)}
                      </td>
                      <td className="p-4 text-sm text-slate-600">{report.reportDate || "N/A"}</td>
                      <td className="p-4 text-sm text-slate-600">{report.reportTime || "N/A"}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.status === "INCIDENT"
                              ? "bg-red-100 text-red-700"
                              : report.status === "OBSERVATION"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.priority === "HIGH"
                              ? "bg-red-100 text-red-700"
                              : report.priority === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
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
                            className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
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
                              onClick={() => setSelectedVideo(report.videoUrl)}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && reports.length > 0 && (
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
        )}

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
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl animate-scaleIn">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold text-slate-800">Video Report</h2>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all hover:shadow-md active:scale-95"
                >
                  Close
                </button>
              </div>
              <div className="p-4">
                <video controls className="w-full rounded-lg" autoPlay>
                  <source src={selectedVideo} />
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
      </div>

      <style jsx>{`
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