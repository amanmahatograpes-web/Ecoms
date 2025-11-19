import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useGlobalContext } from "../../GlobalContext";

export default function CreateSlotModal({ isOpen, onClose, onCreated }) {
  const { accessToken, baseurl } = useGlobalContext();
  const [form, setForm] = useState({
    gigDate: "",
    gigTitle: "",
    gigDescription: "",
    fromTime: "",
    toTime: "",
    minAmount: "",
    maxAmount: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    const isFormValid = Object.values(form).every((val) => val.trim() !== "");
    if (!isFormValid) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseurl}/api/Driver/v1.0/createSlot`,
        form,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.responseCode === "00") {
        toast.success("Slot created successfully");
        onCreated?.(); // refresh list
        onClose();
        setForm({
          gigDate: "",
          gigTitle: "",
          gigDescription: "",
          fromTime: "",
          toTime: "",
          minAmount: "",
          maxAmount: "",
          category: "",
        });
      } else {
        toast.error(response.data.responseMessage || "Failed to create slot");
      }
    } catch (error) {
      toast.error("Error creating slot");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center px-2">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Create Slot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block mb-1">Gig Date</label>
            <input
              type="date"
              name="gigDate"
              value={form.gigDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          <div>
            <label className="block mb-1">Gig Title</label>
            <input
              type="text"
              name="gigTitle"
              value={form.gigTitle}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              name="gigDescription"
              value={form.gigDescription}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              rows={2}
            />
          </div>
          <div>
            <label className="block mb-1">From Time</label>
            <input
              type="time"
              name="fromTime"
              value={form.fromTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          <div>
            <label className="block mb-1">To Time</label>
            <input
              type="time"
              name="toTime"
              value={form.toTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          <div>
            <label className="block mb-1">Min Amount</label>
            <input
              type="number"
              name="minAmount"
              value={form.minAmount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          <div>
            <label className="block mb-1">Max Amount</label>
            <input
              type="number"
              name="maxAmount"
              value={form.maxAmount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
            >
              <option value="">Select Category</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="evening">Evening</option>
              <option value="dinner">Dinner</option>
              <option value="late night">Late Night</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm shadow"
          >
            {loading ? "Creating..." : "Create Slot"}
          </button>
        </div>
      </div>
    </div>
  );
}
