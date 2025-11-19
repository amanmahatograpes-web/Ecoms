// SettingsTabs/MapSettingsForm.jsx
import { useState } from "react";

export default function MapSettingsForm() {
  const [form, setForm] = useState({
    mapCountry: "",
    disabledTracking: false,
    refreshInterval: "",
    driverActivityRefresh: false,
    autoGeocode: false,
    includeOfflineDrivers: false,
    hidePickup: false,
    hideDelivery: false,
    hideSuccessful: false,
    mapStyle: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderSwitch = (label, name, description) => (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">{label}</label>
        <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} />
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );

  return (
    <form className="space-y-8 p-4">
      <h2 className="text-xl font-semibold mb-4">Map Settings</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Default Map Country</label>
          <select
            name="mapCountry"
            value={form.mapCountry}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Country</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Set the default country to your map</p>
        </div>

        {renderSwitch("Disabled Activity Tracking", "disabledTracking")}

        <div>
          <label className="block text-sm font-medium mb-1">Activity Refresh Interval (sec)</label>
          <input
            type="number"
            name="refreshInterval"
            value={form.refreshInterval}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {renderSwitch("Driver Activity Refresh", "driverActivityRefresh", "Map/dashboard will refresh if there is driver activity")}

        {renderSwitch("Auto Geocode Address", "autoGeocode", "Auto fill address after dragging the marker on map (Google Maps only)")}

        {renderSwitch("Include Offline Driver on Map", "includeOfflineDrivers")}
        {renderSwitch("Hide Pickup Task", "hidePickup")}
        {renderSwitch("Hide Delivery Task", "hideDelivery")}
        {renderSwitch("Hide Successful Task", "hideSuccessful")}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Google Map Style</label>
          <textarea
            name="mapStyle"
            value={form.mapStyle}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="5"
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">
            Set the style of your map. Get it on <a href="https://snazzymaps.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">snazzymaps.com</a> — leave it empty if unsure.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow"
        >
          Save
        </button>
      </div>
    </form>
  );
}
