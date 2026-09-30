import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as controller from "../controllers/paymentController";

const router = Router();

router.use(requireAuth);
router.get("/", controller.list);
router.post("/", controller.purchase);

export default router;