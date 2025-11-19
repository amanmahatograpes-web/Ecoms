// backend/models/RoleModel.js
import mongoose from "mongoose";

const permissionsSchema = new mongoose.Schema(
  {
    // flexible module permissions: create/edit/delete/approve/export/custom etc.
    create: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    export: { type: Boolean, default: false },
    approve: { type: Boolean, default: false },
    custom: { type: mongoose.Schema.Types.Mixed } // any extra permissions
  },
  { _id: false }
);

const roleSchema = new mongoose.Schema(
  {
    roleId: { type: String, required: true, unique: true, trim: true },
    roleName: { type: String, required: true, trim: true },
    createdBy: { type: String, required: true, trim: true },
    permissions: {
      // modules: dashboard, usermanagement, reports, settings, notification, etc
      type: Map,
      of: permissionsSchema,
      default: {}
    }
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
export default Role;
