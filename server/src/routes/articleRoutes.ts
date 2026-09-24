import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import * as controller from "../controllers/articleController";

const router = Router();

router.get(
  '/',
  requireAuth,
  controller.list,
);

router.get(
  "/:id",
  requireAuth,
  controller.getById,
);

//Liten adminskydd
router.post(
  '/',
  requireAuth,
  requireAdmin,
  controller.create,
);


export default router;