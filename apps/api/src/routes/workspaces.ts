import { Router } from "express";
import {
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  getMyWorkspaces,
} from "../controllers/workspaces";
import { authenticateToken, requireWorkspaceAccess } from "../middleware/auth";
import { validateBody } from "../middleware/validation";
import { createWorkspaceSchema, updateWorkspaceSchema } from "@chatdo/shared";

const router = Router();

router.use(authenticateToken);

router.post("/", validateBody(createWorkspaceSchema), createWorkspace);
router.get("/my", getMyWorkspaces);
router.get("/:workspaceId", requireWorkspaceAccess(), getWorkspace);
router.put(
  "/:workspaceId",
  requireWorkspaceAccess("admin"),
  validateBody(updateWorkspaceSchema),
  updateWorkspace
);

export default router;
