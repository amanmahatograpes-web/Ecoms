import { useState } from "react";
import GeneralSettingsForm from "./PackkySetting/GeneralSetting";
import MapApiKeysForm from "./PackkySetting/MapApiKeysForm";
import FirebaseMessagingForm from "./PackkySetting/FirebaseMessagingForm";
import MapSettingsForm from "./PackkySetting/MapSettingsForm";

const tabs = [
  "General Settings",
  "Map API Keys",
  "Firebase Cloud Messaging",
  "Map Settings",
  "Cron Jobs",
  "Update Database",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General Settings");

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>

      {/* Tab Header */}
      <div className="flex border-b border-gray-300 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 cursor-pointer text-sm font-medium whitespace-nowrap ${
              activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Tab Content Placeholder */}
      {activeTab === "General Settings" && (
        <div className="space-y-8">
         <GeneralSettingsForm />
        </div>
      )}
      {activeTab === "Map API Keys" && (
        <div className="text-gray-500 text-sm"><MapApiKeysForm/></div>
      )}
          {activeTab === "Firebase Cloud Messaging" && (
        <div className="text-gray-500 text-sm"><FirebaseMessagingForm/></div>
      )}
       {activeTab === "Map Settings" && (
        <div className="text-gray-500 text-sm"><MapSettingsForm/></div>
      )}
    </div>
  );
}
