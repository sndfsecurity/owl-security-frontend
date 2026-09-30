"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfPreviewProps {
  file: File;
}

export default function PdfPreview({ file }: PdfPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const containerWidth = entries[0]?.contentRect.width;
      if (containerWidth) {
        setWidth(Math.max(100, Math.floor(containerWidth - 16)));
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-3 h-[400px] overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-2"
    >
      {error ? (
        <p className="p-4 text-center text-red-600">
          Unable to load PDF preview.
        </p>
      ) : (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setError(false);
          }}
          onLoadError={() => setError(true)}
          loading={
            <p className="p-4 text-center text-slate-600">
              Loading PDF preview...
            </p>
          }
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`preview_page_${index + 1}`}
              pageNumber={index + 1}
              width={width}
              renderTextLayer
              renderAnnotationLayer
              className="mx-auto mb-3 shadow-md"
            />
          ))}
        </Document>
      )}
    </div>
  );
}