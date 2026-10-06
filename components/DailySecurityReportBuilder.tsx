
"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

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

type VehicleRow = {
  vehicleType: string;
  customVehicleType: string;
  inside: string;
  outside: string;
};

const LOGO_PATH = "/LOGO.png";
const DEFAULT_FONT_SIZE = 16;


const STATUS_OPTIONS = [
  "तकनीकी समस्या",
  "सुरक्षित",
  "सामान्य",
  "कोई भी हरकत नही",
  "Manual Entry",
];

const DETAIL_OPTIONS = [
  "शॉप बंद हुई।",
  "शॉप शुरू हुई।",
  "लापरवाही|",
  "Manual Entry",
];

const HEADING_OPTIONS = [
  "शाखा नं.",
  "Shop No.",
  "Camera No.",
  "Manual Entry",
];

const SHOP_NAME_OPTIONS = [
  "HOTEL",
  "Jewellery shop",
  "Kumkum sosayti",
  "Phone docter",
  "HOTEL comfort",
  "First visit",
  "Garment Shop",
  "Gold shop",
  "Home",
  "JB wine shop",
  "Medical shop",
  "रेणुका ऑटो आळंदी फाटा",
  "रेणुका ऑटो आंबेठाण",
  "Airking",
  "Manual Entry",
];

const VEHICLE_TYPE_OPTIONS = [
  "बाइक",
  "स्कूटी",
  "कार",
  "पिकअप",
  "छोटा हाथी",
  "आयशर",
  "टेम्पो",
  "पानी का टैंकर",
  "Manual Entry",
];

const createEmptyIncident = (): Incident => ({
  time: "",
  branch: "",
  details: "",
  status: "सामान्य",
});

const createEmptyVehicleRow = (): VehicleRow => ({
  vehicleType: "",
  customVehicleType: "",
  inside: "",
  outside: "",
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

  const formatReportDate = (value: string) => {
  if (!value) return "";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}-${month}-${year}`;
};

const isCustom = (value: string, options: string[]) =>
  value !== "" && !options.includes(value);

export type DailySecurityReportBuilderRef = {
  getDraftData: () => string;
};

type DailySecurityReportBuilderProps = {
  onAttachPdf: (file: File) => void;
  initialDraftData?: string | null;
};

const DailySecurityReportBuilder = forwardRef<
  DailySecurityReportBuilderRef,
  DailySecurityReportBuilderProps
>(function DailySecurityReportBuilder(
  { onAttachPdf, initialDraftData },
  ref
) {

  const [shopName, setShopName] = useState("");
  const [shopNameMode, setShopNameMode] = useState("");
  const [customShopName, setCustomShopName] = useState("");
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

  const [showSecondTable, setShowSecondTable] = useState(false);
  const [vehicleRows, setVehicleRows] = useState<VehicleRow[]>([
    createEmptyVehicleRow(),
  ]);

    useEffect(() => {

      if (!initialDraftData) {
          setShopName("");
          setShopNameMode("");
          setCustomShopName("");
          setShowSecondTable(false);
          setVehicleRows([createEmptyVehicleRow()]);
          return;
        }

    try {
      const draft = JSON.parse(initialDraftData);

      const savedShopName = draft.shopName ?? "";

      setShopName(savedShopName);

      if (SHOP_NAME_OPTIONS.includes(savedShopName)) {
        setShopNameMode(savedShopName);
        setCustomShopName("");
      } else if (savedShopName) {
        setShopNameMode("Manual Entry");
        setCustomShopName(savedShopName);
      } else {
        setShopNameMode("");
        setCustomShopName("");
      }

      setReportDate(draft.reportDate ?? "");
      setPeriod(draft.period ?? "");
      setColumnHeading(draft.columnHeading ?? "शाखा नं.");
      setCustomHeading(draft.customHeading ?? "");
      setSavedPreviewHtml(draft.savedPreviewHtml ?? "");

      setIncidents(
        Array.isArray(draft.incidents) && draft.incidents.length > 0
          ? draft.incidents
          : [createEmptyIncident()]
      );

      setShowSecondTable(Boolean(draft.showSecondTable));

        setVehicleRows(
          Array.isArray(draft.vehicleRows) && draft.vehicleRows.length > 0
            ? draft.vehicleRows
            : [createEmptyVehicleRow()]
        );

      setShowPreview(Boolean(draft.showPreview));

      setFontSize(
        typeof draft.fontSize === "number"
          ? draft.fontSize
          : DEFAULT_FONT_SIZE
      );

      setTextColor(
        typeof draft.textColor === "string"
          ? draft.textColor
          : "#111827"
      );

      setBold(Boolean(draft.bold));
    } catch (error) {
      console.error("Failed to restore Daily Security Report draft:", error);
    }
  }, [initialDraftData]);


    const getDraftData = () => {
    const currentDocument = iframeRef.current?.contentDocument;

    const currentPreviewHtml =
      showPreview && currentDocument
        ? currentDocument.documentElement.outerHTML
        : savedPreviewHtml;

    return JSON.stringify({
      version: 1,
      shopName,
      reportDate,
      period,
      columnHeading,
      customHeading,
      savedPreviewHtml: currentPreviewHtml,
      incidents,
      showSecondTable,
      vehicleRows,
      showPreview,
      fontSize,
      textColor,
      bold,
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      getDraftData,
    }),
    [
      shopName,
      reportDate,
      period,
      columnHeading,
      customHeading,
      savedPreviewHtml,
      incidents,
      showSecondTable,
      vehicleRows,
      showPreview,
      fontSize,
      textColor,
      bold,
    ]
  );

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

  const updateVehicleRow = (
  index: number,
  field: keyof VehicleRow,
  value: string
) => {
  setVehicleRows((prev) =>
    prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
  );
};

const addVehicleRow = () => {
  setVehicleRows((prev) => [
    ...prev,
    createEmptyVehicleRow(),
  ]);
};

const removeVehicleRow = (index: number) => {
  setVehicleRows((prev) =>
    prev.filter((_, i) => i !== index)
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

    const totalInside = vehicleRows.reduce(
  (total, row) => total + (Number(row.inside) || 0),
  0
);

const totalOutside = vehicleRows.reduce(
  (total, row) => total + (Number(row.outside) || 0),
  0
);

const vehicleRowsHtml = showSecondTable
  ? `
      ${vehicleRows
        .map((item) => {
          const vehicleType =
            item.vehicleType === "Manual Entry"
              ? item.customVehicleType
              : item.vehicleType;

          return `
            <tr>
              <td>${escapeHtml(vehicleType || "-")}</td>
              <td>${escapeHtml(item.inside || "-")}</td>
              <td>${escapeHtml(item.outside || "-")}</td>
            </tr>`;
        })
        .join("")}

      <tr class="vehicle-total-row">
        <td><strong>Total:</strong></td>
        <td><strong>${totalInside}</strong></td>
        <td><strong>${totalOutside}</strong></td>
      </tr>
    `
  : "";

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
  color: #111827;
}

h2 {
  text-align: center;
  margin: 0 0 18px;
  font-size: 20pt;
  font-weight: 700;
  line-height: 1.25;
}

.date {
  text-align: right;
  margin-bottom: 12px;
  font-size: 11.5pt;
  font-weight: 500;
  line-height: 1.4;
}

.shop {
  margin-bottom: 12px;
  font-size: 14pt;
  font-weight: 700;
  line-height: 1.4;
}

.title {
  text-align: center;
  margin: 0 0 16px;
  font-size: 16pt;
  font-weight: 700;
  line-height: 1.4;
}


  table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  break-inside: auto;
  page-break-inside: auto;
}

.secondary-table {
  width: 60% !important;
  margin-top: 40px !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  table-layout: fixed;
}

.vehicle-total-row td {
  font-weight: 700;
  background: #f8fafc;
}

.secondary-table th,
.secondary-table td {
  padding: 7px 10px;
  white-space: nowrap;
  font-size: 11.5pt;
  line-height: 1.4;
}

.secondary-table th:nth-child(1),
.secondary-table td:nth-child(1) {
  width: 44%;
}

.secondary-table th:nth-child(2),
.secondary-table td:nth-child(2),
.secondary-table th:nth-child(3),
.secondary-table td:nth-child(3) {
  width: 28%;
}

thead {
  display: table-header-group !important;
}

tbody {
  display: table-row-group;
}

th,
td {
  border: 1px solid #334155;
  padding: 8px 6px;
  text-align: center;
  vertical-align: middle;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  font-size: 11.5pt;
  line-height: 1.4;
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

th:nth-child(1), td:nth-child(1) { width: 15%; }

th:nth-child(2), td:nth-child(2) { width: 20%; }

th:nth-child(3), td:nth-child(3) {
  width: 40%;
  text-align: left;
}

th:nth-child(4), td:nth-child(4) {
  width: 25%;
}

tr {
  display: table-row;
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}

@media print {
  table {
    break-inside: auto !important;
    page-break-inside: auto !important;
  }

  thead {
    display: table-header-group !important;
  }

  tbody {
    display: table-row-group !important;
  }

  tr {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  th,
  td {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }
}

 .signature {
  margin-top: 42px;
  text-align: right;
  font-size: 11.5pt;
  font-weight: 600;
  line-height: 1.5;
  color: #1f2937;
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
  <div class="date report-text">दिनांक: ${escapeHtml(formatReportDate(reportDate))}</div>
  <div class="shop report-text">${escapeHtml(shopName)}</div>
  <div class="title report-text">
  ${period ? escapeHtml(period) : ""}
  </div>

  <table class="main-report-table">
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

${
  showSecondTable
    ? `
      <table class="secondary-table">
        <thead>
          <tr>
            <th class="report-text">वाहन प्रकार</th>
            <th class="report-text">अंदर आए</th>
            <th class="report-text">बाहर गए</th>
          </tr>
        </thead>
        <tbody>${vehicleRowsHtml}</tbody>
      </table>
    `
    : ""
}

<div class="signature report-text">
  <strong>SENIOR OFFICER</strong><br>
  Owl Security Surveillance
</div>

</div>
</body>
</html>`;
  };

  const preview = () => {
  if (!validate()) return;

  // First preview: show the newly generated report.
  if (!savedPreviewHtml) {
    setShowPreview(true);
    return;
  }

  const savedDoc = new DOMParser().parseFromString(
    savedPreviewHtml,
    "text/html"
  );

  const freshDoc = new DOMParser().parseFromString(
    buildHtml(),
    "text/html"
  );

  // Update text without replacing the existing element.
  // This preserves formatting already applied by the user.
  const syncTextPreservingFormatting = (
    target: Element | null,
    source: Element | null
  ) => {
    if (!target || !source) return;

    const sourceText = source.textContent || "";
    const textNodes: Text[] = [];

    const walker = target.ownerDocument?.createTreeWalker(
      target,
      NodeFilter.SHOW_TEXT
    );

    if (walker) {
      let node: Node | null;

      while ((node = walker.nextNode())) {
        textNodes.push(node as Text);
      }
    }

    if (textNodes.length > 0) {
      textNodes[0].textContent = sourceText;

      for (let i = 1; i < textNodes.length; i++) {
        textNodes[i].textContent = "";
      }
    } else {
      target.textContent = sourceText;
    }
  };

  // -----------------------------------------
  // 1. UPDATE TOP HEADER
  // -----------------------------------------

  syncTextPreservingFormatting(
    savedDoc.querySelector("h2"),
    freshDoc.querySelector("h2")
  );

  syncTextPreservingFormatting(
    savedDoc.querySelector(".date"),
    freshDoc.querySelector(".date")
  );

  syncTextPreservingFormatting(
    savedDoc.querySelector(".shop"),
    freshDoc.querySelector(".shop")
  );

  syncTextPreservingFormatting(
    savedDoc.querySelector(".title"),
    freshDoc.querySelector(".title")
  );

  // -----------------------------------------
  // 2. UPDATE MAIN TABLE
  // -----------------------------------------

  const savedMainTable =
    savedDoc.querySelector(".main-report-table");

  const freshMainTable =
    freshDoc.querySelector(".main-report-table");

  if (savedMainTable && freshMainTable) {
    // Update table headers.
    const savedHead =
      savedMainTable.querySelector("thead");

    const freshHead =
      freshMainTable.querySelector("thead");

    const savedHeaderCells = savedHead
      ? Array.from(savedHead.querySelectorAll("th"))
      : [];

    const freshHeaderCells = freshHead
      ? Array.from(freshHead.querySelectorAll("th"))
      : [];

    const headerCount = Math.min(
      savedHeaderCells.length,
      freshHeaderCells.length
    );

    for (let i = 0; i < headerCount; i++) {
      syncTextPreservingFormatting(
        savedHeaderCells[i],
        freshHeaderCells[i]
      );
    }

    // Update main table rows.
    const savedBody =
      savedMainTable.querySelector("tbody");

    const freshBody =
      freshMainTable.querySelector("tbody");

    if (savedBody && freshBody) {
      const savedRows = Array.from(
        savedBody.querySelectorAll("tr")
      );

      const freshRows = Array.from(
        freshBody.querySelectorAll("tr")
      );

      const commonRows = Math.min(
        savedRows.length,
        freshRows.length
      );

      // Update existing rows.
      for (let i = 0; i < commonRows; i++) {
        const savedCells = Array.from(
          savedRows[i].querySelectorAll("td")
        );

        const freshCells = Array.from(
          freshRows[i].querySelectorAll("td")
        );

        const commonCells = Math.min(
          savedCells.length,
          freshCells.length
        );

        for (let j = 0; j < commonCells; j++) {
          syncTextPreservingFormatting(
            savedCells[j],
            freshCells[j]
          );
        }
      }

      // Add new rows.
      for (
        let i = savedRows.length;
        i < freshRows.length;
        i++
      ) {
        savedBody.appendChild(
          freshRows[i].cloneNode(true)
        );
      }

      // Remove deleted rows.
      while (
        savedBody.querySelectorAll("tr").length >
        freshRows.length
      ) {
        const rows =
          savedBody.querySelectorAll("tr");

        rows[rows.length - 1].remove();
      }
    }
  }

  // -----------------------------------------
  // 3. UPDATE OPTIONAL SECOND TABLE
  // -----------------------------------------

  const savedSecondTable =
    savedDoc.querySelector(".secondary-table");

  const freshSecondTable =
    freshDoc.querySelector(".secondary-table");

  if (freshSecondTable) {
    if (savedSecondTable) {
      // Update second table headers.
      const savedHead =
        savedSecondTable.querySelector("thead");

      const freshHead =
        freshSecondTable.querySelector("thead");

      const savedHeaderCells = savedHead
        ? Array.from(savedHead.querySelectorAll("th"))
        : [];

      const freshHeaderCells = freshHead
        ? Array.from(freshHead.querySelectorAll("th"))
        : [];

      const headerCount = Math.min(
        savedHeaderCells.length,
        freshHeaderCells.length
      );

      for (let i = 0; i < headerCount; i++) {
        syncTextPreservingFormatting(
          savedHeaderCells[i],
          freshHeaderCells[i]
        );
      }

      // Update second table rows.
      const savedBody =
        savedSecondTable.querySelector("tbody");

      const freshBody =
        freshSecondTable.querySelector("tbody");

      if (savedBody && freshBody) {
        const savedRows = Array.from(
          savedBody.querySelectorAll("tr")
        );

        const freshRows = Array.from(
          freshBody.querySelectorAll("tr")
        );

        const commonRows = Math.min(
          savedRows.length,
          freshRows.length
        );

        // Update existing vehicle rows.
        for (let i = 0; i < commonRows; i++) {
          const savedCells = Array.from(
            savedRows[i].querySelectorAll("td")
          );

          const freshCells = Array.from(
            freshRows[i].querySelectorAll("td")
          );

          const commonCells = Math.min(
            savedCells.length,
            freshCells.length
          );

          for (let j = 0; j < commonCells; j++) {
            syncTextPreservingFormatting(
              savedCells[j],
              freshCells[j]
            );
          }
        }

        // Add new vehicle rows.
        for (
          let i = savedRows.length;
          i < freshRows.length;
          i++
        ) {
          savedBody.appendChild(
            freshRows[i].cloneNode(true)
          );
        }

        // Remove deleted vehicle rows.
        while (
          savedBody.querySelectorAll("tr").length >
          freshRows.length
        ) {
          const rows =
            savedBody.querySelectorAll("tr");

          rows[rows.length - 1].remove();
        }
      }
    } else if (savedMainTable) {
      // First time second table is added.
      savedMainTable.after(
        freshSecondTable.cloneNode(true)
      );
    }
  } else if (savedSecondTable) {
    // Second table was removed.
    savedSecondTable.remove();
  }

  setSavedPreviewHtml(
    savedDoc.documentElement.outerHTML
  );

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

  const buildPaginatedReportFrame = async (
  sourceDoc: globalThis.Document
) => {
  const pageWidth = 794;
  const pageHeight = 1123;
  const pageMargin = 68;

const sourceTable = sourceDoc.querySelector(".main-report-table");

const sourceThead = sourceTable?.querySelector("thead");

const sourceRows = sourceTable
  ? Array.from(sourceTable.querySelectorAll("tbody tr"))
  : [];

const sourceSecondTable = sourceDoc.querySelector(
  ".secondary-table"
);

  const iframe = document.createElement("iframe");

  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = `${pageWidth}px`;
  iframe.style.height = `${pageHeight}px`;
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";

  const sourceHeadHtml = sourceDoc.head?.innerHTML || "";

  const paginationStyle = `
    <style>
      @page {
        size: A4;
        margin: 0 !important;
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }

      body::before {
        display: none !important;
      }

      .pagination-root {
        width: ${pageWidth}px;
        margin: 0;
        padding: 0;
      }

      .pagination-page {
        position: relative;
        width: ${pageWidth}px;
        height: ${pageHeight}px;
        box-sizing: border-box;
        padding: ${pageMargin}px;
        margin: 0;
        background: #ffffff;
        overflow: hidden;
        break-after: page;
        page-break-after: always;
      }

      .pagination-page:last-child {
        break-after: auto;
        page-break-after: auto;
      }

      .pagination-content {
        position: relative;
        z-index: 2;
        width: 100%;
        height: ${pageHeight - pageMargin * 2}px;
        box-sizing: border-box;
      }

      .pagination-watermark {
        position: absolute;
        inset: 0;
        z-index: 0;
        background-image: url("${LOGO_PATH}");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 85% auto;
        opacity: 0.07;
        pointer-events: none;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        break-inside: auto;
        page-break-inside: auto;
      }

      .secondary-table {
            width: 60% !important;
            margin-top: 40px !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            table-layout: fixed;
          }

          .vehicle-total-row td {
              font-weight: 700;
              background: #f8fafc;
            }

          .secondary-table th,
          .secondary-table td {
            padding: 7px 10px;
            white-space: nowrap;
          }

          .secondary-table th:nth-child(1),
          .secondary-table td:nth-child(1) {
            width: 44%;
          }

          .secondary-table th:nth-child(2),
          .secondary-table td:nth-child(2),
          .secondary-table th:nth-child(3),
          .secondary-table td:nth-child(3) {
            width: 28%;
          }

      thead {
        display: table-header-group !important;
      }

      tbody {
        display: table-row-group !important;
      }

      tr {
        display: table-row;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      th,
      td {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      @media print {
        html,
        body {
          background: #ffffff !important;
        }

        .pagination-page {
          break-after: page !important;
          page-break-after: always !important;
        }

        .pagination-page:last-child {
          break-after: auto !important;
          page-break-after: auto !important;
        }
      }
    </style>
  `;

  iframe.srcdoc = `
    <!DOCTYPE html>
    <html lang="hi">
      <head>
        ${sourceHeadHtml}
        ${paginationStyle}
      </head>
      <body>
        <div class="pagination-root" id="paginationRoot"></div>
      </body>
    </html>
  `;

  await new Promise<void>((resolve, reject) => {
    iframe.onload = () => resolve();

    iframe.onerror = () =>
      reject(new Error("Unable to create paginated report frame."));

    document.body.appendChild(iframe);
  });

  const reportDoc = iframe.contentDocument;

  if (!reportDoc) {
    iframe.remove();
    throw new Error("Unable to access paginated report document.");
  }

  if (reportDoc.fonts?.ready) {
    await reportDoc.fonts.ready;
  }

  const root = reportDoc.getElementById("paginationRoot");

  if (!root) {
    iframe.remove();
    throw new Error("Pagination root not found.");
  }

  const sourceTopSelectors = [
    "h2",
    ".date",
    ".shop",
    ".title",
  ];

  const createPage = (
    includeTopContent: boolean,
    includeTable: boolean
  ) => {
    const page = reportDoc.createElement("section");
    page.className = "pagination-page";

    const watermark = reportDoc.createElement("div");
    watermark.className = "pagination-watermark";

    const content = reportDoc.createElement("div");
    content.className = "pagination-content";

    page.appendChild(watermark);
    page.appendChild(content);

    if (includeTopContent) {
      sourceTopSelectors.forEach((selector) => {
        const sourceElement = sourceDoc.querySelector(selector);

        if (sourceElement) {
          const cloned = reportDoc.importNode(
            sourceElement,
            true
          );

          content.appendChild(cloned);
        }
      });
    }

    let table: HTMLTableElement | null = null;
    let tbody: HTMLTableSectionElement | null = null;

    if (includeTable && sourceTable) {
      table = reportDoc.importNode(
        sourceTable.cloneNode(true),
        true
      ) as HTMLTableElement;

      const clonedThead = table.querySelector("thead");
      const clonedTbody = table.querySelector("tbody");

      if (clonedThead && sourceThead) {
        clonedThead.replaceWith(
          reportDoc.importNode(sourceThead.cloneNode(true), true)
        );
      }

      if (!clonedTbody) {
        tbody = reportDoc.createElement("tbody");
        table.appendChild(tbody);
      } else {
        tbody = clonedTbody;
        tbody.innerHTML = "";
      }

      content.appendChild(table);
    }

    root.appendChild(page);

    return {
      page,
      content,
      table,
      tbody,
    };
  };

  let currentPage = createPage(true, true);

  const getBottomPosition = (
    element: HTMLElement,
    page: HTMLElement
  ) => {
    const elementRect = element.getBoundingClientRect();
    const pageRect = page.getBoundingClientRect();

    return elementRect.bottom - pageRect.top;
  };

  for (const sourceRow of sourceRows) {
    if (!currentPage.tbody || !currentPage.table) {
      continue;
    }

    const clonedRow = reportDoc.importNode(
      sourceRow.cloneNode(true),
      true
    ) as HTMLTableRowElement;

    currentPage.tbody.appendChild(clonedRow);

    const tableBottom = getBottomPosition(
      currentPage.table,
      currentPage.page
    );

    const allowedBottom = pageHeight - pageMargin;

    if (
      tableBottom > allowedBottom &&
      currentPage.tbody.children.length > 1
    ) {
      currentPage.tbody.removeChild(clonedRow);

      currentPage = createPage(false, true);

      if (currentPage.tbody) {
        currentPage.tbody.appendChild(clonedRow);
      }
    }
  }

    // Add the optional second table first.
  // It must always come before the signature.
  if (sourceSecondTable) {
    const secondTableClone = reportDoc.importNode(
      sourceSecondTable.cloneNode(true),
      true
    ) as HTMLTableElement;

    secondTableClone.style.breakInside = "avoid";
    secondTableClone.style.pageBreakInside = "avoid";

    const allowedBottom = pageHeight - pageMargin;

    currentPage.content.appendChild(secondTableClone);

    const secondTableBottom = getBottomPosition(
      secondTableClone,
      currentPage.page
    );

    // If the complete second table does not fit,
    // move the whole second table to the next page.
    if (secondTableBottom > allowedBottom) {
      currentPage.content.removeChild(secondTableClone);

      const secondTablePage = createPage(
        false,
        false
      );

      const secondTableCopy = reportDoc.importNode(
        sourceSecondTable.cloneNode(true),
        true
      ) as HTMLTableElement;

      secondTableCopy.style.breakInside = "avoid";
      secondTableCopy.style.pageBreakInside = "avoid";

      secondTablePage.content.appendChild(
        secondTableCopy
      );

      currentPage = secondTablePage;
    }
  }

  // Signature must ALWAYS come after the second table.
  // If there is no second table, it simply comes after
  // the first table.
  const sourceSignature =
    sourceDoc.querySelector(".signature");

  if (sourceSignature) {
    const clonedSignature = reportDoc.importNode(
      sourceSignature.cloneNode(true),
      true
    ) as HTMLElement;

    const allowedBottom = pageHeight - pageMargin;

    currentPage.content.appendChild(clonedSignature);

    const signatureBottom = getBottomPosition(
      clonedSignature,
      currentPage.page
    );

    // If the signature does not fit after the table,
    // move only the signature to the next page.
    if (signatureBottom > allowedBottom) {
      currentPage.content.removeChild(
        clonedSignature
      );

      const signaturePage = createPage(
        false,
        false
      );

      const signatureCopy = reportDoc.importNode(
        sourceSignature.cloneNode(true),
        true
      ) as HTMLElement;

      signaturePage.content.appendChild(
        signatureCopy
      );

      currentPage = signaturePage;
    }
  }

  return iframe;

};

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
        alignment: "left" | "center" | "right",
        spacingAfter: number
    ) => {
      const element = doc.querySelector(selector);
      return new Paragraph({
        alignment,
         spacing: { after: spacingAfter },
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

  const downloadPdf = async () => {
  if (!validate()) return;

  const sourceDoc = getPreviewDocument();

  if (!sourceDoc) {
    alert("Please open the report preview first.");
    return;
  }

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Please allow pop-ups to generate the PDF.");
    return;
  }

  let paginatedFrame: HTMLIFrameElement | null = null;

  try {
    paginatedFrame =
      await buildPaginatedReportFrame(sourceDoc);

    const paginatedDoc =
      paginatedFrame.contentDocument;

    if (!paginatedDoc) {
      throw new Error("Unable to prepare report for printing.");
    }

    printWindow.document.open();

    printWindow.document.write(
      "<!DOCTYPE html>" +
        paginatedDoc.documentElement.outerHTML
    );

    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
    };
  } catch (error) {
    console.error("PDF generation failed:", error);

    printWindow.close();

    alert(
      "Unable to generate the PDF. Please try again."
    );
  } finally {
    if (paginatedFrame) {
      setTimeout(() => {
        paginatedFrame?.remove();
      }, 1000);
    }
  }
};

const attachPdf = async () => {
  if (!validate()) return;

  const sourceDoc = getPreviewDocument();

  if (!sourceDoc) {
    alert("Please open the report preview first.");
    return;
  }

  setAttachingPdf(true);

  let paginatedFrame: HTMLIFrameElement | null = null;

  try {
    paginatedFrame =
      await buildPaginatedReportFrame(sourceDoc);

    const reportDoc =
      paginatedFrame.contentDocument;

    if (!reportDoc) {
      throw new Error(
        "Unable to access paginated report document."
      );
    }

    const pages = Array.from(
      reportDoc.querySelectorAll(
        ".pagination-page"
      )
    ) as HTMLElement[];

    if (pages.length === 0) {
      throw new Error(
        "No report pages were created."
      );
    }

    const html2canvas =
      (await import("html2canvas-pro")).default;

    const { jsPDF } = await import("jspdf");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    for (let index = 0; index < pages.length; index++) {
      const page = pages[index];

      if (reportDoc.fonts?.ready) {
        await reportDoc.fonts.ready;
      }

      const images = Array.from(
        reportDoc.images
      );

      await Promise.all(
        images.map((image) => {
          if (image.complete) {
            return Promise.resolve();
          }

          return new Promise<void>((resolve) => {
            image.onload = () => resolve();
            image.onerror = () => resolve();
          });
        })
      );

      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
      });

      if (index > 0) {
        pdf.addPage();
      }

      const imageData = canvas.toDataURL(
        "image/jpeg",
        0.98
      );

      pdf.addImage(
        imageData,
        "JPEG",
        0,
        0,
        210,
        297
      );
    }

    const pdfBlob = pdf.output("blob");

    const pdfFile = new File(
      [pdfBlob],
      `Daily-Security-Report-${reportDate}.pdf`,
      {
        type: "application/pdf",
      }
    );

    onAttachPdf(pdfFile);
  } catch (error) {
    console.error(
      "PDF attachment failed:",
      error
    );

    alert(
      "Unable to generate the PDF. Please try again."
    );
  } finally {
    if (paginatedFrame) {
      paginatedFrame.remove();
    }

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

      {!showPreview ? (
        <>

            <div className="mb-5 text-center">
              <h4 className="text-lg font-bold text-indigo-700">
                Report Header
              </h4>
            </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Shop Name
                </label>

                <select
                  value={shopNameMode}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "Manual Entry") {
                      setShopNameMode("Manual Entry");
                      setShopName("");
                      setCustomShopName("");
                    } else {
                      setShopNameMode(value);
                      setShopName(value);
                      setCustomShopName("");
                    }
                  }}
                  className={inputClass}
                >
                  <option value="">Select shop name</option>

                  {SHOP_NAME_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {shopNameMode === "Manual Entry" && (
                  <input
                    value={customShopName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCustomShopName(value);
                      setShopName(value);
                    }}
                    placeholder="Enter shop name"
                    className={`${inputClass} mt-2`}
                  />
                )}
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

          <div className="mb-5 mt-6 text-center">
            <h4 className="text-lg font-bold text-indigo-700">
              Report Details
            </h4>
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

          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-lg font-bold text-emerald-700">
                  Vehicle Movement Details
                </h4>

                {!showSecondTable ? (
                  <button
                    type="button"
                    onClick={() => setShowSecondTable(true)}
                    className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    + Add Second Table
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSecondTable(false);
                      setVehicleRows([createEmptyVehicleRow()]);
                    }}
                    className="text-sm font-medium text-red-600"
                  >
                    Remove Second Table
                  </button>
                )}
              </div>

              {showSecondTable && (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-slate-300 px-3 py-2 text-left text-sm">
                            वाहन प्रकार
                          </th>

                          <th className="border border-slate-300 px-3 py-2 text-center text-sm">
                            अंदर आए
                          </th>

                          <th className="border border-slate-300 px-3 py-2 text-center text-sm">
                            बाहर गए
                          </th>

                          <th className="border border-slate-300 px-3 py-2 text-center text-sm">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {vehicleRows.map((row, index) => (
                          <tr key={index}>
                            <td className="border border-slate-300 p-2">
                              <select
                                value={row.vehicleType}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  updateVehicleRow(
                                    index,
                                    "vehicleType",
                                    value
                                  );

                                  if (value !== "Manual Entry") {
                                    updateVehicleRow(
                                      index,
                                      "customVehicleType",
                                      ""
                                    );
                                  }
                                }}
                                className={inputClass}
                              >
                                <option value="">
                                  Select vehicle type
                                </option>

                                {VEHICLE_TYPE_OPTIONS.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>

                              {row.vehicleType === "Manual Entry" && (
                                <input
                                  value={row.customVehicleType}
                                  onChange={(e) =>
                                    updateVehicleRow(
                                      index,
                                      "customVehicleType",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter vehicle type"
                                  className={`${inputClass} mt-2`}
                                />
                              )}
                            </td>

                            <td className="border border-slate-300 p-2">
                              <input
                                type="number"
                                min="0"
                                value={row.inside}
                                onChange={(e) =>
                                  updateVehicleRow(
                                    index,
                                    "inside",
                                    e.target.value
                                  )
                                }
                                placeholder="0"
                                className={`${inputClass} text-center`}
                              />
                            </td>

                            <td className="border border-slate-300 p-2">
                              <input
                                type="number"
                                min="0"
                                value={row.outside}
                                onChange={(e) =>
                                  updateVehicleRow(
                                    index,
                                    "outside",
                                    e.target.value
                                  )
                                }
                                placeholder="0"
                                className={`${inputClass} text-center`}
                              />
                            </td>

                            <td className="border border-slate-300 p-2 text-center">
                              {vehicleRows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeVehicleRow(index)
                                  }
                                  className="text-sm font-medium text-red-600"
                                >
                                  Remove
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}

                        <tr className="bg-slate-50 font-semibold">
                          <td className="border border-slate-300 p-2 text-left">
                            Total:
                          </td>

                          <td className="border border-slate-300 p-2 text-center">
                            {vehicleRows.reduce(
                              (total, row) => total + (Number(row.inside) || 0),
                              0
                            )}
                          </td>

                          <td className="border border-slate-300 p-2 text-center">
                            {vehicleRows.reduce(
                              (total, row) => total + (Number(row.outside) || 0),
                              0
                            )}
                          </td>

                          <td className="border border-slate-300 p-2"></td>
                        </tr>

                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={addVehicleRow}
                    className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    + Add Vehicle Row
                  </button>
                </>
              )}
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
});

export default DailySecurityReportBuilder;