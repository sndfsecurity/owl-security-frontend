// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDashboardData } from "@/services/dashboardService";
import { getReports } from "@/services/reportService";
import { getClients } from "@/services/clientService";

export default function DashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalClients: 0,
    totalReports: 0,
    reportsToday: 0,
    alerts: 0,
  });

  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [recentClients, setRecentClients] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData();
        setStats(data);

        const reportData = await getReports(0, 5);
        const clientsData = await getClients();

        setRecentReports(reportData.content || []);
        setClients(clientsData);
        setRecentClients(clientsData.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  const getClientName = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.companyName : "Unknown";
  };

  const formatReportDate = (dateStr: string) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const reportDate = new Date(dateStr.split("-").reverse().join("-"));

    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();

    if (reportDate.toDateString() === todayStr) {
      return "Today";
    }

    if (reportDate.toDateString() === yesterdayStr) {
      return "Yesterday";
    }

    return reportDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mt-4 sm:mt-6 mb-6 sm:mb-8 lg:mb-10">
        <span className="text-xs sm:text-sm md:text-base lg:text-[18px] font-bold tracking-[2px] sm:tracking-[3px] text-orange-500 uppercase">
          ADMIN PANEL
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-[0.5px] sm:tracking-[1px] text-[#7E22CE]">
          Dashboard
        </h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-[18px] tracking-[0.3px] sm:tracking-[0.4px] font-medium text-[#64748B] leading-6 sm:leading-7">
          Monitor clients, reports and security operations from one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8 lg:mt-10">
        {/* Total Clients */}
        <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-6 sm:-mr-8 -mt-6 sm:-mt-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-white/90 font-medium text-base sm:text-lg md:text-[22px] tracking-[0.5px] sm:tracking-[1px]">
                Total Clients
              </h3>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3">
              {stats.totalClients}
            </p>
          </div>
        </div>

        {/* Total Reports */}
        <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-6 sm:-mr-8 -mt-6 sm:-mt-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-white/90 font-medium text-base sm:text-lg md:text-[22px] tracking-[0.5px] sm:tracking-[1px]">
                Total Reports
              </h3>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3">
              {stats.totalReports}
            </p>
          </div>
        </div>

        {/* Reports Today */}
        <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-6 sm:-mr-8 -mt-6 sm:-mt-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-white/90 font-medium text-base sm:text-lg md:text-[22px] tracking-[0.5px] sm:tracking-[1px]">
                Reports Today
              </h3>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3">
              {stats.reportsToday}
            </p>
          </div>
        </div>

        {/* High Alerts */}
        <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-lg bg-gradient-to-br from-red-500 to-orange-500 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-6 sm:-mr-8 -mt-6 sm:-mt-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-white/90 font-medium text-base sm:text-lg md:text-[22px] tracking-[0.5px] sm:tracking-[1px]">
                High Alerts
              </h3>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3">
              {stats.alerts}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Reports & Clients Grid */}
      <div className="grid lg:grid-cols-2 gap-5 md:gap-6 mt-6 md:mt-8">
        {/* Recent Reports */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border-t-4 border-purple-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
              Recent Reports
            </h2>
            <button
              onClick={() => router.push("/reports")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 hover:shadow-lg active:scale-95 w-full sm:w-auto"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {recentReports.map((report: any) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all duration-200 hover:shadow-md gap-3 sm:gap-0"
              >
                {/* Left Side */}
                <div className="flex flex-wrap items-center w-full sm:flex-1 gap-2 sm:gap-0">
                  {/* Company Name */}
                  <div className="w-full sm:w-[45%]">
                    <h3 className="font-semibold text-sm sm:text-[15px] text-slate-800 truncate">
                      {getClientName(report.clientId)}
                    </h3>
                  </div>

                  {/* Date */}
                  <div className="w-[45%] sm:w-[20%]">
                    <span className="text-xs sm:text-sm text-slate-500">
                      {formatReportDate(report.reportDate)}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="w-[45%] sm:w-[20%]">
                    <span className="text-xs sm:text-sm text-slate-500">
                      {report.reportTime}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 text-[10px] sm:text-[11px] rounded-full font-bold whitespace-nowrap
                  ${
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
            ))}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border-t-4 border-blue-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
              Recent Clients
            </h2>
            <button
              onClick={() => router.push("/clients")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 hover:shadow-lg active:scale-95 w-full sm:w-auto"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentClients.map((client: any) => (
              <div
                key={client.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 hover:shadow-md transition-all duration-300 gap-3 sm:gap-0"
              >
                <div className="flex flex-wrap items-center w-full sm:flex-1 gap-2 sm:gap-0">
                  <div className="w-full sm:w-[45%]">
                    <h3 className="font-semibold text-sm sm:text-[16px] text-slate-800 truncate">
                      {client.companyName}
                    </h3>
                  </div>
                  <div className="w-full sm:w-[35%]">
                    <span className="text-xs sm:text-sm text-slate-500 truncate block">
                      {client.contactPerson}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-[10px] sm:text-[11px] rounded-full font-bold whitespace-nowrap ${
                    client.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {client.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}