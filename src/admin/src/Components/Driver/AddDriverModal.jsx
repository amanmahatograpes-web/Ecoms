import React, { useState } from "react";
import axios from "axios";
import { Toaster, toast } from 'sonner';
import { useGlobalContext } from "../../GlobalContext";
const initialDriverData = {
  userType: "",
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  password: "",
  teamId: "",
  transportType: "",
  transportDescription: "",
  licencePlate: "",
  tier: "",
};

const AddDriverModal = ({ isOpen, onClose }) => {
      const { baseurl, token,accessToken, setIsUnauthorised } = useGlobalContext();
  const [formData, setFormData] = useState(initialDriverData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      
      
      const response = await axios.post(
        `${baseurl}/api/Driver/v1.0/createDriver`,
        formData,
        
        {
          headers: {
            'Authorization': `Basic ${token}`
          }
        }
      );
      
      if (response.data.responseCode === "00") {
        toast.success(response.data.responseMessage);
        
        
      }else if (response.data.responseCode==="401"){
          setIsUnauthorised(true);

        } else {
        toast.error(response.data.responseMessage);
      }
      setFormData(initialDriverData);
      
      onClose();
    } catch (error) {
      toast.error("Error Adding the driver");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-h-[90vh] overflow-y-auto w-full max-w-2xl rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Driver</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(initialDriverData).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize mb-1">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : "Save Driver"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDriverModal;
