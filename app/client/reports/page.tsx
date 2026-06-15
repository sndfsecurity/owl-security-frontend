"use client";

import { useEffect, useState } from "react";

import ClientLayout from "@/components/layout/ClientLayout";

import {
  getClientByUserId,
} from "@/services/clientService";

import {
  getReportsByClientId,
  getClientReportsByDate
} from "@/services/reportService";

export default function ClientReportsPage() {

  const [client, setClient] =
    useState<any>(null);

  const [reports, setReports] =
    useState<any[]>([]);

  const [selectedImage, setSelectedImage] =
  useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState("");


  const handleDateFilter = async (
  date: string
) => {

  setSelectedDate(date);

  try {

    if (!date) {

      if (client) {

        const reportData =
          await getReportsByClientId(
            client.id
          );

        setReports(reportData);

      }

      return;

    }

    const formattedDate =
      date
        .split("-")
        .reverse()
        .join("-");

    const reportData =
      await getClientReportsByDate(
        client.id,
        formattedDate
      );

    setReports(reportData);

  } catch (error) {

    console.error(error);

  }

};

  useEffect(() => {

    const loadData = async () => {

      try {

        const userId =
          Number(
            localStorage.getItem(
              "userId"
            )
          );

        const clientData =
          await getClientByUserId(
            userId
          );

        setClient(clientData);

        const reportData =
          await getReportsByClientId(
            clientData.id
          );

        setReports(reportData);

      } catch (error) {

        console.error(error);

      }

    };

    loadData();

  }, []);

  return (
     <ClientLayout>

      <h1 className="text-3xl font-bold mb-6">
        My Reports
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <p>
          <strong>
            Company:
          </strong>{" "}
          {client?.companyName}
        </p>

        <p>
          <strong>
            Contact:
          </strong>{" "}
          {client?.contactPerson}
        </p>

      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-4 flex items-center gap-3">

  <label className="font-medium">
    Filter By Date:
  </label>

  <input
    type="date"
    value={selectedDate}
    onChange={(e) =>
      handleDateFilter(
        e.target.value
      )
    }
    className="border p-2 rounded"
  />

  <button
    onClick={async () => {

      setSelectedDate("");

      const reportData =
        await getReportsByClientId(
          client.id
        );

      setReports(reportData);

    }}
    className="bg-gray-500 text-white px-4 py-2 rounded"
  >
    Clear
  </button>

</div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

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

              )
            )}

          </tbody>

        </table>

      </div>

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

    </ClientLayout>
  );
}