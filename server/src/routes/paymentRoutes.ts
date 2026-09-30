import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as controller from "../controllers/paymentController";

const router = Router();

router.use(requireAuth);
router.post("/", controller.purchase);

export default router;