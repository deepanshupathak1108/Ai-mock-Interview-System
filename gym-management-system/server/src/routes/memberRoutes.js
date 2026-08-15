import express from "express";
import {
  getMemberMetrics,
  listMembers,
  registerMember,
  renewMember,
  toggleMemberStatus,
} from "../controllers/memberController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/register", registerMember);
router.get("/list", listMembers);
router.get("/metrics", getMemberMetrics);
router.put("/update-status/:id", toggleMemberStatus);
router.post("/renew/:id", renewMember);

export default router;
