import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import * as controller from "../controllers/articleController";

const router = Router();

//Liten route/adminskydd
router.post(
  "/",
  requireAuth,
  requireAdmin,
  controller.create,
);

export default router;