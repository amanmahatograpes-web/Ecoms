// DriversPage.jsx
import { useState, useEffect } from "react";
import { FileDown, Plus, Send, Bell, RefreshCcw, Trash, Pen } from "lucide-react";
import { exportAnyJsonToExcel } from "../Utils/exportAnyJsonToExcel";
import { Toaster, toast } from 'sonner';
import axios from "axios";
import { useGlobalContext } from "../../GlobalContext";
import AddDriverModal from "./AddDriverModal";
import LoadingScreen from "../Utils/LoadingScreen";
import * as Dialog from '@radix-ui/react-dialog';
import EditDriverModal from "./EditDriverModal";

export default function DriversPage() {
  const { baseurl, token, accessToken, setIsUnauthorised } = useGlobalContext();
  const [Loading, setLoading] = useState()
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [openDialogId, setOpenDialogId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editDriver, setEditDriver] = useState(null); // driver object for editing
  const [editModalOpen, setEditModalOpen] = useState(false);


  const driversPerPage = 25;

  const filteredDrivers = drivers?.filter((driver) =>
    driver.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    driver.username?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * driversPerPage;
  const indexOfFirst = indexOfLast - driversPerPage;
  const currentDrivers = filteredDrivers?.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredDrivers?.length / driversPerPage);

  // Api Calls ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const FetchDriverCall = async () => {

    setLoading(true);
    try {
      const UserDetail = {
        userid: "", // if needed, populate from session or state
      };

      const response = await axios.post(
        `${baseurl}/api/Driver/v1.0/getDriverList`,
        UserDetail,
        {
          headers: {
            Authorization: `Basic ${token}`,
          }
        }
      );

      if (response.data.responseCode === "00") {
        // toast.success(response.data.responseMessage);
        setDrivers(response.data.data);
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
  const handleConfirmDelete = async (driverId) => {
    setDeletingId(driverId);
    try {
      const response = await axios.post(
        `${baseurl}/api/Driver/v1.0/deleteDriver`,
        { driverId }, // payload
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.responseCode === "00") {
        setDrivers((prev) => prev.filter((d) => d.driverId !== driverId));
        toast.success(response.data.responseCode);
      } else if (response.data.responseCode === "401") {
        setIsUnauthorised(true);
      } else {
        toast.error(response.data.responseMessage || "Failed to delete driver");
      }
    } catch (err) {
      toast.error("Error occurred while deleting driver");
    } finally {
      setDeletingId(null);
      setOpenDialogId(null);
    }
  };



  useEffect(() => {
    FetchDriverCall();
  }, []);

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <AddDriverModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Drivers</h1>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        {/* 🔍 Search field on the left */}
        <div className="flex flex-wrap items-end gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or username..."
            className="px-2 py-1 border rounded text-xs shadow-sm w-[180px]"
            autoComplete="off"
          />
        </div>

        {/* ⬇️ Filters and action buttons on the right */}
        <div className="flex flex-wrap items-end gap-2">
          {/* Placeholder Select Filters */}
          <select className="text-xs border rounded px-2 py-1 shadow-sm w-[130px]">
            <option value="">Team</option>
            <option value="team1">Team 1</option>
            <option value="team2">Team 2</option>
          </select>

          <select className="text-xs border rounded px-2 py-1 shadow-sm w-[130px]">
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="offline">Offline</option>
          </select>

          {/* Action Buttons */}
          <button
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs shadow"
            onClick={() =>
              exportAnyJsonToExcel({
                data: drivers,
                filePrefix: "DriversExport",
                sheetName: "DriversList",
              })
            }
          >
            <FileDown size={14} />
            <span>Export</span>
          </button>

          <button
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs shadow"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={14} />
            <span>Add Driver</span>
          </button>

          <button
            className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs shadow"
          >
            <Send size={14} />
            <span>Send Bulk</span>
          </button>

          <button
            className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-xs shadow"
          >
            <Bell size={14} />
            <span>Push</span>
          </button>

          <button
            className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs shadow"
            onClick={()=>FetchDriverCall()}
          >
            <RefreshCcw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {Loading ? <LoadingScreen /> : <>  <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-orange-400 text-left text-sm font-semibold text-white">
              <th className="px-4 py-2 text-center">S/N</th>
              <th className="px-4 py-2 text-center">Driver ID</th>
              <th className="px-4 py-2 text-center">User Name</th>
              <th className="px-4 py-2 text-center">Name</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Phone</th>
              <th className="px-4 py-2 text-center">Last Login</th>
              <th className="px-4 py-2 text-center">Vehicle</th>
              <th className="px-4 py-2 text-center">Device</th>
              <th className="px-4 py-2 text-center">Ratings</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDrivers?.map((driver, index) => (
              <tr key={driver.id} className="text-sm border-t">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2 text-center">{driver.driverId}</td>
                <td className="px-4 py-2 text-center">{driver.username}</td>
                <td className="px-4 py-2 font-medium text-center">{driver.fullName}</td>
                <td className="px-4 py-2 text-center">{driver.email}</td>
                <td className="px-4 py-2 text-center">{driver.phone}</td>
                <td className="px-4 py-2 text-center">{driver.last_login}</td>
                <td className="px-4 py-2 text-center">{driver.transport_type}</td>
                <td className="px-4 py-2 text-center">{driver.device_platform}</td>
                <td className="px-4 py-2 text-center">⭐ {driver.rating}</td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${driver.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 justify-center items-center">
                    <button className="text-green-600 hover:text-green-800">
                      <Bell size={14} />
                    </button>

                    <Dialog.Root open={openDialogId === driver.driverId} onOpenChange={(open) => setOpenDialogId(open ? driver.driverId : null)}>
                      <Dialog.Trigger asChild>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash size={14} />
                        </button>
                      </Dialog.Trigger>

                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                        <Dialog.Content className="bg-white rounded-md shadow-lg p-6 w-[90%] max-w-sm fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-50">
                          <Dialog.Title className="text-lg font-semibold mb-2">Confirm Deletion</Dialog.Title>
                          <Dialog.Description className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete driver <strong>{driver.fullName}</strong>?
                          </Dialog.Description>

                          <div className="flex justify-end gap-2">
                            <Dialog.Close asChild>
                              <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm">Cancel</button>
                            </Dialog.Close>
                            <button
                              onClick={() => handleConfirmDelete(driver.driverId)}
                              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm disabled:opacity-50"
                              disabled={deletingId === driver.driverId}
                            >
                              {deletingId === driver.driverId ? "Deleting..." : "Yes, Delete"}
                            </button>
                          </div>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>

                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setEditDriver(driver);
                        setEditModalOpen(true);
                      }}
                    >
                      <Pen size={14} />
                    </button>

                  </div>
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
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div></>}

      <EditDriverModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        driver={editDriver}
      />

    </div>
  );
}
