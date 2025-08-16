import { Router } from "express";
import { register, login, me } from "../controllers/auth";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../middleware/validation";
import { createUserSchema } from "@chatdo/shared";

const router = Router();

router.post("/register", validateBody(createUserSchema), register);
router.post("/login", login);
router.get("/me", authenticateToken, me);

export default router;
