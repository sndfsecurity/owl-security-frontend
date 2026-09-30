
"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  FiDownload,
  FiZoomIn,
  FiZoomOut,
  FiX,
} from "react-icons/fi";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

export default function PdfViewer({
  pdfUrl,
  onClose,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState(false);

  const handleDownload = async () => {
  try {
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error("PDF download failed");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "report.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("PDF download error:", error);
    alert("Unable to download PDF. Please try again.");
  }
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 backdrop-blur-sm sm:p-4">
      <div className="flex h-[95dvh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:h-[85vh]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
          <h2 className="text-base font-semibold text-slate-800">
            Report PDF
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Zoom Out */}
            <button
              onClick={() =>
                setScale((s) => Math.max(0.5, s - 0.2))
              }
              disabled={scale <= 0.5}
              className="rounded-lg bg-slate-100 p-2 text-slate-700 disabled:opacity-40"
              aria-label="Zoom out"
            >
              <FiZoomOut size={18} />
            </button>

            {/* Zoom Percentage */}
            <span className="min-w-12 text-center text-sm text-slate-700">
              {Math.round(scale * 100)}%
            </span>

            {/* Zoom In */}
            <button
              onClick={() =>
                setScale((s) => Math.min(2.5, s + 0.2))
              }
              disabled={scale >= 2.5}
              className="rounded-lg bg-slate-100 p-2 text-slate-700 disabled:opacity-40"
              aria-label="Zoom in"
            >
              <FiZoomIn size={18} />
            </button>

            {/* Download */}
            
            <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white"
                >
                <FiDownload size={16} />
                <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="rounded-lg bg-red-500 p-2 text-white"
              aria-label="Close PDF"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex min-h-0 flex-1 flex-col bg-slate-100">
          <div className="flex-1 overflow-auto p-2 sm:p-4">
            {error ? (
              <p className="p-4 text-center text-red-600">
                Unable to load PDF. Please try again.
              </p>
            ) : (
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                  setError(false);
                }}
                onLoadError={() => setError(true)}
                loading={
                  <p className="p-4 text-center text-slate-600">
                    Loading PDF...
                  </p>
                }
              >
                {Array.from(
                    { length: numPages },
                    (_, index) => (
                      <div
                        key={`page_${index + 1}`}
                        className="mb-4 flex w-full justify-center"
                      >
                        <Page
                          pageNumber={index + 1}
                          scale={scale}
                          renderTextLayer
                          renderAnnotationLayer
                          className="shadow-md"
                          width={Math.min(
                            typeof window !== "undefined"
                              ? window.innerWidth - 40
                              : 700,
                            800
                          )}
                        />
                      </div>
                    )
                  )}
              </Document>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}