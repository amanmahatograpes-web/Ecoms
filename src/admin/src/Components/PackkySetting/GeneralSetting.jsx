// SettingsTabs/GeneralSettingsForm.jsx
import { useState } from "react";

export default function GeneralSettingsForm() {
  const [form, setForm] = useState({
    websiteTitle: "",
    mobileApiUrl: "",
    apiHashKey: "",
    language: "",
    defaultLanguage: "",
    allowAllAdmin: false,
    certainMerchant: false,
    chooseMerchant: "",
    taskOwner: "",
    setMerchantOwner: "",
    adminOnlyTasks: false,
    blockDeleteTask: false,
    deleteDays: "",
    blockMerchant: "",
    allowOnlyWhen: "",
    orderStatusAccepted: [],
    orderStatusCancel: "",
    deliveryTime: "",
    hideTotalAmount: false,
    appName: "",
    pushToOnline: false,
    enabledNotes: false,
    enabledSignature: false,
    mandatorySignature: false,
    enabledSignup: false,
    enablePhoto: false,
    resizeWidth: "",
    resizeHeight: "",
    vibration: "",
    signupStatus: "",
    notifyEmails: "",
    calendarLanguage: "",
    trackingOption1: false,
    trackingOption2: false,
    recordLocation: false,
    disableTracking: false,
    trackInterval: "",
    criticalEnabled: false,
    criticalMinutes: "",
    privacyLink: "",
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
    <form className="space-y-10">
      {/* General Settings */}
      <div>
        <h2 className="text-lg font-semibold mb-2">General Settings</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Website Title</label>
            <input name="websiteTitle" value={form.websiteTitle} onChange={handleChange} className="w-full p-2 border rounded" type="text" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile API URL</label>
            <input name="mobileApiUrl" value={form.mobileApiUrl} onChange={handleChange} className="w-full p-2 border rounded" type="url" />
            <p className="text-xs text-gray-500 mt-1">Set this url on your mobile app config files on www/js/config.js</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">API Hash Key</label>
            <input name="apiHashKey" value={form.apiHashKey} onChange={handleChange} className="w-full p-2 border rounded" type="text" />
            <p className="text-xs text-gray-500 mt-1">Make your mobile api secure by putting hash key. It can be a unique string without space. Put the same key in www/js/config.js</p>
          </div>
        </div>
      </div>

      {/* Language Settings */}
       <div>
        <h2 className="text-lg font-semibold mb-2">Language Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="language" value={form.language} onChange={handleChange} className="p-2 border rounded">
            <option value="">Select Language</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
          <select name="defaultLanguage" value={form.defaultLanguage} onChange={handleChange} className="p-2 border rounded">
            <option value="">Select Default Language</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>

      {/* Team Management */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Team Management</h2>
        <div className="grid gap-3">
          {renderSwitch("Allow all Admin team to use by merchant", "allowAllAdmin")}
          {renderSwitch("Set Certain Merchant to use admin Team", "certainMerchant")}
          <p className="text-xs text-gray-500">If this is enabled Allow all Admin team to use by merchant will be ignored</p>
          <input name="chooseMerchant" placeholder="Choose Merchant" value={form.chooseMerchant} onChange={handleChange} className="p-2 border rounded" />
        </div>
      </div>

      {/* Task Management */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Task Management</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <select name="taskOwner" value={form.taskOwner} onChange={handleChange} className="p-2 border rounded">
            <option value="">Select Task Owner</option>
            <option value="admin">Admin</option>
            <option value="merchant">Merchant</option>
          </select>
          <select name="setMerchantOwner" value={form.setMerchantOwner} onChange={handleChange} className="p-2 border rounded">
            <option value="">Set Merchant task owner to admin</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {renderSwitch("Admin user show only admin task", "adminOnlyTasks")}
          {renderSwitch("Do Not allow merchant to delete the task", "blockDeleteTask")}
          <div>
            <label className="block text-sm font-medium mb-1">No. of days allowed for merchant to delete the task</label>
            <input name="deleteDays" value={form.deleteDays} onChange={handleChange} className="w-full p-2 border rounded" type="number" />
            <p className="text-xs text-gray-500">Nos. of days after task was created</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Block merchant</label>
            <input name="blockMerchant" value={form.blockMerchant} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Merchant Name" />
            <p className="text-xs text-gray-500">List of merchant that cannot access driver panel</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Allow only task to be successful when</label>
            <input name="allowOnlyWhen" value={form.allowOnlyWhen} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>
      </div>
            {/* Order Settings */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Order Settings</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Order Status Accepted</label>
            <select
              multiple
              name="orderStatusAccepted"
              value={form.orderStatusAccepted}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                setForm(prev => ({ ...prev, orderStatusAccepted: selectedOptions }));
              }}
              className="w-full p-2 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order Status Cancel</label>
            <select name="orderStatusCancel" value={form.orderStatusCancel} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Time</label>
            <select name="deliveryTime" value={form.deliveryTime} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select</option>
              <option value="fast">Fast</option>
              <option value="standard">Standard</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          {renderSwitch("Hide Total Order Amount", "hideTotalAmount")}
        </div>
      </div>
      {/* App Settings */}
      <div>
        <h2 className="text-lg font-semibold mb-2">App Settings</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">App Name</label>
            <input name="appName" value={form.appName} onChange={handleChange} className="w-full p-2 border rounded" type="text" />
          </div>
          {renderSwitch("Send Push only to online driver", "pushToOnline")}
          {renderSwitch("Enabled Notes", "enabledNotes")}
          {renderSwitch("Enabled Signature", "enabledSignature")}
          {renderSwitch("Mandatory Signature", "mandatorySignature")}
          {renderSwitch("Enabled Signup", "enabledSignup")}
          {renderSwitch("Enabled Add Photo/Take Picture", "enablePhoto")}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Resize Picture Width</label>
              <input name="resizeWidth" value={form.resizeWidth} onChange={handleChange} className="w-full p-2 border rounded" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Resize Picture Height</label>
              <input name="resizeHeight" value={form.resizeHeight} onChange={handleChange} className="w-full p-2 border rounded" type="number" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Device Vibration</label>
            <input name="vibration" value={form.vibration} onChange={handleChange} className="w-full p-2 border rounded" type="text" />
          </div>
        </div>
      </div>
            {/* Driver Signup Settings */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Driver Signup Settings</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Set Signup Status</label>
            <select name="signupStatus" value={form.signupStatus} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Set the default status of the driver after signup</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Signup - Send Notification Email To</label>
            <input name="notifyEmails" value={form.notifyEmails} onChange={handleChange} className="w-full p-2 border rounded" type="email" placeholder="example@domain.com, support@domain.com" />
            <p className="text-xs text-gray-500 mt-1">Multiple emails must be separated by commas</p>
          </div>
        </div>
      </div>
            {/* Localize Calendar */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Localize Calendar</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              name="calendarLanguage"
              value={form.calendarLanguage}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Calendar Language</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
      </div>
            {/* Driver Tracking Options */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Driver Tracking Options</h2>
        <p className="text-sm text-gray-600 mb-4">Determine the driver online and offline status</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Tracking Option 1</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="trackingOption1"
                checked={form.trackingOption1}
                onChange={handleChange}
              />
              <span className="text-xs text-gray-600">This option sets the driver online when the device sends location to server</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tracking Option 2</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="trackingOption2"
                checked={form.trackingOption2}
                onChange={handleChange}
              />
              <span className="text-xs text-gray-600">This option sets driver offline only when they logout or are idle for more than 30 min</span>
            </div>
          </div>
          {renderSwitch("Record Driver Location", "recordLocation")}
          {renderSwitch("Disable Tracking", "disableTracking")}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Track Interval (seconds)</label>
            <input
              name="trackInterval"
              value={form.trackInterval}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              type="number"
            />
          </div>
        </div>
      </div>
            {/* Task Critical Options */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Task Critical Options</h2>
        <p className="text-sm text-gray-600 mb-4">Set critical background color to the task when it's unassigned after a set of minutes</p>
        <div className="grid gap-4 md:grid-cols-2">
          {renderSwitch("Enabled", "criticalEnabled")}
          <div>
            <label className="block text-sm font-medium mb-1">Minutes</label>
            <input
              name="criticalMinutes"
              value={form.criticalMinutes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              type="number"
            />
            <p className="text-xs text-gray-500">Default is 5 minutes</p>
          </div>
        </div>
      </div>
            {/* Privacy Policy */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Privacy Policy</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Link</label>
            <input
              name="privacyLink"
              value={form.privacyLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              type="url"
              placeholder="https://example.com/privacy"
            />
          </div>
        </div>
      </div>




      {/* Placeholder for other sections... */}

      <div>
        <h2 className="text-lg font-semibold mb-2">(More sections coming)</h2>
        <p className="text-gray-500">Remaining forms (Task Management, Order Settings, App Settings...) will be added in similar structure.</p>
      </div>

      <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow">
        Save
      </button>
    </form>
  );
}
