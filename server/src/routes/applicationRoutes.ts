import { requireAuth } from "../middleware/auth";
import { Router } from "express";
import * as controller from "../controllers/applicationController";

const router = Router();

router.use(requireAuth);

router.get("/", controller.list);
router.get("/usage", controller.getUsage);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
