import bcrypt from "bcryptjs";
import GymOwner from "../models/GymOwner.js";
import MembershipPlan from "../models/MembershipPlan.js";
import sendOtpEmail from "../utils/sendOtpEmail.js";
import { signToken } from "../utils/token.js";

const defaultPlans = [
  { name: "1 Month", duration: 1, price: 1499 },
  { name: "3 Months", duration: 3, price: 3999 },
  { name: "12 Months", duration: 12, price: 12999 },
];

const ownerPayload = (owner) => ({
  id: owner._id,
  gymName: owner.gymName,
  email: owner.email,
  username: owner.username,
  logoUrl: owner.logoUrl,
});

export const registerOwner = async (req, res, next) => {
  try {
    const { gymName, email, username, password, logoUrl } = req.body;

    if (!gymName || !email || !username || !password) {
      return res.status(400).json({ message: "Gym name, email, username, and password are required" });
    }

    const existing = await GymOwner.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existing) {
      return res.status(409).json({ message: "An owner with this email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const owner = await GymOwner.create({
      gymName,
      email,
      username,
      password: hashedPassword,
      logoUrl,
    });

    await MembershipPlan.insertMany(
      defaultPlans.map((plan) => ({
        ...plan,
        gymOwnerId: owner._id,
      }))
    );

    const token = signToken(owner._id);

    return res.status(201).json({
      message: "Gym owner registered successfully",
      token,
      owner: ownerPayload(owner),
    });
  } catch (error) {
    return next(error);
  }
};

export const loginOwner = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const owner = await GymOwner.findOne({ username: username.toLowerCase() }).select("+password");

    if (!owner) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = signToken(owner._id);

    return res.json({
      message: "Login successful",
      token,
      owner: ownerPayload(owner),
    });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentOwner = async (req, res) => {
  return res.json({ owner: ownerPayload(req.owner) });
};

export const requestPasswordOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Registered email is required" });
    }

    const owner = await GymOwner.findOne({ email: email.toLowerCase() }).select(
      "+passwordResetOtp +passwordResetOtpExpires +passwordResetVerified"
    );

    if (!owner) {
      return res.status(404).json({ message: "No gym owner found with this email" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    owner.passwordResetOtp = await bcrypt.hash(otp, 10);
    owner.passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    owner.passwordResetVerified = false;
    await owner.save();

    const delivery = await sendOtpEmail({
      to: owner.email,
      otp,
      gymName: owner.gymName,
    });

    return res.json({
      message: "OTP sent to registered email",
      previewOtp: delivery.simulated ? otp : undefined,
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyPasswordOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const owner = await GymOwner.findOne({ email: email.toLowerCase() }).select(
      "+passwordResetOtp +passwordResetOtpExpires +passwordResetVerified"
    );

    if (!owner || !owner.passwordResetOtp || !owner.passwordResetOtpExpires) {
      return res.status(400).json({ message: "OTP was not requested or has expired" });
    }

    if (owner.passwordResetOtpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const isValid = await bcrypt.compare(String(otp), owner.passwordResetOtp);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    owner.passwordResetVerified = true;
    await owner.save();

    return res.json({ message: "OTP verified successfully" });
  } catch (error) {
    return next(error);
  }
};

export const resetOwnerPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const owner = await GymOwner.findOne({ email: email.toLowerCase() }).select(
      "+password +passwordResetOtp +passwordResetOtpExpires +passwordResetVerified"
    );

    if (!owner || !owner.passwordResetVerified || owner.passwordResetOtpExpires < new Date()) {
      return res.status(400).json({ message: "OTP verification is required before updating password" });
    }

    owner.password = await bcrypt.hash(password, 12);
    owner.passwordResetOtp = undefined;
    owner.passwordResetOtpExpires = undefined;
    owner.passwordResetVerified = false;
    await owner.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return next(error);
  }
};
