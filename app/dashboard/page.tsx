"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getDashboardData } from "@/services/dashboardService";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalReports: 0,
    reportsToday: 0,
    alerts: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData();

        console.log("DASHBOARD DATA:", data);

        setStats(data);
      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back! Here's your dashboard overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Total Clients */}
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <h3 className="text-sm font-medium opacity-90">
            Total Clients
          </h3>
          <p className="text-4xl font-bold mt-3">
            {stats.totalClients}
          </p>
        </div>

        {/* Total Reports */}
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <h3 className="text-sm font-medium opacity-90">
            Total Reports
          </h3>
          <p className="text-4xl font-bold mt-3">
            {stats.totalReports}
          </p>
        </div>

        {/* Reports Today */}
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <h3 className="text-sm font-medium opacity-90">
            Reports Today
          </h3>
          <p className="text-4xl font-bold mt-3">
            {stats.reportsToday}
          </p>
        </div>

        {/* High Alerts */}
        <div className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-gradient-to-br from-red-500 to-orange-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <h3 className="text-sm font-medium opacity-90">
            High Alerts
          </h3>
          <p className="text-4xl font-bold mt-3">
            {stats.alerts}
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}