import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as controller from "../controllers/profileController";

const router = Router();

router.use(requireAuth);
router.get("/", controller.getMe);
router.patch("/", controller.updateMe);

export default router;