import express from "express";
import {
  getCurrentOwner,
  loginOwner,
  registerOwner,
  requestPasswordOtp,
  resetOwnerPassword,
  verifyPasswordOtp,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerOwner);
router.post("/login", loginOwner);
router.post("/forgot-password/request-otp", requestPasswordOtp);
router.post("/forgot-password/verify-otp", verifyPasswordOtp);
router.post("/forgot-password/reset", resetOwnerPassword);
router.get("/me", authMiddleware, getCurrentOwner);

export default router;
