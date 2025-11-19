import React, { useState, useMemo, useEffect } from "react";
import { useGlobalContext } from "../../GlobalContext";
import RealMap from "../Maps/RealMap";
import GoogleMapView from "../Maps/GoogleMapView";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Tabs for tasks and agents
const CustomSelectDriver = ({
  agents,
  selectedAgentId,
  setSelectedAgentId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (agent) => {
    if (agent.dutyStatus === "offline") return;
    setSelectedAgentId(agent.driverId);
    setIsOpen(false);
  };

  const selectedAgent = agents.find((a) => a.driverId === selectedAgentId);

  return (
    <div className="relative w-full mb-4">
      <button
        type="button"
        className="w-full border px-3 py-2 rounded flex justify-between items-center bg-white"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>
          {selectedAgent
            ? `${selectedAgent.fullName} (${selectedAgent.dutyStatus})`
            : "Select Driver"}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-600" /> {/* Lucide Icon */}
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full border bg-white rounded shadow-lg max-h-60 overflow-y-auto">
          {agents.map((agent) => (
            <li
              key={agent.driverId}
              className={`flex justify-between items-center px-4 py-2 hover:bg-gray-100 ${agent.dutyStatus === "offline"
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
                }`}
              onClick={() => handleSelect(agent)}
            >
              <span>{agent.fullName}</span>
              {agent.dutyStatus === "offline" && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  Offline
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const taskTabs = ["unassigned", "assigned", "successful"];

export default function MapDashboard() {
  const {
    team,
    searchQueryGlobal,
    baseurl,
    token,
    accessToken,
    ApiCall,
    setIsUnauthorised,
    socketData,
  } = useGlobalContext();
  const [tasks, setTasks] = useState();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState();
  const [selectedTaskTab, setSelectedTaskTab] = useState("unassigned");
  const [selectedAgentTab, setSelectedAgentTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [taskDate, setTaskDate] = useState("2025-05-17");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [taskToAssign, setTaskToAssign] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(selectedTask)
  }, [selectedTask])




  // Set default dates on mount
  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    const format = (date) => date.toISOString().split("T")[0];

    setToDate(format(today));
    setFromDate(format(today));
  }, []);
  const TaskCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow border-l-4 p-3 border-orange-300 animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-6 w-20 bg-gray-200 rounded" />
      </div>
      <hr className="my-2 border-gray-200" />
      <div className="space-y-2 bg-gray-100 p-3 rounded text-xs">
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
        <div className="h-3 bg-gray-200 rounded w-3/6" />
      </div>
      <div className="mt-2 h-4 w-16 bg-gray-200 rounded" />
    </div>
  );


  const iconRed = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const iconYellow = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const iconDriverActive = new L.Icon({
    iconUrl: "http://bumppy.in/packky/api/v1/uploads/images/driver_icon.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -25],
  });
  const agentTabs = ["active", "offline", "total"];

  const getAgentTabCount = (tab) => {
    if (tab === "total") return agents.length;
    return agents.filter((agent) => agent.dutyStatus?.toLowerCase() === tab)
      .length;
  };
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-600";
      case "started":
        return "bg-yellow-100 text-yellow-700";
      case "inprogress":
        return "bg-indigo-100 text-indigo-700";
      case "food is ready":
        return "bg-purple-100 text-purple-700";
      case "picked up":
        return "bg-orange-100 text-orange-700";
      case "acknowledged":
        return "bg-teal-100 text-teal-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "declined":
        return "bg-pink-100 text-pink-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "successful":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };



  // Filter tasks based on selected tab
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    if (selectedTaskTab === "unassigned") {
      return tasks.filter((task) => task.status === "unassigned");
    }

    if (selectedTaskTab === "successful") {
      return tasks.filter((task) => task.status === "successful");
    }

    // For "assigned" tab, return all other statuses
    return tasks.filter(
      (task) =>
        !["unassigned", "successful"].includes(task.status)
    );
  }, [tasks, selectedTaskTab]);


  // Filter agents based on selected tab and search
  const filteredAgents = useMemo(() => {
    let list =
      selectedAgentTab === "total"
        ? agents
        : agents.filter(
          (a) => a.dutyStatus?.toLowerCase() === selectedAgentTab
        ); // "active" or "offline"
    return list.filter((a) =>
      a.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [agents, selectedAgentTab, searchQuery]);

  // Assign a task to an agent
  const assignTask = (taskId, agentId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: "assigned", agentId } : task
      )
    );
  };

  // Api Calls /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const FetchTaskCall = async () => {
    setIsLoading(true);
    try {
      const UserDetail = {
        driverId: "",
        fromDate,
        toDate,
        status: [
          "unassigned", "assigned", "started", "inprogress",
          "successful", "food is ready", "acknowledged",
          "failed", "declined", "cancelled", "picked up",
          "arrived"
        ]
      };

      const response = await axios.post(
        `${baseurl}/api/Task/v1.0/getTasks`,
        UserDetail,

        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response.data.responseCode === "00") {
        // toast.success(response.data.responseMessage);
        setTasks(response.data.data);
      } else if (response.data.responseCode === "401") {
        setIsUnauthorised(true);
      } else if (response.data.responseCode === "01") {
        setTasks([]);
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Error fetching Driver");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (socketData || toDate || fromDate) {
      if (socketData) {
        console.log(socketData);
      }

      FetchTaskCall();
    }
  }, [ApiCall, toDate, fromDate]);
  const FetchDriverCall = async () => {
    // setLoading(true);
    try {
      const UserDetail = {
        userid: "",
      };

      const response = await axios.post(
        `${baseurl}/api/Driver/v1.0/getDriverList`,
        UserDetail,

        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response.data.responseCode === "00") {
        // toast.success(response.data.responseMessage);
        setAgents(response.data.data);
      } else if (response.data.responseCode === "401") {
        setIsUnauthorised(true);
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Error fetching Driver");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchDriverCall();
  }, []);

  const AssignTaskToDriver = async () => {
    if (!taskToAssign || !selectedAgentId) {
      toast.error("Task or Driver not selected");
      return;
    }

    const payload = {
      taskId: taskToAssign.pk_task_id,
      driverId: selectedAgentId,
    };

    try {
      const response = await axios.post(
        `${baseurl}/api/Task/v1.0/assignDriver`,
        payload,
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response.data.responseCode === "00") {
        toast.success(response.data.responseMessage);
        setShowAssignModal(false);
        setTaskToAssign(null);
        setSelectedAgentId("");
        FetchTaskCall(); // refresh tasks list
      } else if (response.data.responseCode === "401") {
        setIsUnauthorised(true);
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Error assigning driver");
    }
  };
  const [isChecked, setIsChecked] = useState(false);
  const handleToggle = async () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    setLoading(true);

    const payload = {
      configType: "auto_assign_status",
      configValue1: newValue ? "Y" : "N",
      configValue2: "",
      configValue3: "",
      configValue4: ""
    };

    try {
      const response = await axios.post(
        `${baseurl}/api/Task/v1.0/updateAutoAssignConfig`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log("Toggle updated:", response.data);
    } catch (err) {
      console.error("Error updating config:", err);
    } finally {
      setLoading(false);
      ShowToggleStatus();
    }
  };
    // Fetch current status on mount
  const ShowToggleStatus = async () => {
    setLoading(true);
    const payload = {
      configType: "auto_assign_status"
    };

    try {
      const response = await axios.post(
        `${baseurl}/api/Task/v1.0/getAutoAssignConfig`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (
        response.data?.responseCode === "00" &&
        response.data?.data?.configValue
      ) {
        const isOn = response.data.data.configValue === "Y";
        setIsChecked(isOn);
      }
    } catch (err) {
      console.error("Error fetching toggle status:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
 ShowToggleStatus()
  }, [])
  

  return (
    <div className="flex w-full h-full overflow-hidden">


      {/* Left Panel: Task Overview */}
      <div className="w-[380px] min-w-[380px] bg-gray-50 border-r border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
        {/* Header */}
        <div className="text-black p-3 flex justify-between font-semibold text-2xl border-b bg-white z-10">
          Tasks
          <div className="packky-toggle-container" title="Auto Assign">
            

            <input
              type="checkbox"
              id="packky-toggle"
              className="packky-toggle-input"
              checked={isChecked}
              onChange={handleToggle}
            />
            <label htmlFor="packky-toggle" className="packky-toggle">
              <div className="packky-track" />
              <div className="packky-thumb" />
            </label>
            <span
              className={`packky-status-text font-bold ${isChecked ? "on" : "off"}`}
            >
              {loading ? "Updating..." : isChecked ? "🟢 Auto" : "🔴 Manual"}
            </span>
          </div>
        </div>
        <Toaster position="top-right" />

        {/* Sticky Filters */}
        <div className="sticky top-0 z-10 bg-gray-50">
          {/* Task date selector */}
          <div className="flex justify-between gap-2 py-2 px-3 border-b bg-white">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-white border px-3 py-1 rounded text-sm shadow-sm"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-white border px-3 py-1 rounded text-sm shadow-sm"
            />
          </div>

          {/* Task tabs */}
          <div className="flex justify-around border-b bg-white px-3 py-1 shadow-sm">
            {taskTabs.map((tab) => (
              <div
                key={tab}
                className={`cursor-pointer px-2 py-1 text-center text-xs font-medium rounded-t-md transition-all duration-200 ${selectedTaskTab === tab
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600"
                  }`}
                onClick={() => setSelectedTaskTab(tab)}
              >
                <div className="text-lg font-bold">
                  {
                    tasks?.filter((t) => {
                      if (tab === "assigned") {
                        return [
                          "assigned",
                          "started",
                          "inprogress",
                          "food is ready",
                          "acknowledged",
                          "failed",
                          "declined",
                          "cancelled",
                          "picked up",
                          "arrived"
                        ].includes(t.status);
                      }
                      return t.status === tab;
                    }).length || "00"
                  }
                </div>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable task list */}
        <div className="overflow-y-auto p-3 space-y-3" style={{ maxHeight: "calc(100vh - 220px)" }}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => <TaskCardSkeleton key={index} />)
          ) : (
            filteredTasks
              ?.filter((task) => {
                if (selectedTaskTab === "unassigned") return task.status === "unassigned";
                if (selectedTaskTab === "successful") return task.status === "successful";
                return [
                  "assigned",
                  "started",
                  "inprogress",
                  "food is ready",
                  "acknowledged",
                  "failed",
                  "declined",
                  "cancelled",
                  "picked up",
                  "arrived"
                ].includes(task.status);
              })
              .map((task) => {
                const assignedAgent = agents.find((a) => a.id === task.agentId);
                const isAssigned = task.status === "assigned";

                return (
                  <div
                    key={task.id}
                    className="relative bg-white rounded-lg shadow border-l-4 p-3"
                    style={{ borderColor: "#FC981B" }}
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Order : {task.order_id} / {task.pk_task_id} / {task.merchant_order_id}</span>

                      {task.status === "unassigned" ? (
                        <button
                          className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          onClick={() => {
                            setTaskToAssign(task);
                            setSelectedAgentId("");
                            setShowAssignModal(true);
                          }}
                        >
                          Assign Driver
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center justify-center text-xs font-medium rounded-full ${getStatusBadgeColor(task.status)}`}
                          style={{ minWidth: "130px", height: "28px", padding: "0 0.5rem" }}
                        >
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>

                      )}
                    </div>

                    <hr className="my-2 border-gray-300" />

                    {/* Details */}
                    <div className="bg-gray-100 rounded-md p-3 space-y-2 text-xs text-gray-700">
                      {isAssigned && <div><b>Task:</b> {task.task_description}</div>}
                      <div><b>Pickup:</b> {task.pickup_address}</div>
                      <div><b>Drop:</b> {task.delivery_address}</div>
                      {task.driver_name && <div><b>Driver:</b> {task.driver_name} / {task.driver_mobile}</div>}
                    </div>

                    <div
                      className="text-sm cursor-pointer text-blue-600 underline"
                      onClick={() => {
                        setSelectedTask(task);
                        setShowDetailsModal(true);
                      }}
                    >
                      Details
                    </div>
                  </div>
                );
              })
          )}
        </div>

      </div>


      {/* Middle Panel: Map Area */}
      <div className="flex-1 bg-gradient-to-br from-yellow-100 to-red-100 text-gray-700 flex items-center justify-center rounded-lg shadow-inner relative z-0">
        <div className="w-full h-full overflow-hidden shadow">
          <RealMap Task={tasks} drivers={agents} />
        </div>
      </div>

      {/* Right Panel: Agent Overview */}
      <div className="w-[320px] min-w-[320px] bg-gray-50 border-l border-gray-200 rounded-lg shadow-sm flex flex-col h-full">
        <div className=" justify-between items-center px-3 py-2 border-b text-2xl font-semibold">
          <p className="mb-3">Agents</p>
          <div className="flex items-between space-x-2 text-sm w-full">
            <input
              type="text"
              placeholder="Search"
              className="border px-2 py-1 rounded w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => FetchDriverCall()}
              className="text-orange-500"
            >
              ⟳
            </button>
          </div>
        </div>

        {/* Agent tabs */}
        <div className="flex justify-around mt-2 text-center border-b pb-1 mx-2 bg-white shadow-sm">
          {agentTabs.map((tab) => (
            <div
              key={tab}
              className={`px-2 py-1 cursor-pointer text-xs font-medium ${selectedAgentTab === tab
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600"
                }`}
              onClick={() => setSelectedAgentTab(tab)}
            >
              <div className="text-lg font-bold">{getAgentTabCount(tab)}</div>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        {/* Agent list */}
        <div className="p-3 space-y-2 h-full overflow-y-auto max-h-[calc(100vh-180px)]">
          <p className="text-xs text-red-500">
            Found agents: {filteredAgents.length}
          </p>

          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="flex flex-col bg-white p-3 pl-4 shadow-sm rounded-md border-l-4 cursor-pointer hover:bg-gray-50"
              style={{
                borderLeftColor:
                  agent.dutyStatus === "active" ? "#22C55E" : "#94A3B8",
              }} // green or gray

            >
              {/* Name and status row */}
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm text-gray-900">
                  {agent.fullName}
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
          ${agent.dutyStatus === "active"
                      ? "bg-green-100 text-green-700"
                      : agent.dutyStatus === "offline"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {agent.dutyStatus.charAt(0).toUpperCase() +
                    agent.dutyStatus.slice(1)}
                </span>
              </div>

              {/* Divider */}
              <hr className="my-2 border-gray-200" />

              {/* Team name + icon */}
              {agent.teamName && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7h18M3 12h18M3 17h18"
                    />
                  </svg>
                  {agent.teamName}
                </div>
              )}
            </div>
          ))}

          {filteredAgents.length === 0 && (
            <div className="text-xs text-gray-400 text-center py-4">
              No agents found.
            </div>
          )}
        </div>
      </div>
      {/* modals here  */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full p-4 relative text-sm">
            <h2 className="text-lg font-semibold mb-3">Delivery Task Details</h2>

            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* FLEX ROW: MAP + BASIC DETAILS */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Map */}
              <div className="w-full lg:w-1/2 h-64 rounded overflow-hidden border">
                <MapContainer
                  center={[
                    selectedTask.dropoff_latitude || selectedTask.pickup_latitude,
                    selectedTask.dropoff_longitude || selectedTask.pickup_longitude,
                  ]}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[selectedTask.pickup_latitude, selectedTask.pickup_longitude]} icon={iconRed}>
                    <Popup>Pickup Location</Popup>
                  </Marker>
                  <Marker position={[selectedTask.dropoff_latitude, selectedTask.dropoff_longitude]} icon={iconYellow}>
                    <Popup>Delivery Location</Popup>
                  </Marker>
                  {selectedTask.driver_latitude && selectedTask.driver_longitude && (
                    <Marker position={[selectedTask.driver_latitude, selectedTask.driver_longitude]} icon={iconDriverActive}>
                      <Popup>Driver Location</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              {/* Basic Info Table */}
              <div className="w-full lg:w-1/2 overflow-x-auto">
                <table className="w-full text-xs border">
                  <tbody>
                    <tr className="border-b">
                      <td className="font-semibold px-2 py-1 bg-gray-100">Customer</td>
                      <td className="px-2 py-1">{selectedTask.customer_name}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold px-2 py-1 bg-gray-100">Contact</td>
                      <td className="px-2 py-1">{selectedTask.contact_number}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold px-2 py-1 bg-gray-100">Email</td>
                      <td className="px-2 py-1">{selectedTask.email_address}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold px-2 py-1 bg-gray-100">Driver</td>
                      <td className="px-2 py-1">{selectedTask.driver_name || "N/A"}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold px-2 py-1 bg-gray-100">Driver Mobile</td>
                      <td className="px-2 py-1">{selectedTask.driver_mobile || "N/A"}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold px-2 py-1 bg-gray-100">Distance</td>
                      <td className="px-2 py-1">{selectedTask.taskDistance}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold px-2 py-1 bg-gray-100">ETA</td>
                      <td className="px-2 py-1">{selectedTask.taskEstimatedTime}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADDRESS BLOCK */}
            <div className="mt-4 text-xs">
              <div className="mb-2">
                <span className="font-semibold">Pickup Address:</span> {selectedTask.pickup_address}
              </div>
              <div>
                <span className="font-semibold">Delivery Address:</span> {selectedTask.delivery_address}
              </div>
            </div>

            {/* DELIVERY ITEMS */}
            {selectedTask?.delivery_details?.items?.length > 0 ? (
              <>
                <h3 className="text-sm font-semibold mt-6 mb-2">Delivery Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-[700px] w-full text-xs border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-2 text-left">Item</th>
                        <th className="px-2 py-2 text-left">Type</th>
                        <th className="px-2 py-2 text-left">Description</th>
                        <th className="px-2 py-2 text-left">W×H×L</th>
                        <th className="px-2 py-2 text-left">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTask.delivery_details.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-2 py-2">{item.itemName}</td>
                          <td className="px-2 py-2">{item.itemType}</td>
                          <td className="px-2 py-2">{item.itemDescription}</td>
                          <td className="px-2 py-2">{item.width}×{item.height}×{item.length}</td>
                          <td className="px-2 py-2">{item.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="text-xs text-center text-gray-500 mt-4">No delivery item details available</p>
            )}
          </div>
        </div>
      )}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Assign Driver to{" "}
              <span className="text-orange-500">{taskToAssign?.title}</span>
            </h2>
            <CustomSelectDriver
              agents={agents}
              selectedAgentId={selectedAgentId}
              setSelectedAgentId={setSelectedAgentId}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={AssignTaskToDriver}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}