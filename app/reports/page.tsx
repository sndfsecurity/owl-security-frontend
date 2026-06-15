"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getReports, getReportsByDate } from "@/services/reportService";
import { getClients } from "@/services/clientService";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] =
  useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState("");

  const loadReports = async () => {
    try {
      const reportsData = await getReports();
      const clientsData = await getClients();

      console.log("REPORTS:", reportsData);
      console.log("CLIENTS:", clientsData);

      setReports(reportsData);
      setClients(clientsData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const getClientName = (clientId: number) => {
    const client = clients.find(
      (c) => c.id === clientId
    );

    return client
      ? client.companyName
      : "Unknown";
  };


  const handleSearch = async () => {

  if (!selectedDate) {

    alert(
      "Please select a date"
    );

    return;
  }

  try {

    const formattedDate =
      selectedDate
        .split("-")
        .reverse()
        .join("-");

    const data =
      await getReportsByDate(
        formattedDate
      );

    setReports(data);

  } catch (error) {

    console.error(error);

    alert(
      "Failed to search reports"
    );
  }
};

const handleReset = async () => {

  setSelectedDate("");

  loadReports();
};

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Reports
      </h1>

      {loading ? (
        <p>Loading Reports...</p>
      ) : (


        
        

        <div className="bg-white rounded-xl shadow overflow-x-auto">

            <div className="flex items-center gap-3 mb-4">

  <input
    type="date"
    value={selectedDate}
    onChange={(e) =>
      setSelectedDate(
        e.target.value
      )
    }
    className="border p-2 rounded"
  />

  <button
    onClick={handleSearch}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Search
  </button>

  <button
    onClick={handleReset}
    className="bg-gray-600 text-white px-4 py-2 rounded"
  >
    Reset
  </button>

</div>

          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Client Name</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Notes</th>
                <th className="p-3 text-left">Imge</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report: any) => (
                <tr
                  key={report.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{report.id}</td>

                  <td className="p-3">
                    {getClientName(report.clientId)}
                  </td>

                  <td className="p-3">{report.reportDate}</td>
                  <td className="p-3">{report.reportTime}</td>
                  <td className="p-3">{report.status}</td>
                  <td className="p-3">{report.priority}</td>
                  <td className="p-3">{report.notes}</td>

                  <td className="p-3">

                      {report.imageUrl ? (

                        <button
                          onClick={() =>
                            setSelectedImage(
                              `http://localhost:8080/uploads/${report.imageUrl}`
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

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}


{selectedImage && (

  <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">

    <div className="bg-white p-3 rounded-lg">

      <div className="flex justify-end mb-2">

        <button
          onClick={() =>
            setSelectedImage(null)
          }
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Close
        </button>

      </div>

      <img
        src={selectedImage}
        alt="Report"
        className="max-h-[80vh]"
      />

    </div>

  </div>

)}

    </DashboardLayout>
  );
}