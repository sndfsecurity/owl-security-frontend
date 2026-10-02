
"use client";

import { useRef, useState } from "react";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

type Incident = {
  time: string;
  branch: string;
  details: string;
  status: string;
};

const LOGO_PATH = "/LOGO.png";
const DEFAULT_FONT_SIZE = 16;

const STATUS_OPTIONS = [
  "तकनीकी समस्या",
  "सुरक्षित",
  "सामान्य",
  "काही ही हरकत नाही",
  "Manual Entry",
];

const DETAIL_OPTIONS = [
  "शॉप बंद हुई।",
  "शॉप शुरू हुई।",
  "Manual Entry",
];

const HEADING_OPTIONS = [
  "शाखा नं.",
  "Shop No.",
  "Camera No.",
  "Manual Entry",
];

const createEmptyIncident = (): Incident => ({
  time: "",
  branch: "",
  details: "",
  status: "सामान्य",
});

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

const isCustom = (value: string, options: string[]) =>
  value !== "" && !options.includes(value);

type DailySecurityReportBuilderProps = {
  onAttachPdf: (file: File) => void;
};

export default function DailySecurityReportBuilder({
  onAttachPdf,
}: DailySecurityReportBuilderProps) {

  const [shopName, setShopName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [period, setPeriod] = useState("");
  const [columnHeading, setColumnHeading] = useState("शाखा नं.");
  const [customHeading, setCustomHeading] = useState("");
  const [savedPreviewHtml, setSavedPreviewHtml] = useState("");
  const [incidents, setIncidents] = useState<Incident[]>([
    createEmptyIncident(),
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [textColor, setTextColor] = useState("#111827");
  const [bold, setBold] = useState(false);

  

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [attachingPdf, setAttachingPdf] = useState(false);

  const updateIncident = (
    index: number,
    field: keyof Incident,
    value: string
  ) => {
    setIncidents((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addIncident = () =>
    setIncidents((prev) => [...prev, createEmptyIncident()]);

  const removeIncident = (index: number) =>
    setIncidents((prev) => prev.filter((_, i) => i !== index));

  const getRows = () =>
    incidents.filter(
      (item) =>
        item.time.trim() ||
        item.branch.trim() ||
        item.details.trim() ||
        item.status.trim()
    );

  const validate = () => {
    if (!shopName.trim() || !reportDate) {
      alert("Please enter the shop name and report date.");
      return false;
    }
    return true;
  };

  const heading =
    columnHeading === "Manual Entry"
      ? customHeading.trim() || "शाखा नं."
      : columnHeading;

  const buildHtml = () => {
    const rows = getRows()
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.time || "-")}</td>
            <td>${escapeHtml(item.branch || "-")}</td>
            <td>${escapeHtml(item.details || "-")}</td>
            <td>${escapeHtml(item.status || "-")}</td>
          </tr>`
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>Daily Security Report</title>
<style>
  @page {
    size: A4;
    margin: 18mm;
  }

  * {
    box-sizing: border-box;
  }

  body {
    position: relative;
    margin: 20px;
    background: white;
    font-family: "Nirmala UI", "Mangal", Arial, sans-serif;
    font-size: ${DEFAULT_FONT_SIZE}pt;
    font-weight: normal;
    color: #111827;
    line-height: 1.6;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: url("${LOGO_PATH}");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 85% auto;
    opacity: 0.07;
    pointer-events: none;
    z-index: 0;
  }

  .page {
    position: relative;
    z-index: 1;
  }

  .report-text {
    font-family: "Nirmala UI", "Mangal", Arial, sans-serif;
    font-size: ${DEFAULT_FONT_SIZE}pt;
    font-weight: normal;
    color: #111827;
  }

  h2 {
    text-align: center;
    margin: 0 0 22px;
  }

  .date {
    text-align: right;
    margin-bottom: 18px;
  }

  .shop {
    margin-bottom: 18px;
  }

  .title {
    text-align: center;
    margin: 0 0 18px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  th, td {
    border: 1px solid #334155;
    padding: 8px 6px;
    text-align: center;
    vertical-align: middle;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  th:nth-child(1), td:nth-child(1) { width: 15%; }
  th:nth-child(2), td:nth-child(2) { width: 20%; }
  th:nth-child(3), td:nth-child(3) {
    width: 40%;
    text-align: left;
  }
  th:nth-child(4), td:nth-child(4) { width: 25%; }

  tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .signature {
    margin-top: 55px;
    text-align: right;
    break-inside: avoid;
  }

  @media print {
    body {
      margin: 0;
    }

    body::before {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    th {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
</head>
<body>
<div class="page">
  <h2 class="report-text">जय हिन्द</h2>
  <div class="date report-text">दिनांक: ${escapeHtml(reportDate)}</div>
  <div class="shop report-text">${escapeHtml(shopName)}</div>
  <div class="title report-text">दैनिक सुरक्षा रिपोर्ट${period ? " - " + escapeHtml(period) : ""}</div>

  <table>
    <thead>
      <tr>
        <th class="report-text">समय</th>
        <th class="report-text">${escapeHtml(heading)}</th>
        <th class="report-text">घटना विवरण</th>
        <th class="report-text">सुरक्षा स्थिति</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="signature report-text">
    SENIOR OFFICER<br>
    Owl Security Surveillance
  </div>
</div>
</body>
</html>`;
  };


  const preview = () => {
  if (!validate()) return;

  // If an earlier preview exists, preserve its formatting
  // and add any new rows from the form.
  if (savedPreviewHtml) {
    const savedDoc = new DOMParser().parseFromString(
      savedPreviewHtml,
      "text/html"
    );

    const freshDoc = new DOMParser().parseFromString(
      buildHtml(),
      "text/html"
    );

    const savedBody = savedDoc.querySelector("tbody");
    const freshBody = freshDoc.querySelector("tbody");

    if (savedBody && freshBody) {
      const savedRows = savedBody.querySelectorAll("tr");
      const freshRows = freshBody.querySelectorAll("tr");

      for (let i = savedRows.length; i < freshRows.length; i++) {
        savedBody.appendChild(freshRows[i].cloneNode(true));
      }

      setSavedPreviewHtml(savedDoc.documentElement.outerHTML);
    }
  }

  setShowPreview(true);
};

  const rememberSelection = () => {
    const doc = iframeRef.current?.contentDocument;
    const selection = doc?.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  const getEditor = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return null;

    doc.body.contentEditable = "true";
    doc.body.focus();

    return doc;
  };

  
  const applySelectedStyle = (
  style: "fontSize" | "color" | "bold",
  value?: string
) => {
  const doc = getEditor();
  if (!doc) return;

  const selection = doc.getSelection();
  const range = savedRangeRef.current;

  if (!selection || !range || range.collapsed) {
    alert("Please select the text you want to format.");
    return;
  }

  selection.removeAllRanges();
  selection.addRange(range);

  const wrapper = doc.createElement("span");

  // Apply only the selected formatting property.
  // Existing formatting inside the selection remains intact.
  if (style === "fontSize") {
    wrapper.style.fontSize = `${value}pt`;
  } else if (style === "color") {
    wrapper.style.color = value || "#111827";
  } else if (style === "bold") {
    wrapper.style.fontWeight = value === "true" ? "bold" : "normal";
  }

  try {
    const contents = range.extractContents();
    wrapper.appendChild(contents);
    range.insertNode(wrapper);

    const newRange = doc.createRange();
    newRange.selectNodeContents(wrapper);

    selection.removeAllRanges();
    selection.addRange(newRange);
    savedRangeRef.current = newRange.cloneRange();
  } catch {
    alert("Please select text within one paragraph or table cell.");
  }
};

  const changeFontSize = (amount: number) => {
    const next = Math.max(8, Math.min(36, fontSize + amount));
    setFontSize(next);
    applySelectedStyle("fontSize", String(next));
  };

  const toggleBold = () => {
    const next = !bold;
    setBold(next);
    applySelectedStyle("bold", String(next));
  };

  const changeColor = (color: string) => {
    setTextColor(color);
    applySelectedStyle("color", color);
  };

  const getPreviewDocument = () =>
    iframeRef.current?.contentDocument ?? null;

  const makeWordRuns = (
    node: Node,
    inherited: {
      bold?: boolean;
      color?: string;
      size?: number;
    } = {}
  ): TextRun[] => {
    const doc = getPreviewDocument();
    if (!doc) return [];

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text) return [];

      return [
        new TextRun({
          text,
          font: "Nirmala UI",
          size: inherited.size ?? DEFAULT_FONT_SIZE * 2,
          bold: inherited.bold ?? false,
          color: inherited.color ?? "111827",
        }),
      ];
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return [];

    const element = node as HTMLElement;
    const computed = doc.defaultView?.getComputedStyle(element);

    const next = {
      bold:
        computed?.fontWeight === "bold" ||
        Number(computed?.fontWeight) >= 600 ||
        inherited.bold === true,
      color: computed?.color
        ? rgbToHex(computed.color)
        : inherited.color ?? "111827",
      size: computed?.fontSize
        ? Math.round(parseFloat(computed.fontSize) * 1.5)
        : inherited.size ?? DEFAULT_FONT_SIZE * 2,
    };

    return Array.from(element.childNodes).flatMap((child) =>
      makeWordRuns(child, next)
    );
  };

  const rgbToHex = (color: string) => {
    if (color.startsWith("#")) return color.slice(1).toUpperCase();

    const values = color.match(/\d+/g);
    if (!values || values.length < 3) return "111827";

    return values
      .slice(0, 3)
      .map((value) => Number(value).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  };

  const downloadWord = async () => {
    if (!validate()) return;

    const doc = getPreviewDocument();
    if (!doc) {
      alert("Please open the report preview first.");
      return;
    }

    const border = {
      style: BorderStyle.SINGLE,
      size: 6,
      color: "64748B",
    };

    const paragraphFrom = (
      selector: string,
      alignment = AlignmentType.LEFT,
      after = 200
    ) => {
      const element = doc.querySelector(selector);
      return new Paragraph({
        alignment,
        spacing: { after },
        children: element ? makeWordRuns(element) : [],
      });
    };

    const tableElement = doc.querySelector("table");
    const tableRows = tableElement
      ? Array.from(tableElement.querySelectorAll("tr")).map(
          (tr) =>
            new TableRow({
              tableHeader: tr.parentElement?.tagName === "THEAD",
              children: Array.from(tr.querySelectorAll("th, td")).map(
                (cell) =>
                  new TableCell({
                    borders: {
                      top: border,
                      bottom: border,
                      left: border,
                      right: border,
                    },
                    margins: {
                      top: 120,
                      bottom: 120,
                      left: 100,
                      right: 100,
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: makeWordRuns(cell),
                      }),
                    ],
                  })
              ),
            })
        )
      : [];

    const report = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { width: 11906, height: 16838 },
              margin: {
                top: 1000,
                bottom: 1000,
                left: 1000,
                right: 1000,
              },
            },
          },
          children: [
            paragraphFrom("h2", AlignmentType.CENTER, 300),
            paragraphFrom(".date", AlignmentType.RIGHT, 300),
            paragraphFrom(".shop", AlignmentType.LEFT, 300),
            paragraphFrom(".title", AlignmentType.CENTER, 300),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: tableRows,
            }),
            new Paragraph({
              text: "",
              spacing: { before: 900, after: 300 },
            }),
            paragraphFrom(".signature", AlignmentType.RIGHT, 0),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(report);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `Daily-Security-Report-${reportDate}.docx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    if (!validate()) return;

    const doc = getPreviewDocument();
    if (!doc) {
      alert("Please open the report preview first.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to generate the PDF.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(
      "<!DOCTYPE html>" + doc.documentElement.outerHTML
    );
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  
  const attachPdf = async () => {
  if (!validate()) return;

  const doc = getPreviewDocument();

  if (!doc) {
    alert("Please open the report preview first.");
    return;
  }

  setAttachingPdf(true);

  const originalMargin = doc.body.style.margin;

  try {
    // Wait for fonts and images in the report preview.
    if (doc.fonts?.ready) {
      await doc.fonts.ready;
    }

    const images = Array.from(doc.images);
    await Promise.all(
      images.map((image) => {
        if (image.complete) return Promise.resolve();

        return new Promise<void>((resolve) => {
          image.onload = () => resolve();
          image.onerror = () => resolve();
        });
      })
    );

    // Use the same HTML document that the user edited.
  const html2canvas = (await import("html2canvas-pro")).default;
    const { jsPDF } = await import("jspdf");

    // Match the print layout's zero body margin.
    doc.body.style.margin = "0";

    const canvas = await html2canvas(doc.body, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: doc.documentElement.clientWidth,
      windowHeight: doc.documentElement.clientHeight,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 18;

    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    // Convert the canvas width to the PDF's printable width.
    const pixelsPerMm = canvas.width / contentWidth;
    const pageSliceHeight = Math.floor(
      contentHeight * pixelsPerMm
    );

    let y = 0;
    let pageNumber = 0;

    while (y < canvas.height) {
      const sliceHeight = Math.min(
        pageSliceHeight,
        canvas.height - y
      );

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;

      const context = pageCanvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to create PDF canvas");
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

      context.drawImage(
        canvas,
        0,
        y,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      );

      if (pageNumber > 0) {
        pdf.addPage();
      }

      const imageData = pageCanvas.toDataURL("image/jpeg", 0.98);
      const imageHeight = sliceHeight / pixelsPerMm;

      pdf.addImage(
        imageData,
        "JPEG",
        margin,
        margin,
        contentWidth,
        imageHeight
      );

      y += sliceHeight;
      pageNumber++;
    }

    const pdfBlob = pdf.output("blob");

    const pdfFile = new File(
      [pdfBlob],
      `Daily-Security-Report-${reportDate}.pdf`,
      { type: "application/pdf" }
    );

    onAttachPdf(pdfFile);
  } catch (error) {
    console.error("PDF attachment failed:", error);
    alert("Unable to generate the PDF. Please try again.");
  } finally {
    doc.body.style.margin = originalMargin;
    setAttachingPdf(false);
  }
};

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800";

  return (
    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/40 p-4">
      <h3 className="text-base font-semibold text-slate-800">
        Create Daily Security Report
      </h3>

      <p className="mt-1 text-sm text-slate-600">
        Create a separate report in Hindi, English, or both.
      </p>

      {!showPreview ? (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Shop Name
              </label>
              <input
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter shop name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Report Date
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Reporting Period
              </label>
              <input
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g. Night Shift / 12 AM to 8 AM"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Second Column Heading
                </label>
                <select
                  value={columnHeading}
                  onChange={(e) => setColumnHeading(e.target.value)}
                  className={inputClass}
                >
                  {HEADING_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {columnHeading === "Manual Entry" && (
                  <input
                    value={customHeading}
                    onChange={(e) => setCustomHeading(e.target.value)}
                    placeholder="Enter column heading"
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>

              <div className="flex items-end justify-end">
                <button
                  type="button"
                  onClick={addIncident}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  + Add Row
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Incident {index + 1}
                    </span>
                    {incidents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIncident(index)}
                        className="text-sm font-medium text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-slate-600">
                        समय / Time
                      </label>
                      <input
                        type="time"
                        step="1"
                        lang="en-GB"
                        value={incident.time}
                        onChange={(e) =>
                          updateIncident(index, "time", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-slate-600">
                        {heading}
                      </label>
                      <input
                        value={incident.branch}
                        onChange={(e) =>
                          updateIncident(index, "branch", e.target.value)
                        }
                        placeholder={`Enter ${heading}`}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-slate-600">
                        घटना विवरण / Incident Details
                      </label>
                      <select
                        value={
                          isCustom(incident.details, DETAIL_OPTIONS)
                            ? "Manual Entry"
                            : incident.details
                        }
                        onChange={(e) =>
                          updateIncident(
                            index,
                            "details",
                            e.target.value === "Manual Entry"
                              ? ""
                              : e.target.value
                          )
                        }
                        className={inputClass}
                      >
                        <option value="">Select details</option>
                        {DETAIL_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      {(incident.details === "" ||
                        isCustom(incident.details, DETAIL_OPTIONS)) && (
                        <textarea
                          value={incident.details}
                          onChange={(e) =>
                            updateIncident(index, "details", e.target.value)
                          }
                          placeholder="Enter incident details"
                          rows={2}
                          className={`${inputClass} mt-2`}
                        />
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-slate-600">
                        सुरक्षा स्थिति / Security Status
                      </label>
                      <select
                        value={
                          isCustom(incident.status, STATUS_OPTIONS)
                            ? "Manual Entry"
                            : incident.status
                        }
                        onChange={(e) =>
                          updateIncident(
                            index,
                            "status",
                            e.target.value === "Manual Entry"
                              ? ""
                              : e.target.value
                          )
                        }
                        className={inputClass}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      {(incident.status === "" ||
                        isCustom(incident.status, STATUS_OPTIONS)) && (
                        <input
                          value={incident.status}
                          onChange={(e) =>
                            updateIncident(index, "status", e.target.value)
                          }
                          placeholder="Enter security status"
                          className={`${inputClass} mt-2`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={preview}
              className="rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Preview
            </button>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <button
              type="button"
              onClick={() => changeFontSize(-1)}
              className="rounded border px-3 py-1.5 text-sm"
            >
              A-
            </button>

            <span className="text-sm text-slate-700">
              {fontSize} pt
            </span>

            <button
              type="button"
              onClick={() => changeFontSize(1)}
              className="rounded border px-3 py-1.5 text-sm"
            >
              A+
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={toggleBold}
              aria-pressed={bold}
              className={`rounded border px-3 py-1.5 text-sm ${
                bold ? "bg-blue-100 font-bold" : ""
              }`}
            >
              B
            </button>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              Text color
              <input
                type="color"
                value={textColor}
                onMouseDown={rememberSelection}
                onChange={(e) => changeColor(e.target.value)}
                className="h-8 w-10 cursor-pointer"
              />
            </label>
          </div>

          <p className="mb-3 text-xs text-slate-500">
            Select text in the report, then use the formatting options.
            To add or remove rows, click Edit.
          </p>

          <div className="mb-3 flex flex-wrap gap-3">
            <button
              type="button"
                onClick={() => {
                    const doc = iframeRef.current?.contentDocument;

                    if (doc) {
                        setSavedPreviewHtml(doc.documentElement.outerHTML);
                    }

                    setShowPreview(false);
                    }}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={downloadWord}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Download Word
            </button>

            <button
              type="button"
              onClick={downloadPdf}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Generate PDF
            </button>

            <button
                type="button"
                onClick={attachPdf}
                disabled={attachingPdf}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                {attachingPdf ? "Attaching PDF..." : "Attach PDF"}
            </button>

          </div>

       <div
          className="flex w-full justify-center overflow-hidden rounded-lg border border-slate-300 bg-white"
                style={{ height: "800px" }}
                >
                <iframe
                    ref={iframeRef}
                    title="Daily Security Report Preview"
                    srcDoc={
                    savedPreviewHtml
                        ? "<!DOCTYPE html>" + savedPreviewHtml
                        : buildHtml()
                    }
                    onLoad={() => {
                    const iframe = iframeRef.current;
                    const doc = iframe?.contentDocument;

                    if (!iframe || !doc) return;

                    doc.body.contentEditable = "true";
                    doc.addEventListener("mouseup", rememberSelection);
                    doc.addEventListener("keyup", rememberSelection);

                    const page = doc.querySelector(".page") as HTMLElement | null;
                    if (!page) return;

                    const container = iframe.parentElement;
                    if (!container) return;

                    const pageWidth = 794;
                    const updateScale = () => {
                        const scale = Math.min(1, container.clientWidth / pageWidth);

                        iframe.style.width = `${pageWidth}px`;
                        iframe.style.height = "800px";
                        iframe.style.transform = `scale(${scale})`;
                        iframe.style.transformOrigin = "top left";

                        container.style.height = `${800 * scale}px`;
                    };

                    updateScale();
                    window.addEventListener("resize", updateScale);
                    }}
                    className="block bg-white"
                    style={{
                    width: "794px",
                    height: "800px",
                    border: "0",
                    }}
                />
                </div>

        </div>
      )}
    </div>
  );
}