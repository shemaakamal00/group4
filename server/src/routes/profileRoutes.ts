import {Router} from "express";
import {requireAuth} from "../middleware/auth";
import * as controller from "../controllers/profileController";

const router = Router();

router.get('/me', requireAuth, controller.getMe);

export default router;