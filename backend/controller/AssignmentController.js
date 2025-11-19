// backend/controllers/AssignmentController.js
import RoleAssignment from "../models/RoleAssignmentModel.js";
import Role from "../models/RoleModel.js";

/**
 * GET /api/assignments
 * list of user-role assignments
 */
export const getAssignments = async (req, res) => {
  try {
    const assignments = await RoleAssignment.find().sort({ assignedOn: -1 });
    res.json({ success: true, assignments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch assignments" });
  }
};

/**
 * POST /api/assignments
 * body: { userId, userName, email, roleId, status, notes }
 * roleId may be either role._id (ObjectId) or roleId string; we'll accept ObjectId
 */
export const createAssignment = async (req, res) => {
  try {
    const { userId, userName, email, roleId, status, notes } = req.body;
    if (!userId || !roleId) {
      return res.status(400).json({ success: false, message: "userId and roleId are required" });
    }

    // verify role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    const assignment = await RoleAssignment.create({ userId, userName, email, roleId, status, notes });
    res.status(201).json({ success: true, assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create assignment" });
  }
};

/**
 * DELETE /api/assignments/:id
 */
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await RoleAssignment.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.json({ success: true, message: "Assignment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete assignment" });
  }
};
