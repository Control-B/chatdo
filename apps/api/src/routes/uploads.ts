import { Router } from "express";
import { getPresignedUrl, getFiles, deleteFile } from "../controllers/uploads";
import { authenticateToken, requireWorkspaceAccess } from "../middleware/auth";
import { validateBody } from "../middleware/validation";
import { presignedUploadSchema } from "@chatdo/shared";

const router = Router();

router.use(authenticateToken);

router.post(
  "/:workspaceId/presign",
  requireWorkspaceAccess(),
  validateBody(presignedUploadSchema),
  getPresignedUrl
);
router.get("/:workspaceId/files", requireWorkspaceAccess(), getFiles);
router.delete("/files/:fileId", deleteFile);

export default router;
