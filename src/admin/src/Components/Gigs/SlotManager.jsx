// SlotManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Plus
} from "lucide-react";
import { toast } from "sonner";
import { useGlobalContext } from "../../GlobalContext";
import { Trash2 } from "lucide-react"; // Make sure this is at the top



import LoadingScreen from "../Utils/LoadingScreen";
import CreateSlotModal from "./CreateSlotModal";
import * as Dialog from '@radix-ui/react-dialog';


export default function SlotManager() {
    const { baseurl, token, accessToken, setIsUnauthorised } = useGlobalContext();
    const [slotsData, setSlotsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [slotModalOpen, setSlotModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");



    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const UserDetail = {
                driverId: "", // if needed, populate from session or state
            };

            const response = await axios.post(
                `${baseurl}/api/Driver/v1.0/getSlotsList`,
                UserDetail,
                {
                    headers: {
                        Authorization: `Basic ${token}`,
                    }
                }
            );

            if (response.data.responseCode === "00") {
                toast.success(response.data.responseMessage);
                setSlotsData(response.data.data);
                setFilteredData(response.data.data);
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
        fetchSlots();
    }, []);
    const handleDeleteSlot = async (slotId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this slot?");
        if (!confirmDelete) return;

        try {
            const res = await axios.post(
                `${baseurl}/api/Driver/v1.0/deleteSlot`,
                { slotId },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            if (res.data.responseCode === "00") {
                toast.success("Slot deleted successfully");
                fetchSlots();
            } else {
                toast.error(res.data.responseMessage || "Failed to delete slot");
            }
        } catch (err) {
            toast.error("Error deleting slot");
            console.error(err);
        }
    };


    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = slotsData.filter(slot =>
            slot.slot_date.toLowerCase().includes(query) ||
            slot.slot_title.toLowerCase().includes(query) ||
            slot.slot_description.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                <h1 className="text-2xl font-semibold">Slots</h1>

                <div className="flex flex-wrap items-end gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title or description..."
                        className="px-2 py-1 border rounded text-xs shadow-sm w-[180px]"
                    />

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="text-xs border rounded px-2 py-1 shadow-sm w-[130px]"
                    >
                        <option value="">All Categories</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                    </select>


                    <button
                        onClick={() => setSlotModalOpen(true)}
                        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs shadow"
                    >
                        <Plus size={14} />
                        <span>Create Slot</span>
                    </button>
                </div>
            </div>
            {loading ? <LoadingScreen /> :
                <> {paginatedData.map((slotGroup) => (
                    <div key={slotGroup.id} className="border rounded p-4 mb-4 shadow-sm bg-orange-100">
                        <h2 className="font-bold text-lg mb-1">{slotGroup.slot_date}</h2>
                        <p className="text-sm text-gray-600 mb-2">{slotGroup.slot_description}</p>
                        {slotGroup.categories.map((category) => (
                            <div key={category.id} className="mb-3">
                                <h3 className="font-semibold text-md">{category.category}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                                    {category.slots.map((slot) => (
                                        <div key={slot.id} className="relative border p-3 rounded-md bg-white">
                                            <div className="text-sm font-semibold">{slot.from_time} - {slot.to_time}</div>
                                            <div className="text-xs text-gray-500">{slot.slot_title}</div>
                                            <div className="text-xs">Min: ₹{slot.min_amount} - Max: ₹{slot.max_amount}</div>
                                            <div className="text-xs font-medium text-green-600">{slot.booking_status}</div>

                                            {/* Delete Confirmation Dialog */}
                                            <Dialog.Root>
                                
                                                <Dialog.Trigger asChild>
                                                    <button className="absolute top-2 right-2 text-red-600 hover:text-red-800">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </Dialog.Trigger>

                                                <Dialog.Portal>
                                                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
                                                    <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow z-50 space-y-4">
                                                        <Dialog.Title className="text-lg font-semibold">Confirm Deletion</Dialog.Title>
                                                        <Dialog.Description className="text-sm text-gray-600">
                                                            Are you sure you want to delete this slot?
                                                        </Dialog.Description>
                                                        <div className="flex justify-end gap-2">
                                                            <Dialog.Close asChild>
                                                                <button className="px-3 py-1 text-sm border rounded">Cancel</button>
                                                            </Dialog.Close>
                                                            <button
                                                                onClick={() => handleDeleteSlot(slot.id)}
                                                                className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </Dialog.Content>
                                                </Dialog.Portal>
                                            </Dialog.Root>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm font-medium">Page {currentPage}</span>

                        <button
                            onClick={() =>
                                setCurrentPage((p) => (p * itemsPerPage < filteredData.length ? p + 1 : p))
                            }
                            disabled={currentPage * itemsPerPage >= filteredData.length}
                            className="px-3 py-1 rounded border text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div></>}

            {/* Modals */}
            {slotModalOpen && <CreateSlotModal
                isOpen={slotModalOpen}
                onClose={() => setSlotModalOpen(false)}
                onCreated={fetchSlots}
            />}

        </div>
    );
}
