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
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white rounded-xl p-5 shadow">
          <h3>Total Clients</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.totalClients}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <h3>Total Reports</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.totalReports}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <h3>Reports Today</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.reportsToday}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <h3>High Alerts</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.alerts}
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}