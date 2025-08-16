import { Router } from "express";
import {
  createChannel,
  getChannel,
  updateChannel,
  joinChannel,
  leaveChannel,
} from "../controllers/channels";
import { authenticateToken, requireWorkspaceAccess } from "../middleware/auth";
import { validateBody } from "../middleware/validation";
import { createChannelSchema, updateChannelSchema } from "@chatdo/shared";

const router = Router();

router.use(authenticateToken);

router.post(
  "/:workspaceId/channels",
  requireWorkspaceAccess("admin"),
  validateBody(createChannelSchema),
  createChannel
);
router.get("/channels/:channelId", getChannel);
router.put(
  "/channels/:channelId",
  requireWorkspaceAccess("admin"),
  validateBody(updateChannelSchema),
  updateChannel
);
router.post("/channels/:channelId/join", joinChannel);
router.post("/channels/:channelId/leave", leaveChannel);

export default router;
