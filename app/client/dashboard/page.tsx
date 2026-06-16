"use client";

import { useEffect, useState } from "react";

import ClientLayout from "@/components/layout/ClientLayout";

import {
  getClientByUserId,
} from "@/services/clientService";

import {
  getReportsByClientId,
} from "@/services/reportService";

export default function ClientDashboardPage() {

  const [name, setName] =
    useState("");

  const [client, setClient] =
    useState<any>(null);

  const [reports, setReports] =
    useState<any[]>([]);

  useEffect(() => {

    const storedName =
      localStorage.getItem("name") ||
      "Client";

    setName(storedName);

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

  const totalReports =
    reports.length;

  const normalReports =
    reports.filter(
      (r) => r.status === "NORMAL"
    ).length;

  const observationReports =
    reports.filter(
      (r) =>
        r.status === "OBSERVATION"
    ).length;

  const incidentReports =
    reports.filter(
      (r) => r.status === "INCIDENT"
    ).length;

  return (
    <ClientLayout>

      <h1 className="text-3xl font-bold mb-6">
        Client Dashboard
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p className="text-lg">
          Welcome {name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Total Reports
          </h3>

          <p className="text-3xl font-bold mt-2">
            {totalReports}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Normal Reports
          </h3>

          <p className="text-3xl font-bold mt-2">
            {normalReports}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Observation Reports
          </h3>

          <p className="text-3xl font-bold mt-2">
            {observationReports}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Incident Reports
          </h3>

          <p className="text-3xl font-bold mt-2">
            {incidentReports}
          </p>
        </div>

      </div>

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">
          Client Information
        </h2>

        <p>
          <strong>Company:</strong>{" "}
          {client?.companyName}
        </p>

        <p className="mt-2">
          <strong>Contact:</strong>{" "}
          {client?.contactPerson}
        </p>

        <p className="mt-2">
          <strong>Email:</strong>{" "}
          {client?.email}
        </p>

        <p className="mt-2">
          <strong>Phone:</strong>{" "}
          {client?.phone}
        </p>

      </div>


      <div className="bg-white p-6 rounded-xl shadow mt-6">

  <h2 className="text-xl font-bold mb-4">
    Recent Reports
  </h2>

  <div className="overflow-x-auto">

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

        </tr>

      </thead>

      <tbody>

       {reports
          .slice(0, 5)
          .map((report: any) => (

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

            </tr>

          ))}

      </tbody>

    </table>

  </div>

</div>

    </ClientLayout>
  );
}