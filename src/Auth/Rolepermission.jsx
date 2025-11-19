// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const MODULES = ["dashboard", "usermanagement", "reports", "settings", "notification"];

// const RolePermissionPage = () => {
//   const [roles, setRoles] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [form, setForm] = useState({ roleId: "", roleName: "", createdBy: "" });

//   useEffect(() => {
//     fetchRoles();
//     fetchAssignments();
//   }, []);

//   const fetchRoles = async () => {
//     const res = await axios.get("http://localhost:8000/api/roles");
//     setRoles(res.data);
//   };

//   const fetchAssignments = async () => {
//     const res = await axios.get("http://localhost:8000/api/assignments");
//     setAssignments(res.data);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("http://localhost:8000/api/roles", form);
//     fetchRoles();
//     setForm({ roleId: "", roleName: "", createdBy: "" });
//   };

//   const removeRole = async (id) => {
//     await axios.delete(`http://localhost:8000/api/roles/${id}`);
//     fetchRoles();
//   };

//   return (
//     <div className="rp-container p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-semibold mb-4">Role & Permission Management</h2>

//       {/* Form */}
//       <form className="rp-form grid grid-cols-3 gap-4 mb-6 bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
//         <input type="text" placeholder="Role ID" className="border p-2 rounded" value={form.roleId}
//           onChange={(e) => setForm({ ...form, roleId: e.target.value })} required />
//         <input type="text" placeholder="Role Name" className="border p-2 rounded" value={form.roleName}
//           onChange={(e) => setForm({ ...form, roleName: e.target.value })} required />
//         <input type="text" placeholder="Created By" className="border p-2 rounded" value={form.createdBy}
//           onChange={(e) => setForm({ ...form, createdBy: e.target.value })} required />
//         <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">Submit</button>
//       </form>

//       {/* Roles Table */}
//       <div className="overflow-x-auto bg-white p-4 rounded shadow">
//         <h3 className="font-medium mb-2">Roles Overview</h3>
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th>Role Name</th>
//               <th>Role ID</th>
//               <th>Created By</th>
//               <th>Modules</th>
//               <th className="text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.map((r) => (
//               <tr key={r._id} className="border-t">
//                 <td>{r.roleName}</td>
//                 <td>{r.roleId}</td>
//                 <td>{r.createdBy}</td>
//                 <td>
//                   <div className="flex flex-wrap gap-1">
//                     {MODULES.map((m) => {
//                       const summary = Object.entries(r.permissions?.[m] || {})
//                         .filter(([k, v]) => v)
//                         .map(([k]) => k)
//                         .join(", ") || "-";
//                       return (
//                         <span key={m} className="rpm-chip text-sm px-2 py-1 rounded border bg-gray-50">
//                           {m}: {summary}
//                         </span>
//                       );
//                     })}
//                   </div>
//                 </td>
//                 <td className="text-right">
//                   <div className="flex justify-end gap-2">
//                     <button className="px-2 py-1 rounded border">Edit</button>
//                     <button onClick={() => removeRole(r._id)} className="px-2 py-1 rounded border text-red-500">
//                       Delete
//                     </button>
//                     <button className="px-2 py-1 rounded border">Manage</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Assignments Table */}
//       <h3 className="mt-6 font-medium">Role Assignments</h3>
//       <div className="overflow-x-auto mt-2 bg-white p-4 rounded shadow">
//         <table className="w-full border-collapse rpm-table">
//           <thead>
//             <tr className="bg-gray-100">
//               <th>User ID / Name</th>
//               <th>Email</th>
//               <th>Assigned On</th>
//               <th>Status</th>
//               <th>Role</th>
//             </tr>
//           </thead>
//           <tbody>
//             {assignments.map((a) => (
//               <tr key={a._id} className="border-t">
//                 <td>{a.userName || a.userId}</td>
//                 <td>{a.email || "-"}</td>
//                 <td>{new Date(a.assignedOn).toLocaleString()}</td>
//                 <td>{a.status}</td>
//                 <td>{roles.find((r) => r._id === a.roleId)?.roleName || "-"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RolePermissionPage;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaEdit, FaTrash, FaCog } from "react-icons/fa";

// const MODULES = ["dashboard", "usermanagement", "reports", "settings", "notification"];
// const FEATURES = ["view", "create", "edit", "delete", "approve", "export"];

// const RolePermissionPage = () => {
//   const [roles, setRoles] = useState([]);
//   const [assignments, setAssignments] = useState([]);
//   const [form, setForm] = useState({ roleId: "", roleName: "", createdBy: "" });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [showPermissionModal, setShowPermissionModal] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);

//   // ---------------------- FETCH DATA ----------------------
//   useEffect(() => {
//     fetchRoles();
//     fetchAssignments();
//   }, []);

//   const fetchRoles = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:8000/api/roles");
//       setRoles(res.data?.roles || res.data);
//     } catch (err) {
//       setError("Failed to load roles");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAssignments = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/assignments");
//       setAssignments(res.data?.assignments || res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ---------------------- HANDLE FORM ----------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.roleId || !form.roleName || !form.createdBy)
//       return setError("Please fill all fields");

//     try {
//       setLoading(true);
//       await axios.post("http://localhost:8000/api/roles", form);
//       setMessage("✅ Role created successfully!");
//       setForm({ roleId: "", roleName: "", createdBy: "" });
//       fetchRoles();
//     } catch (err) {
//       setError("Failed to create role");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeRole = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this role?")) return;
//     try {
//       await axios.delete(`http://localhost:8000/api/roles/${id}`);
//       fetchRoles();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ---------------------- MANAGE PERMISSIONS ----------------------
//   const openPermissionModal = (role) => {
//     setSelectedRole(role);
//     setShowPermissionModal(true);
//   };

//   const togglePermission = (module, feature) => {
//     setSelectedRole((prev) => {
//       const updated = { ...prev };
//       if (!updated.permissions) updated.permissions = {};
//       if (!updated.permissions[module]) updated.permissions[module] = {};
//       updated.permissions[module][feature] =
//         !updated.permissions[module][feature];
//       return updated;
//     });
//   };

//   const savePermissions = async () => {
//     try {
//       await axios.put(`http://localhost:8000/api/roles/${selectedRole._id}`, {
//         permissions: selectedRole.permissions,
//       });
//       setShowPermissionModal(false);
//       fetchRoles();
//     } catch (err) {
//       setError("Failed to update permissions");
//     }
//   };

//   // ---------------------- RENDER UI ----------------------
//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h2 className="text-3xl font-semibold mb-6 text-gray-800">
//         🛡️ Role & Permission Management
//       </h2>

//       {error && <p className="text-red-600 mb-2">{error}</p>}
//       {message && <p className="text-green-600 mb-2">{message}</p>}

//       {/* Create Role Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-5 rounded-lg shadow"
//       >
//         <input
//           type="text"
//           placeholder="Role ID"
//           value={form.roleId}
//           onChange={(e) => setForm({ ...form, roleId: e.target.value })}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Role Name"
//           value={form.roleName}
//           onChange={(e) => setForm({ ...form, roleName: e.target.value })}
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Created By"
//           value={form.createdBy}
//           onChange={(e) => setForm({ ...form, createdBy: e.target.value })}
//           className="border p-2 rounded"
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
//         >
//           {loading ? "Saving..." : "Add Role"}
//         </button>
//       </form>

//       {/* Roles Table */}
//       <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
//         <h3 className="text-lg font-medium p-4 border-b bg-gray-100">
//           Roles Overview
//         </h3>
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="text-left p-3">Role Name</th>
//               <th className="text-left p-3">Role ID</th>
//               <th className="text-left p-3">Created By</th>
//               <th className="text-left p-3">Permissions</th>
//               <th className="text-right p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.length > 0 ? (
//               roles.map((r) => (
//                 <tr key={r._id} className="border-t hover:bg-gray-50">
//                   <td className="p-3">{r.roleName}</td>
//                   <td className="p-3">{r.roleId}</td>
//                   <td className="p-3">{r.createdBy}</td>
//                   <td className="p-3">
//                     <div className="flex flex-wrap gap-1">
//                       {MODULES.map((m) => {
//                         const summary =
//                           Object.entries(r.permissions?.[m] || {})
//                             .filter(([_, v]) => v)
//                             .map(([k]) => k)
//                             .join(", ") || "-";
//                         return (
//                           <span
//                             key={m}
//                             className="border px-2 py-1 rounded bg-gray-100"
//                           >
//                             {m}: {summary}
//                           </span>
//                         );
//                       })}
//                     </div>
//                   </td>
//                   <td className="p-3 text-right">
//                     <div className="flex justify-end gap-2">
//                       <button
//                         onClick={() => openPermissionModal(r)}
//                         className="px-2 py-1 border rounded flex items-center gap-1 hover:bg-blue-50"
//                       >
//                         <FaCog /> Manage
//                       </button>
//                       <button
//                         onClick={() => removeRole(r._id)}
//                         className="px-2 py-1 border rounded text-red-500 hover:bg-red-50 flex items-center gap-1"
//                       >
//                         <FaTrash /> Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center p-3 text-gray-500">
//                   No roles found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Role Assignments Table */}
//       <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
//         <h3 className="text-lg font-medium p-4 border-b bg-gray-100">
//           Role Assignments
//         </h3>
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="text-left p-3">User ID / Name</th>
//               <th className="text-left p-3">Email</th>
//               <th className="text-left p-3">Assigned On</th>
//               <th className="text-left p-3">Status</th>
//               <th className="text-left p-3">Role</th>
//             </tr>
//           </thead>
//           <tbody>
//             {assignments.length > 0 ? (
//               assignments.map((a) => (
//                 <tr key={a._id} className="border-t">
//                   <td className="p-3">{a.userName || a.userId}</td>
//                   <td className="p-3">{a.email}</td>
//                   <td className="p-3">
//                     {a.assignedOn
//                       ? new Date(a.assignedOn).toLocaleString()
//                       : "-"}
//                   </td>
//                   <td className="p-3">{a.status}</td>
//                   <td className="p-3">
//                     {roles.find((r) => r._id === a.roleId)?.roleName || "-"}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center p-3 text-gray-500">
//                   No role assignments found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PERMISSION MODAL */}
//       {showPermissionModal && selectedRole && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//           <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto p-6">
//             <h3 className="text-xl font-semibold mb-4">
//               Manage Permissions – {selectedRole.roleName}
//             </h3>
//             {MODULES.map((mod) => (
//               <div key={mod} className="mb-3">
//                 <h4 className="font-medium mb-2 capitalize">{mod}</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {FEATURES.map((f) => (
//                     <label
//                       key={f}
//                       className="flex items-center gap-1 text-sm border px-2 py-1 rounded cursor-pointer"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedRole.permissions?.[mod]?.[f] || false}
//                         onChange={() => togglePermission(mod, f)}
//                       />
//                       {f}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => setShowPermissionModal(false)}
//                 className="px-3 py-1 border rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={savePermissions}
//                 className="px-3 py-1 bg-blue-600 text-white rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//     </div>
//   );
// };

// export default RolePermissionPage;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaCog } from "react-icons/fa";

const MODULES = [
  "products",
  "orders",
  "inventory",
  "customers",
  "billing",
  "reports",
  "shipping",
  "users",
  "settings",
];

const FEATURES = [
  "view",
  "create",
  "edit",
  "delete",
  "update",
  "approve",
  "export",
  "cancel",
  "pack",
  "ship",
];

const RolePermissionPage = () => {
  const [roles, setRoles] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ roleId: "", roleName: "", createdBy: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchAssignments();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/roles");
      setRoles(res.data?.roles || res.data);
    } catch (err) {
      setError("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/assignments");
      setAssignments(res.data?.assignments || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.roleId || !form.roleName || !form.createdBy)
      return setError("Please fill all fields");

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/roles", form);
      setMessage("Role created successfully!");
      setForm({ roleId: "", roleName: "", createdBy: "" });
      fetchRoles();
    } catch (err) {
      setError("Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  const removeRole = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/roles/${id}`);
      fetchRoles();
    } catch (err) {
      console.error(err);
    }
  };

  // Open Amazon IAM-like Permissions Modal
  const openPermissionModal = (role) => {
    const initialized = { ...role };

    if (!initialized.permissions) {
      initialized.permissions = {};
    }

    MODULES.forEach((m) => {
      if (!initialized.permissions[m]) {
        initialized.permissions[m] = {};
      }
      FEATURES.forEach((f) => {
        if (initialized.permissions[m][f] === undefined)
          initialized.permissions[m][f] = false;
      });
    });

    setSelectedRole(initialized);
    setShowPermissionModal(true);
  };

  const togglePermission = (module, feature) => {
    setSelectedRole((prev) => {
      const updated = { ...prev };
      updated.permissions[module][feature] =
        !updated.permissions[module][feature];
      return updated;
    });
  };

  const toggleAllForModule = (module, value) => {
    setSelectedRole((prev) => {
      const updated = { ...prev };
      FEATURES.forEach((f) => (updated.permissions[module][f] = value));
      return updated;
    });
  };

  const savePermissions = async () => {
    try {
      await axios.put(`http://localhost:8000/api/roles/${selectedRole._id}`, {
        permissions: selectedRole.permissions,
      });
      setShowPermissionModal(false);
      fetchRoles();
    } catch (err) {
      setError("Failed to update permissions");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Amazon-Style Role Management</h2>

      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      {/* Create Role */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-5 rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Role ID (ADMIN / SELLER)"
          value={form.roleId}
          onChange={(e) => setForm({ ...form, roleId: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Role Name"
          value={form.roleName}
          onChange={(e) => setForm({ ...form, roleName: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Created By"
          value={form.createdBy}
          onChange={(e) => setForm({ ...form, createdBy: e.target.value })}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add Role"}
        </button>
      </form>

      {/* Roles List */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b bg-gray-100">
          Role Overview
        </h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Permissions</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length ? (
              roles.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <b>{r.roleName}</b>
                    <div className="text-xs text-gray-500">{r.roleId}</div>
                  </td>

                  <td className="p-3">
                    <div className="grid grid-cols-2 gap-1">
                      {MODULES.map((m) => {
                        const summary =
                          Object.entries(r?.permissions?.[m] || {})
                            .filter(([_, v]) => v)
                            .map(([k]) => k)
                            .join(", ") || "No Access";

                        return (
                          <span key={m} className="px-2 py-1 text-xs bg-gray-100 rounded">
                            <b>{m}</b>: {summary}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => openPermissionModal(r)}
                      className="px-3 py-1 border rounded mr-2"
                    >
                      <FaCog /> Manage
                    </button>
                    <button
                      onClick={() => removeRole(r._id)}
                      className="px-3 py-1 text-red-600 border rounded"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Permissions Modal */}
      {showPermissionModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[650px] max-h-[80vh] overflow-y-auto shadow-xl">
            <h3 className="text-xl font-bold mb-4">
              Permissions – {selectedRole.roleName}
            </h3>

            {MODULES.map((mod) => (
              <div key={mod} className="mb-4 border-b pb-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold capitalize text-lg">{mod}</h4>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAllForModule(mod, true)}
                      className="text-xs px-2 py-1 bg-green-100 border rounded"
                    >
                      Allow All
                    </button>
                    <button
                      onClick={() => toggleAllForModule(mod, false)}
                      className="text-xs px-2 py-1 bg-red-100 border rounded"
                    >
                      Remove All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {FEATURES.map((f) => (
                    <label
                      key={f}
                      className="flex items-center gap-2 border p-2 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRole.permissions[mod][f]}
                        onChange={() => togglePermission(mod, f)}
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={savePermissions}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePermissionPage;
