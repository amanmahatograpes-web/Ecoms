// SettingsTabs/MapApiKeysForm.jsx
import { useState } from "react";

export default function MapApiKeysForm() {
  const [form, setForm] = useState({
    mapProvider: "",
    googleApiKey: "",
    enableGoogleMaps: false,
    mapboxToken: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderSwitch = (label, name) => (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium">{label}</label>
      <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} />
    </div>
  );

  return (
    <form className="space-y-8 p-4">
      <h2 className="text-xl font-semibold mb-4">Map API Keys</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Choose Map Provider</label>
          <select
            name="mapProvider"
            value={form.mapProvider}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Provider</option>
            <option value="google">Google Maps</option>
            <option value="mapbox">MapBox</option>
          </select>
        </div>

        {form.mapProvider === "google" && (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Google API Key</label>
              <input
                name="googleApiKey"
                value={form.googleApiKey}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                type="text"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enable Google Maps Distance Matrix API, Geocoding API, and JavaScript API in your Google Developer Account.
              </p>
            </div>
            <div className="md:col-span-2">
              {renderSwitch("Enable Google Maps", "enableGoogleMaps")}
            </div>
          </>
        )}

        {form.mapProvider === "mapbox" && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">MapBox Access Token</label>
            <input
              name="mapboxToken"
              value={form.mapboxToken}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              type="text"
            />
          </div>
        )}
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
