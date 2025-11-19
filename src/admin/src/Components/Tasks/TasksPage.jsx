// TasksPage.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FileDown, RefreshCcw, AlertTriangle,
  CheckCircle,
  Clock,
  Loader,
  XCircle,
  ThumbsDown,
  Truck,
  Hourglass,
  ShoppingBag,
  HelpCircle,
  FileText,
  Eye, X
} from "lucide-react";
import { Toaster, toast } from 'sonner';
import axios from "axios";
import { useGlobalContext } from "../../GlobalContext";
import { exportAnyJsonToExcel } from "../Utils/exportAnyJsonToExcel";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LoadingScreen from "../Utils/LoadingScreen";
import * as Dialog from '@radix-ui/react-dialog';

// ...keep your imports
// import { Dialog } from "@headlessui/react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [assignmentLogs, setAssignmentLogs] = useState([]);
  const [statusChangeLogs, setStatusChangeLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(showLogs ? contentRef.current.scrollHeight : 0);
    }
  }, [showLogs, statusChangeLogs, assignmentLogs]);

  const { team, searchQueryGlobal, token, baseurl, accessToken, setIsUnauthorised } = useGlobalContext();
  const perPage = 50;
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  const formatDate = (date) => date.toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(formatDate(today));
  const [toDate, setToDate] = useState(formatDate(today));
  const [statusFilter, setStatusFilter] = useState("");


  const statusOptions = [
    "unassigned", "assigned", "started", "inprogress",
    "successful", "food is ready", "acknowledged",
    "failed", "declined", "cancelled", "picked up", "arrived"
  ];

  const filtered = tasks.filter(task =>
    (!statusFilter || task.status === statusFilter) &&
    Object.values(task).some(val =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / perPage);

  const FetchTaskCall = async () => {
    setLoading(true)
    try {
      const UserDetail = {
        driverId: "",
        fromDate: fromDate,
        toDate: toDate,
        status: [
          "unassigned", "assigned", "started", "inprogress",
          "successful", "food is ready", "acknowledged",
          "failed", "declined", "cancelled", "picked up", "arrived"
        ]
      };


      const response = await axios.post(
        `${baseurl}/api/Task/v1.0/getTasks`,
        UserDetail,
        { headers: { 'Authorization': `Basic ${token}` } }
      );

      if (response.data.responseCode === "00") {
        // toast.success(response.data.responseMessage);
        setTasks(response.data.data);
      } else if (response.data.responseCode === "401") {
        setIsUnauthorised(true);

      } else {
        toast.error(response.data.responseMessage);
        setTasks([])
      }
    } catch (error) {
      toast.error("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    FetchTaskCall();
  }, [fromDate, toDate]);



  const renderStatusBadge = (status) => {
    const statusMap = {
      unassigned: {
        color: "bg-blue-100 text-blue-700",
        icon: <HelpCircle className="w-4 h-4 mr-1" />,
        label: "Unassigned",
      },
      assigned: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4 mr-1" />,
        label: "Assigned",
      },
      started: {
        color: "bg-amber-100 text-amber-800",
        icon: <Loader className="w-4 h-4 mr-1 animate-spin" />,
        label: "Started",
      },
      inprogress: {
        color: "bg-indigo-100 text-indigo-700",
        icon: <Loader className="w-4 h-4 mr-1 animate-spin" />,
        label: "In Progress",
      },
      "food is ready": {
        color: "bg-purple-100 text-purple-700",
        icon: <Truck className="w-4 h-4 mr-1" />,
        label: "Food Ready",
      },
      "picked up": {
        color: "bg-orange-100 text-orange-700",
        icon: <ShoppingBag className="w-4 h-4 mr-1" />,
        label: "Picked Up",
      },
      acknowledged: {
        color: "bg-teal-100 text-teal-700",
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
        label: "Acknowledged",
      },
      successful: {
        color: "bg-green-100 text-green-700",
        icon: <CheckCircle className="w-4 h-4 mr-1" />,
        label: "Successful",
      },
      failed: {
        color: "bg-red-100 text-red-700",
        icon: <XCircle className="w-4 h-4 mr-1" />,
        label: "Failed",
      },
      declined: {
        color: "bg-pink-100 text-pink-700",
        icon: <ThumbsDown className="w-4 h-4 mr-1" />,
        label: "Declined",
      },
      cancelled: {
        color: "bg-gray-200 text-gray-700",
        icon: <AlertTriangle className="w-4 h-4 mr-1" />,
        label: "Cancelled",
      },
    };


    const { color, icon, label } = statusMap[status] || {
      color: "bg-slate-100 text-slate-700",
      icon: <HelpCircle className="w-4 h-4 mr-1" />,
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}
        style={{ minWidth: "130px" }}
      >
        {icon}
        <span className="truncate">{label}</span>
      </span>
    );
  };

  const handleChangeStatus = async () => {

    if (!newStatus || !selectedTask) {
      toast.error("Please select a valid status.");
      return;
    }
    setLoading(true)
    const payload = {
      taskId: selectedTask.pk_task_id.toString(),
      status: newStatus,
      driverId: selectedTask.driver_id?.toString() || "0"
    };

    try {
      const response = await axios.post(
        `${baseurl}/api/Task/v1.0/changeTaskStatus`,
        payload,
        {
          headers: {
            'Authorization': `Basic ${token}`
          }
        }
      );

      if (response.data.responseCode === "00") {
        toast.success(response.data.responseMessage || "Status updated.");
        // Optionally re-fetch task list
        await FetchTaskCall();
        setSelectedTask(null); // close modal
      } else if (response.data.responseCode === "401") {
        setIsUnauthorised(true);

      } else {
        toast.error(response.data.responseMessage || "Failed to update status.");
      }
    } catch (err) {
      toast.error("Error changing task status.");
    }
    finally {
      setLoading(false)
    }
  };
  const handleDeleteTask = async () => {
    try {
      const response = await axios.post(
        `${baseurl}/api/Task/v1.0/deleteTask`,
        { taskId: selectedTask.pk_task_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.responseCode === "00") {
        toast.success(response.data.responseMessage);
        setSelectedTask(null);
      } else {
        toast.error(response.data.responseMessage || "Failed to delete task");
      }
    } catch (err) {
      toast.error("Error while deleting task");
    } finally {
      FetchTaskCall();
    }
  };
  const fetchTaskLogs = async (taskId) => {
    const payload = {
      fromDate,
      toDate,
      taskId: taskId.toString()
    };

    try {
      // Assignment Logs
      const assignmentRes = await axios.post(
        `${baseurl}/api/Task/v1.0/getTaskAssignmentLogs`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (assignmentRes.data.responseCode === "00") {
        setAssignmentLogs(assignmentRes.data.data || []);
      } else {
        setAssignmentLogs([]);
      }

      // Status Change Logs
      const statusChangeRes = await axios.post(
        `${baseurl}/api/Task/v1.0/getTaskStatusChangeLogs`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (statusChangeRes.data.responseCode === "00") {
        setStatusChangeLogs(statusChangeRes.data.data || []);
      } else {
        setStatusChangeLogs([]);
      }

    } catch (err) {
      toast.error("Error fetching task logs.");
      setAssignmentLogs([]);
      setStatusChangeLogs([]);
    }
  };





  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Tasks</h1>

        <div className="flex space-x-3">


        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="text-xs font-medium block mb-1">From</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-xs w-[120px]"
            value={fromDate}
            max={toDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">To</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-xs w-[120px]"
            value={toDate}
            min={fromDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 text-xs border rounded w-[150px]"
          >
            <option value="">All</option>
            <option value="unassigned">Unassigned</option>
            <option value="picked up">Picked Up</option>
            <option value="started">Started</option>
            <option value="inprogress">In Progress</option>
            <option value="food is ready">Food Ready</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
            <option value="declined">Declined</option>
            <option value="cancelled">Cancelled</option>
            <option value="arrived">Arrived</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs font-medium block mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-2 py-1 border rounded text-xs"
          />
        </div>
        <button
          onClick={FetchTaskCall}
          className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs shadow"
        >
          <RefreshCcw size={14} /> <span>Refresh</span>
        </button>
        <button
          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs shadow"
          onClick={() =>
            exportAnyJsonToExcel({
              data: tasks,
              filePrefix: "TaskExport",
              sheetName: "TasksList",
            })
          }
        >
          <FileDown size={14} /> <span>Export</span>
        </button>
      </div>
      {Loading ? <LoadingScreen /> : <>    <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="min-w-full bg-white">
          <thead >
            <tr className="bg-orange-400 text-left text-sm font-semibold text-white">
              <th className="px-4 py-2 text-center">Task ID</th>
              <th className="px-4 py-2 text-center">Order No</th>
              <th className="px-4 py-2 text-center">Daily No</th>
              <th className="px-4 py-2 text-center">Order Status</th>
              <th className="px-4 py-2 text-center">Number</th>
              <th className="px-4 py-2 text-center">Type</th>
              <th className="px-4 py-2 text-center">Description</th>
              <th className="px-4 py-2 text-center">Driver Name</th>
              <th className="px-4 py-2 text-center">Name</th>
              {/* <th className="px-4 py-2 text-center">Address</th> */}
              <th className="px-4 py-2 text-center">Complete Before</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {current.map((task) => (
              <tr key={task.pk_task_id} className="text-sm border-t">
                <td className="px-4 py-2 text-center">{task.pk_task_id || "N/A"}</td>
                <td className="px-4 py-2 text-center">{task.order_id || "N/A"}</td>
                <td className="px-4 py-2 text-center">{task.merchant_order_id || "N/A"}</td>
                <td className="px-4 py-2 text-center">{renderStatusBadge(task.merchant_order_status) || "N/A"}</td>
                <td className="px-4 py-2 text-center">{task.contact_number || "N/A"}</td>
                <td className="px-4 py-2 text-center">{task.trans_type || "N/A"}</td>
                <td className="px-4 py-2 text-center">{task.task_description || "N/A"}</td>
                <td className="px-4 py-2 text-center">{task.driver_name || "N/A"}</td>
                <td className="px-4 py-2 text-center">{task.customer_name || "N/A"}</td>
                {/* <td className="px-4 py-2 text-center">{task.delivery_address.slice(0, 20) || "N/A"}</td> */}
                <td className="px-4 py-2 text-center">{task.delivery_date || "N/A"}</td>
                <td className="px-4 py-2 text-center">{renderStatusBadge(task.status)}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="Show Details" onClick={() => {
                      setSelectedTask(task);
                      setNewStatus(task.status);
                      fetchTaskLogs(task.pk_task_id); // 🔥 Fetch logs here
                      console.log("Click ho Raha hai")
                    }}
                  >
                    <Eye size={18} />
                  </button><button
                    className="text-blue-600 hover:text-blue-800 ml-2"
                    onClick={() => {
                      // handle logs click here
                    }}
                  >
                    <FileText size={18} className="text-green-600 hover:text-green-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {/* Pagination */}
        <div className="flex justify-end items-center space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div></>}



      {/* Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-6xl max-h-[80vh] overflow-y-auto rounded-lg shadow-xl p-3 relative text-xs">
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h2 className="text-lg font-semibold">Task Details</h2>

              {/* Change Status dropdown + button */}
              <div className="flex items-center gap-2">
                <select
                  className="p-2 border rounded text-xs"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs shadow hover:bg-blue-700"
                  onClick={handleChangeStatus}
                >
                  Change Status
                </button>
                <button
                  title="Close Task Details"
                  className="flex items-center justify-center text-gray-800 w-8 h-8 rounded-full shadow hover:bg-gray-400"
                  onClick={() => setSelectedTask(null)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Task Info - Horizontal Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-2">

              <div><b>Task ID:</b> {selectedTask.pk_task_id}</div>
              <div><b>Order ID:</b> {selectedTask.order_id}</div>
              <div><b>Customer:</b> {selectedTask.customer_name}</div>
              <div><b>Driver ID:</b> {selectedTask.driver_id}</div>
              <div className="col-span-2"><b>Task:</b> {selectedTask.task_description}</div>
              <div><b>Type:</b> {selectedTask.trans_type}</div>
              <div><b>Status:</b> {selectedTask.status}</div>
              <div><b>Contact:</b> {selectedTask.contact_number}</div>
              <div><b>Email:</b> {selectedTask.email_address}</div>
              <div><b>Delivery Date:</b> {selectedTask.delivery_date}</div>
              <div><b>Created:</b> {selectedTask.date_created}</div>
            </div>

            {/* Delivery Details */}
            <div className="bg-gray-50 rounded p-3 mb-3">
              <h3 className="text-sm font-semibold mb-2">Delivery Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div><b>Pickup:</b> {selectedTask.pickup_address}</div>
                <div><b>Drop:</b> {selectedTask.delivery_address}</div>
                <div><b>Distance:</b> {selectedTask.taskDistance}</div>
                <div><b>ETA:</b> {selectedTask.taskEstimatedTime}</div>
              </div>
              <div className="border rounded mb-4">
                {/* Accordion Header */}
                <div
                  onClick={() => setShowLogs(!showLogs)}
                  className="px-4 py-2 flex justify-between items-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <h3 className="text-sm font-semibold">Status & Assignment Logs</h3>
                  <span
                    className={`transition-transform duration-300 text-gray-600 ${showLogs ? "rotate-180" : ""
                      }`}
                    style={{ fontSize: "16px" }}
                  >
                    ▼
                  </span>
                </div>

                {/* Accordion Content with smooth slide */}
                <div
                  ref={contentRef}
                  style={{
                    height: `${contentHeight}px`,
                    transition: "height 300ms ease",
                    overflow: "hidden",
                  }}
                >
                  <div className="p-3 border-t space-y-6 text-sm">
                    {/* Status Change Logs */}
                    {statusChangeLogs.length > 0 && (
                      <div className="border rounded p-3">
                        <h3 className="text-xs font-semibold mb-3 text-gray-700">Status Change Logs</h3>

                        <div className="w-full overflow-x-auto px-4 pb-6">
                          <div className="flex items-start justify-center relative">
                            {statusChangeLogs.map((log, idx) => {
                              const statusColorMap = {
                                unassigned: "bg-gray-400",
                                assigned: "bg-yellow-500",
                                "food is ready": "bg-purple-500",
                                "picked up": "bg-orange-500",
                                inprogress: "bg-indigo-500",
                                successful: "bg-green-500",
                                failed: "bg-red-500",
                                declined: "bg-pink-500",
                                cancelled: "bg-gray-500",
                                started: "bg-blue-500",
                                acknowledged: "bg-teal-500",
                                arrived: "bg-lime-500",
                              };

                              const statusColor =
                                statusColorMap[log.status?.toLowerCase()] || "bg-blue-500";

                              return (
                                <div
                                  key={idx}
                                  className="flex flex-col items-center relative z-10 mx-6 stepper-step group"
                                >
                                  {/* Step circle */}
                                  <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-xs font-bold relative z-10
                  ${statusColor} transition-transform duration-300 cursor-pointer`}
                                  >
                                    {idx + 1}
                                  </div>

                                  {/* Status Name */}
                                  <div className="text-[10px] mt-1 text-center font-medium whitespace-nowrap">
                                    {log.status?.toUpperCase() || "N/A"}
                                  </div>

                                  {/* Tooltip */}
                                  <div className="stepper-tooltip">
                                    <div>Time: {log.created_on || "N/A"}/By:{log.userType || "Unknown"}</div>
                                    <div></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}


                    {/* Assignment Logs */}
                    {assignmentLogs.length > 0 && (
                      <div className="border rounded p-3">
                        <h3 className="text-xs font-semibold mb-2 text-gray-700">Assignment Logs</h3>
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full text-xs border">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2 border">Assign Type</th>
                                <th className="p-2 border">Driver ID</th>
                                <th className="p-2 border">Driver Name</th>
                                <th className="p-2 border">Task Status</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Assignment Date</th>
                                <th className="p-2 border">Process Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {assignmentLogs.map((log, idx) => (
                                <tr key={idx}>
                                  <td className="p-2 border">{log.assignType || "N/A"}</td>
                                  <td className="p-2 border">{log.driverId || "N/A"}</td>
                                  <td className="p-2 border">{log.driverName?.trim() || "N/A"}</td>
                                  <td className="p-2 border">{log.taskStatus || "N/A"}</td>
                                  <td className="p-2 border">{log.status || "N/A"}</td>
                                  <td className="p-2 border">{log.assignmentDate || "N/A"}</td>
                                  <td className="p-2 border">{log.processDate || "N/A"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="w-full h-40 rounded overflow-hidden border">
                <div className="w-full h-40 rounded overflow-hidden border">
                  <MapContainer
                    center={[parseFloat(selectedTask.pickup_latitude), parseFloat(selectedTask.pickup_longitude)]}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Pickup Marker */}
                    <Marker
                      position={[parseFloat(selectedTask.pickup_latitude), parseFloat(selectedTask.pickup_longitude)]}
                    >
                      <Popup>Pickup Location</Popup>
                    </Marker>

                    {/* Dropoff Marker */}
                    <Marker
                      position={[parseFloat(selectedTask.dropoff_latitude), parseFloat(selectedTask.dropoff_longitude)]}
                    >
                      <Popup>Drop Location</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Delivery Items */}
            {selectedTask.delivery_details?.items?.length > 0 && (
              <div className="border rounded p-3 mb-4">
                <h3 className="text-sm font-semibold mb-2">Items</h3>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-xs border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Type</th>
                        <th className="p-2 border">Description</th>
                        <th className="p-2 border">Dimensions (W×H×L)</th>
                        <th className="p-2 border">Weight (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTask.delivery_details.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border">{item.itemName}</td>
                          <td className="p-2 border">{item.itemType}</td>
                          <td className="p-2 border">{item.itemDescription}</td>
                          <td className="p-2 border">{`${item.width}×${item.height}×${item.length}`}</td>
                          <td className="p-2 border">{item.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}







            {/* {statusChangeLogs.length > 0 && (
              <div className="border rounded p-3 mb-4">
                <h3 className="text-sm font-semibold mb-2">Status Change Logs</h3>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-xs border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">User Type</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Changed On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statusChangeLogs.map((log, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border">{log.userType || "N/A"}</td>
                          <td className="p-2 border">{log.status || "N/A"}</td>
                          <td className="p-2 border">{log.created_on || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )} */}

            {/* Change Status */}
            {/* <div className="mt-3">
              <label className="block mb-1 font-medium text-sm">Change Status</label>
              <select
                className="w-full p-2 border rounded text-xs"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div> */}

            {/* Buttons */}
            <div className="mt-2 flex justify-end gap-2">
              {/* <button
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs shadow hover:bg-blue-700"
                onClick={handleChangeStatus}
              >
                Change Status
              </button> */}
              <Dialog.Root open={openConfirm} onOpenChange={setOpenConfirm}>
                <Dialog.Trigger asChild>
                  <button
                    className="bg-red-600 text-white px-3 py-1.5 rounded text-xs shadow hover:bg-red-700"
                  >
                    Delete Task
                  </button>
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                  <Dialog.Content className="fixed z-50 bg-white rounded-lg shadow-lg max-w-sm w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 space-y-4">
                    <Dialog.Title className="text-lg font-semibold">Confirm Delete</Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-500">
                      Are you sure you want to delete this task? This action cannot be undone.
                    </Dialog.Description>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setOpenConfirm(false)}
                        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          setOpenConfirm(false);
                          await handleDeleteTask(); // 🔁 use original logic here
                        }}
                        className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 rounded"
                      >
                        Confirm
                      </button>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              <button
                className="bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-xs shadow hover:bg-gray-400"
                onClick={() => setSelectedTask(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
