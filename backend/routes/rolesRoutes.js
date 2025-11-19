// backend/routes/rolesRoutes.js
import express from "express";
import { getRoles, createRole, deleteRole, updateRole } from "../controllers/RoleController.js";

const router = express.Router();

router.get("/", getRoles);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;
