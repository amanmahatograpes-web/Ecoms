// backend/models/RoleAssignmentModel.js
import mongoose from "mongoose";

const roleAssignmentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String },
    email: { type: String },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    assignedOn: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive", "pending"], default: "active" },
    notes: { type: String }
  },
  { timestamps: true }
);

const RoleAssignment = mongoose.model("RoleAssignment", roleAssignmentSchema);
export default RoleAssignment;
