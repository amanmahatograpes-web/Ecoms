// components/RoleForm.jsx
import React, { useState } from "react";
import api from "../lib/api";

export default function RoleForm({ onCreated }) {
  const [form, setForm] = useState({ roleId: "", roleName: "", createdBy: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.roleId || !form.roleName || !form.createdBy) {
      setError("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/api/roles", form);
      onCreated?.(res.data);
      setForm({ roleId: "", roleName: "", createdBy: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="font-semibold mb-3">Create Role</h4>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Role ID"
          value={form.roleId}
          onChange={(e) => setForm({ ...form, roleId: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Role Name"
          value={form.roleName}
          onChange={(e) => setForm({ ...form, roleName: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Created By"
          value={form.createdBy}
          onChange={(e) => setForm({ ...form, createdBy: e.target.value })}
        />
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Role"}
          </button>
        </div>
      </form>
    </div>
  );
}
