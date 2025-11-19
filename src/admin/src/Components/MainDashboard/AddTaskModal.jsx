// AddTaskModal.jsx (Updated with Static Form and Shop Select)
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { useGlobalContext } from "../../GlobalContext";
import axios from "axios";

const initialTaskData = {
  orderId: "",
  userType: "admin",
  restaurantId: "",
  taskDescription: "",
  taskType: "",
  restaurantNumber: "",
  restaurantEmail: "",
  customerName: "",
  customerMobile: "",
  deliveryDate: "",
  deliveryAddress: "",
  deliveryLatitude: "",
  deliveryLongitude: "",
};
const initialItem = {
  itemName: "",
  itemType: "",
  itemDescription: "",
  width: "",
  height: "",
  length: "",
  weight: "",
};

const AddTaskModal = ({ isOpen, onClose }) => {
  const { baseurl, token, accessToken, setApiCall, setIsUnauthorised } = useGlobalContext();
  const [formData, setFormData] = useState(initialTaskData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deliveryItems, setDeliveryItems] = useState([initialItem]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleItemChange = (index, e) => {
    const updatedItems = [...deliveryItems];
    updatedItems[index][e.target.name] = e.target.value;
    setDeliveryItems(updatedItems);
  };
  const addItem = () => setDeliveryItems([...deliveryItems, initialItem]);

  const removeItem = (index) => {
    const updatedItems = deliveryItems.filter((_, i) => i !== index);
    setDeliveryItems(updatedItems);
  };


  const fetchShops = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseurl}/api/Shop/v1.0/getShopList`,
        { userid: "" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.responseCode === "00") {
        toast.success(response.data.responseMessage);
        setShops(response.data.data);
      } else if (response.data.responseCode === "401") {
        setIsUnauthorised(true);

      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Error fetching shops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      ...formData,
      deliveryLatitude: "",
      deliveryLongitude: "",
      deliveryDetails: {
        items: deliveryItems.filter(item =>
          Object.values(item).some(val => val.trim() !== "")
        ),
      },
    };
    try {
      const response = await axios.post(
        `${baseurl}/api/Task/v1.0/createTask`,
        payload,
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response.data.responseCode === "00") {
        toast.success(response.data.responseMessage);
      } else if (response.data.responseCode === "401") {
        setIsUnauthorised(true);

      } else {
        toast.error(response.data.responseMessage);
      }

      setFormData(initialTaskData);
      onClose();
    } catch (error) {
      toast.error("Error Adding the task");
    } finally {
      setIsSubmitting(false);
      setApiCall(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Order ID</label>
            <input name="orderId" value={formData.orderId} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-1">User Type</label>
            <input name="userType" value={formData.userType} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div> */}

          <div>
            <label className="block text-sm font-medium mb-1">Restaurant</label>
            <select name="restaurantId" value={formData.restaurantId} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option value="">Select Restaurant</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.shop_code}>
                  {shop.shop_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Task Description</label>
            <input name="taskDescription" value={formData.taskDescription} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Task Type</label>
            <input name="taskType" value={formData.taskType} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Restaurant Number</label>
            <input name="restaurantNumber" value={formData.restaurantNumber} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Restaurant Email</label>
            <input name="restaurantEmail" value={formData.restaurantEmail} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input name="customerName" value={formData.customerName} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Customer Mobile</label>
            <input name="customerMobile" value={formData.customerMobile} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Delivery Date</label>
            <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Delivery Address</label>
            <input name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Delivery Items</h3>
          {deliveryItems.map((item, index) => (
            <div
              key={index}
              className="border rounded p-3 pt-8 mb-3 bg-gray-50 space-y-2 relative animate-pop"

            ><p className="font-bold text-l">Item {index + 1} </p>
              <button
                onClick={() => removeItem(index)}
                className="absolute right-2 top-2 text-sm text-red-500 hover:text-red-700"
                title="Remove Item"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input name="itemName" value={item.itemName} onChange={(e) => handleItemChange(index, e)} placeholder="Item Name" className="border px-2 py-1 text-sm rounded w-full" />
                <input name="itemType" value={item.itemType} onChange={(e) => handleItemChange(index, e)} placeholder="Item Type" className="border px-2 py-1 text-sm rounded w-full" />
                <input name="itemDescription" value={item.itemDescription} onChange={(e) => handleItemChange(index, e)} placeholder="Item Description" className="border px-2 py-1 text-sm rounded w-full" />
                <input name="width" value={item.width} onChange={(e) => handleItemChange(index, e)} placeholder="Width" className="border px-2 py-1 text-sm rounded w-full" />
                <input name="height" value={item.height} onChange={(e) => handleItemChange(index, e)} placeholder="Height" className="border px-2 py-1 text-sm rounded w-full" />
                <input name="length" value={item.length} onChange={(e) => handleItemChange(index, e)} placeholder="Length" className="border px-2 py-1 text-sm rounded w-full" />
                <input name="weight" value={item.weight} onChange={(e) => handleItemChange(index, e)} placeholder="Weight" className="border px-2 py-1 text-sm rounded w-full" />
              </div>
            </div>
          ))}


          <button
            onClick={addItem}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            + Add Another Item
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {isSubmitting ? "Saving..." : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
