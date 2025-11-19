// ReportsDashboard.jsx
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import { useGlobalContext } from "../../GlobalContext";
import { BarElement } from 'chart.js';
import { LineChart, Truck, PieChart as PieIcon, BadgeCheck, XCircle, Loader, AlertCircle, Send, Download,FileText } from "lucide-react";
import Logo from "../../Images/Packky.svg";
import LoadingScreen from "../Utils/LoadingScreen";
import { exportAnyJsonToExcel } from "../Utils/exportAnyJsonToExcel";
const ReportsDashboard = () => {
  const { accessToken, baseurl, setIsUnauthorised } = useGlobalContext();
  const today = new Date().toISOString().split("T")[0];

const [fromDate, setFromDate] = useState(today);
const [toDate, setToDate] = useState(today);
  // const [fromDate, setFromDate] = useState("2025-05-03");
  // const [toDate, setToDate] = useState("2025-06-03");
  const [loading, setLoading] = useState(false);

  const [restaurantData, setRestaurantData] = useState([]);
  const [driverTaskAnalytics, setDriverTaskAnalytics] = useState([]);
  const [taskStatusAnalytics, setTaskStatusAnalytics] = useState([]);
  const [assignmentLogs, setAssignmentLogs] = useState([]);
const [statusChangeLogs, setStatusChangeLogs] = useState([]);
const [activeLogTab, setActiveLogTab] = useState("assignment"); // 'assignment' or 'status'
const [logSearchQuery, setLogSearchQuery] = useState("");


  const colors = [
    "#2563eb", // blue-600
    "#f59e0b", // amber-600
    "#059669", // emerald-600
    "#dc2626", // red-600
    "#8b5cf6", // violet-600
    "#0ea5e9", // sky-600
    "#14b8a6", // teal-600
  ];


  const icons = [BadgeCheck, XCircle, Loader, AlertCircle, Send];

 const fetchData = async () => {
  setLoading(true);
  try {
    const payload = { fromDate, toDate };
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const [res1, res2, res3, res4, res5] = await Promise.all([
      axios.post(`${baseurl}/api/Task/v1.0/getTaskAnalytics`, payload, config),
      axios.post(`${baseurl}/api/Driver/v1.0/getDriverAnalytics`, payload, config),
      axios.post(`${baseurl}/api/Task/v1.0/getTaskAnalyticsByStatus`, payload, config),
      axios.post(`${baseurl}/api/Task/v1.0/getTaskAssignmentLogs`, payload, config),
      axios.post(`${baseurl}/api/Task/v1.0/getTaskStatusChangeLogs`, payload, config),
    ]);

    setRestaurantData(res1.data.data || []);
    setDriverTaskAnalytics(res2.data.data || []);
    setTaskStatusAnalytics(res3.data.data || []);
    setAssignmentLogs(res4.data.data || []);
    setStatusChangeLogs(res5.data.data || []);
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
        backgroundColor: driverTaskAnalytics.map((_, i) => colors[i % colors.length]),
        borderRadius: 6,
      },
    ],
  };

  const restaurantPieChartData = {
    labels: restaurantData.map((r) => r.shopName),
    datasets: [
      {
        data: restaurantData.map((r) => r.taskCount),
        backgroundColor: colors,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        {/* Left: Logo + Title */}
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-10" />
          <p className="text-2xl font-bold ps-3">Report</p>
        </div>

        {/* Right: Download Button */}
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow transition-colors"
          onClick={() => {
            // TODO: Add actual download/export logic here
            exportAnyJsonToExcel({
              data: driverTaskAnalytics,
              filePrefix: "DriverReportExport",
              sheetName: "DriverReport",
            })
            exportAnyJsonToExcel({
              data: restaurantData,
              filePrefix: "RestaurentReportExport",
              sheetName: "RestaurentReport",
            })

          }}
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {loading ? <LoadingScreen /> : <>{/* Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {taskStatusAnalytics.map((status, idx) => {
            const Icon = icons[idx % icons.length];
            const color = colors[idx % colors.length];
            return (
              <div
                key={status.id}
                className={`
        group relative bg-white p-3 shadow rounded text-center border-l-4
        transition-all duration-300 hover:scale-[1.02]
      `}
                style={{ borderColor: color }}
              >
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 rounded z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: color }}
                ></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-2">
                    <Icon
                      className="w-5 h-5 mr-2 text-gray-600 group-hover:text-white transition-colors duration-300"
                    />
                    <p className="text-xl text-gray-600 capitalize group-hover:text-white transition-colors duration-300">
                      {status.taskStatus}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-800 group-hover:text-white transition-colors duration-300">
                    {status.taskCount}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
        <hr />

        {/* Filters and Pie Chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <div className="space-y-3 border rounded bg-white p-4">
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
            <h2 className="text-xl mb-2 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-600" /> Restaurant Orders Distribution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              {/* Data Cards */}
              <div className="space-y-2 overflow-y-auto max-h-64 pr-2">
                {restaurantData.map((r, i) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between border rounded px-3 py-2 text-sm"
                    style={{ borderLeft: `4px solid ${colors[i % colors.length]}` }}
                  >
                    <span className="font-medium">{r.shopName}</span>
                    <span className="font-semibold text-gray-700">{r.taskCount}</span>
                  </div>
                ))}
              </div>
              {/* Pie Chart */}
              <div className="h-64 border-l">
                <Pie
                  data={restaurantPieChartData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>

        </div>
        <hr />
        {/* Driver Bar Graph */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-green-600" /> Driver-wise Task Count
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bar Chart */}
            <div className="h-64 border-r pr-3">
            
              <Bar
                data={driverBarChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 800,
                    easing: "easeOutBounce",
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>

            {/* Data Table */}
            <div className="overflow-y-auto max-h-64 pr-2 space-y-2">
                <p className="text-xl" >Driver</p>
              {driverTaskAnalytics.map((d, i) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between border rounded px-3 py-2 text-sm"
                  style={{ borderLeft: `4px solid ${colors[i % colors.length]}` }}
                >
                  <span className="font-medium">{d.driverName}</span>
                  <span className="font-semibold text-gray-700">{d.taskCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div></>}
        
{/* Logs Section */}
<div className="bg-white p-4 shadow rounded mt-6">
  <h2 className="text-xl mb-4 flex items-center gap-2">
    <FileText className="w-5 h-5 text-purple-600" /> Task Logs
  </h2>

  {/* Tabs */}
  <div className="flex space-x-2 mb-4">
    <button
      className={`px-4 py-2 text-sm rounded ${
        activeLogTab === "assignment"
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
      onClick={() => setActiveLogTab("assignment")}
    >
      Assignment Logs
    </button>
    <button
      className={`px-4 py-2 text-sm rounded ${
        activeLogTab === "status"
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
      onClick={() => setActiveLogTab("status")}
    >
      Status Change Logs
    </button>
  </div>

  {/* Universal Search */}
  <div className="mb-4">
    <input
      type="text"
      placeholder="Search in Logs..."
      value={logSearchQuery}
      onChange={(e) => setLogSearchQuery(e.target.value)}
      className="p-2 border rounded w-full text-sm"
    />
  </div>

{/* Table */}
<div className="overflow-x-auto border rounded" style={{ maxHeight: "400px", overflowY: "auto" }}>
  <table className="min-w-full text-sm text-left">
    <thead className="bg-gray-100 text-xs font-semibold uppercase sticky top-0 z-10">
      {activeLogTab === "assignment" ? (
        <tr>
          <th className="px-4 py-2 border">Task ID</th>
          <th className="px-4 py-2 border">Driver Name</th>
          <th className="px-4 py-2 border">Assign Type</th>
          <th className="px-4 py-2 border">Task Status</th>
          <th className="px-4 py-2 border">Assignment Date</th>
          <th className="px-4 py-2 border">Process Date</th>
        </tr>
      ) : (
        <tr>
          <th className="px-4 py-2 border">Task ID</th>
          <th className="px-4 py-2 border">User Type</th>
          <th className="px-4 py-2 border">Status</th>
          <th className="px-4 py-2 border">Change Date</th>
        </tr>
      )}
    </thead>
    <tbody>
      {(activeLogTab === "assignment"
        ? assignmentLogs.filter((log) =>
            `${log.taskId} ${log.driverName} ${log.assignType} ${log.taskStatus} ${log.assignmentDate} ${log.processDate}`
              .toLowerCase()
              .includes(logSearchQuery.toLowerCase())
          )
        : statusChangeLogs.filter((log) =>
            `${log.taskId} ${log.userType} ${log.status} ${log.created_on}`
              .toLowerCase()
              .includes(logSearchQuery.toLowerCase())
          )
      ).map((log) => (
        <tr key={log.id} className="hover:bg-gray-50">
          {activeLogTab === "assignment" ? (
            <>
              <td className="px-4 py-2 border">{log.taskId}</td>
              <td className="px-4 py-2 border">{log.driverName}</td>
              <td className="px-4 py-2 border capitalize">{log.assignType}</td>
              <td className="px-4 py-2 border capitalize">{log.taskStatus}</td>
              <td className="px-4 py-2 border">{log.assignmentDate}</td>
              <td className="px-4 py-2 border">{log.processDate}</td>
            </>
          ) : (
            <>
              <td className="px-4 py-2 border">{log.taskId}</td>
              <td className="px-4 py-2 border">{log.userType}</td>
              <td className="px-4 py-2 border">{log.status}</td>
              <td className="px-4 py-2 border">{log.created_on}</td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  </table>
</div>


</div>




    </div>)
};

export default ReportsDashboard;
