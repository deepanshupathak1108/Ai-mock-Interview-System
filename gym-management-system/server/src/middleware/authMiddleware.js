import jwt from "jsonwebtoken";
import GymOwner from "../models/GymOwner.js";

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const owner = await GymOwner.findById(decoded.id);

    if (!owner) {
      return res.status(401).json({ message: "Owner account no longer exists" });
    }

    req.owner = owner;
    req.gymOwnerId = owner._id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

export default authMiddleware;
