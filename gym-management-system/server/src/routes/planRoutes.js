import express from "express";
import { createPlan, listPlans, togglePlan } from "../controllers/planController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listPlans);
router.post("/", createPlan);
router.patch("/:id/toggle", togglePlan);

export default router;
