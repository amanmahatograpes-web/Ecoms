// SettingsTabs/FirebaseMessagingForm.jsx
import { useState } from "react";

export default function FirebaseMessagingForm() {
  const [form, setForm] = useState({
    serverKey: "",
    serviceAccountFile: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  return (
    <form className="space-y-8 p-4">
      <h2 className="text-xl font-semibold mb-4">Firebase Cloud Messaging</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Server Key (Legacy)</label>
          <input
            type="text"
            name="serverKey"
            value={form.serverKey}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Service Account Private Key</label>
          <input
            type="file"
            name="serviceAccountFile"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="md:col-span-2">
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm underline"
          >
            How to get your service account private key
          </a>
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
