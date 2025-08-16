import { Router } from "express";
import {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/messages";
import { authenticateToken } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validation";
import {
  createMessageSchema,
  updateMessageSchema,
  messagesQuerySchema,
} from "@chatdo/shared";

const router = Router();

router.use(authenticateToken);

router.get("/", validateQuery(messagesQuerySchema), getMessages);
router.post("/", validateBody(createMessageSchema), createMessage);
router.put("/:messageId", validateBody(updateMessageSchema), updateMessage);
router.delete("/:messageId", deleteMessage);

export default router;
