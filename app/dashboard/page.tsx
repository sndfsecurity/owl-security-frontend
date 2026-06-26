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

    const data =
      await getDashboardData();

    setStats(data);

    const reportData = await getReports(0, 5);

    const clientsData = await getClients();

    setRecentReports(reportData.content || []);

    setClients(clientsData);

        setRecentClients(
      clientsData.slice(0, 5)
    );
      

  

  } catch (error) {

    console.error(error);

  }

};

    loadDashboard();
  }, []);


  const getClientName = (clientId: number) => {

  const client = clients.find(
    (c) => c.id === clientId
  );

  return client
    ? client.companyName
    : "Unknown";

};


const formatReportDate = (dateStr: string) => {

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const reportDate = new Date(
    dateStr.split("-").reverse().join("-")
  );

  const todayStr = today.toDateString();
  const yesterdayStr = yesterday.toDateString();

  if (reportDate.toDateString() === todayStr) {
    return "Today";
  }

  if (reportDate.toDateString() === yesterdayStr) {
    return "Yesterday";
  }

  return reportDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

  return (
    <DashboardLayout>
      
  <div className="mt-6 mb-10">

  <span className="text-[18px] font-bold tracking-[3px] text-orange-500 uppercase">
    ADMIN PANEL
  </span>

  <h1 className="mt-1 text-[42px] font-extrabold tracking-[1px] text-[#7E22CE]">
    Dashboard
  </h1>

  <p className="mt-2 text-[18px] tracking-[0.4px] font-medium text-[#64748B] leading-7">
  Monitor clients, reports and security operations from one place.  </p>
</div>


<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
        
        {/* Total Clients */}
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <h3 className="text-white/90 font-medium text-[22px] tracking-[1px]">
            Total Clients
          </h3>
          <p className="text-4xl font-bold mt-3">
            {stats.totalClients}
          </p>
        </div>

        {/* Total Reports */}
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <h3 className="text-white/90 font-medium text-[22px] tracking-[1px]">
            Total Reports
          </h3>
          <p className="text-4xl font-bold mt-3">
            {stats.totalReports}
          </p>
        </div>

        {/* Reports Today */}
        <div className="relativ-0e overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <h3 className="text-white/90 font-medium text-[22px] tracking-[1px]">
            Reports Today
          </h3>
          <p className="text-4xl font-bold mt-3">
            {stats.reportsToday}
          </p>
        </div>

        {/* High Alerts */}
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-red-500 to-orange-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <h3 className="text-white/90 font-medium text-[22px] tracking-[1px]">
            High Alerts
          </h3>
          <p className="text-4xl font-bold mt-3">
            {stats.alerts}
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

  {/* Recent Reports */}
  <div className="bg-white rounded-2xl shadow-lg p-6 border-t-3 border-purple-500">

    <div className="flex items-center justify-between mb-6">

      <h2 className="text-2xl font-bold text-slate-800">
        Recent Reports
      </h2>

      <button
        onClick={() => router.push("/reports")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
      >
        View All
      </button>

    </div>



<div className="space-y-4">

  {recentReports.map((report:any)=>(

  
<div
  key={report.id}
  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
>
  {/* Left Side */}
  <div className="flex items-center flex-1">

    {/* Company Name */}
    <div className="w-[45%]">
      <h3 className="font-semibold text-[15px] text-slate-800 truncate">
        {getClientName(report.clientId)}
      </h3>
    </div>

    {/* Date */}
    <div className="w-[20%]">
      <span className="text-sm text-slate-500">
      {formatReportDate(report.reportDate)}
      </span>
    </div>

    {/* Time */}
    <div className="w-[20%]">
      <span className="text-sm text-slate-500">
        {report.reportTime}
      </span>
    </div>

  </div>

  {/* Status */}
  <span
    className={`px-3 py-1 text-[11px] rounded-full text-xs font-bold
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


  {/* Empty Right Section for next widget */}
  <div className="bg-white rounded-2xl shadow-lg p-6 border-t-3 border-blue-500">

  <div className="flex items-center justify-between mb-6">

    <h2 className="text-2xl font-bold text-slate-800">
      Recent Clients
    </h2>

    <button
      onClick={() => router.push("/clients")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
      View All
    </button>

  </div>

  <div className="space-y-3">

    {recentClients.map((client: any) => (

      <div
      key={client.id}
      className="
        flex items-center justify-between
        p-4
        rounded-xl
        border border-slate-200
        bg-gradient-to-r from-slate-50 to-blue-50
        hover:shadow-md
        transition-all duration-300 ">

  <div className="flex items-center flex-1">

  <div className="w-[45%]">
    <h3 className="font-semibold text-[16px] text-slate-800 truncate">
      {client.companyName}
    </h3>
  </div>

  <div className="w-[35%]">
    <span className="text-sm text-slate-500 truncate">
      {client.contactPerson}
    </span>
  </div>

</div>

  <span
    className={`px-3 py-1 text-[11px] rounded-full text-xs font-bold ${
      client.status === "ACTIVE"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}>
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