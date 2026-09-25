import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as controller from "../controllers/goalController";

const router = Router();

router.use(requireAuth);

router.get("/", controller.list);
router.get("/usage", controller.getUsage);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
