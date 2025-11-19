// backend/controllers/RoleController.js
import Role from "../models/RoleModel.js";

/**
 * GET /api/roles
 * returns list of roles
 */
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json({ success: true, roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};

/**
 * POST /api/roles
 * create a role
 * body: { roleId, roleName, createdBy, permissions (object) }
 */
export const createRole = async (req, res) => {
  try {
    const { roleId, roleName, createdBy, permissions } = req.body;
    if (!roleId || !roleName || !createdBy) {
      return res.status(400).json({ success: false, message: "roleId, roleName and createdBy are required" });
    }

    // uniqueness check
    const existing = await Role.findOne({ $or: [{ roleId }, { roleName }] });
    if (existing) {
      return res.status(409).json({ success: false, message: "Role ID or Role Name already exists" });
    }

    const role = await Role.create({ roleId, roleName, createdBy, permissions });
    res.status(201).json({ success: true, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create role" });
  }
};

/**
 * DELETE /api/roles/:id
 */
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndDelete(id);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    res.json({ success: true, message: "Role deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete role" });
  }
};

/**
 * PUT /api/roles/:id
 * update role (permissions or name)
 */
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const role = await Role.findByIdAndUpdate(id, updates, { new: true });
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    res.json({ success: true, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update role" });
  }
};
