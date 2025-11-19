// ReportsDashboard.jsx
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import { useGlobalContext } from "../../GlobalContext";

const ReportsDashboard = () => {
  const { accessToken, baseurl, setIsUnauthorised } = useGlobalContext();
  const [fromDate, setFromDate] = useState("2025-05-03");
  const [toDate, setToDate] = useState("2025-06-03");
  const [loading, setLoading] = useState(false);

  const [restaurantData, setRestaurantData] = useState([]);
  const [driverTaskAnalytics, setDriverTaskAnalytics] = useState([]);
  const [taskStatusAnalytics, setTaskStatusAnalytics] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const payload = { fromDate, toDate };
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const [res1, res2, res3] = await Promise.all([
        axios.post(`${baseurl}/api/Task/v1.0/getTaskAnalytics`, payload, config),
        axios.post(`${baseurl}/api/Driver/v1.0/getDriverAnalytics`, payload, config),
        axios.post(`${baseurl}/api/Task/v1.0/getTaskAnalyticsByStatus`, payload, config),
      ]);

      setRestaurantData(res1.data.data || []);
      setDriverTaskAnalytics(res2.data.data || []);
      setTaskStatusAnalytics(res3.data.data || []);
    } catch (err) {
      console.error("Error loading reports:", err);
      if (err?.response?.status === 401) setIsUnauthorised(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const driverBarChartData = {
    labels: driverTaskAnalytics.map((d) => d.driverName),
    datasets: [
      {
        label: "Tasks",
        data: driverTaskAnalytics.map((d) => d.taskCount),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const restaurantPieChartData = {
    labels: restaurantData.map((r) => r.shopName),
    datasets: [
      {
        data: restaurantData.map((r) => r.taskCount),
        backgroundColor: ["#60a5fa", "#fbbf24", "#34d399", "#f87171", "#a78bfa"],
      },
    ],
  };

  return (
  <div className="p-6 bg-gray-50 min-h-screen space-y-4">
      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {taskStatusAnalytics.map((status) => (
          <div
            key={status.id}
            className="bg-white p-3 shadow rounded text-center border"
          >
            <p className="text-xs text-gray-500 capitalize">{status.taskStatus}</p>
            <p className="text-lg font-semibold text-blue-600">{status.taskCount}</p>
          </div>
        ))}
      </div>

      {/* Filters and Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="p-2 border rounded w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="p-2 border rounded w-full text-sm"
            />
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded w-full text-sm"
          >
            Apply Filter
          </button>
        </div>

        <div className="col-span-2 bg-white p-4 shadow rounded">
          <h2 className="text-base font-semibold mb-2">Restaurant Orders Distribution</h2>
          <div className="w-full h-64">
            <Pie data={restaurantPieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Driver Bar Graph */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-base font-semibold mb-2">Driver-wise Task Count</h2>
        <div className="w-full h-64">
          <Bar data={driverBarChartData} options={{ responsive: true, plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
