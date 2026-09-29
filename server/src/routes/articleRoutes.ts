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

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  controller.update,
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  controller.remove,
);


export default router;