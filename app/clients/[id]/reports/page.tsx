"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

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

  const [selectedImage, setSelectedImage] =
  useState<File | null>(null);

  const [selectedViewImage, setSelectedViewImage] =
  useState<string | null>(null);

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

  const loadReports = async () => {
    try {
      const data =
        await getReportsByClientId(
          clientId
        );

      setReports(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {

  try {

    let imagePath = "";

    if (selectedImage) {

      imagePath =
        await uploadImage(
          selectedImage
        );

    }

    await createReport({

      clientId: clientId,

      reportDate: "",

      reportTime: "",

      status: reportData.status,

      priority: reportData.priority,

      notes: reportData.notes,

       imageUrl: imagePath,

    });

    alert(
      "Report Saved Successfully"
    );

    setSelectedImage(null);

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

    alert(
      "Failed to save report"
    );

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

      await deleteReport(
        reportId
      );

      setReports(
        reports.filter(
          (report) =>
            report.id !== reportId
        )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete report"
      );

    }

};
  
  useEffect(() => {
    loadClient();
    loadReports();
  }, [clientId]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
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
          <div className="grid grid-cols-2 gap-4">

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
              className="border p-2 rounded"
            >
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

          <div className="mt-4">

              <label className="font-medium block mb-2">
                Report Image:
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedImage(
                    e.target.files?.[0] || null
                  )
                }
                className="border p-2 rounded w-full"
              />

          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Report
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow">
        <p>
          <strong>Client ID:</strong>{" "}
          {clientId}
        </p>

        <p>
          <strong>Company:</strong>{" "}
          {client?.companyName}
        </p>

        <p>
          <strong>Contact:</strong>{" "}
          {client?.contactPerson}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-6">
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
                Image
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

                  <td className="p-3">
                    {report.notes}
                  </td>

                   
                   <td className="p-3">

                      {report.imageUrl ? (

                        <button
                          onClick={() =>
                            setSelectedViewImage(
                              report.imageUrl
                            )
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          View
                        </button>

                      ) : (

                        <span>No Image</span>

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


       {selectedViewImage && (

  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
  >

    <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">

      <div className="flex justify-end mb-3">

        <button
          onClick={() =>
            setSelectedViewImage(null)
          }
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Close
        </button>

      </div>

      <img
        src={`http://localhost:8080/uploads/${selectedViewImage}`}
        alt="Report"
        className="max-w-full max-h-[80vh] rounded"
      />

    </div>

  </div>

)}

    </DashboardLayout>
  );
}