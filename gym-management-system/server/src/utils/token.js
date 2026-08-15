import jwt from "jsonwebtoken";

export const signToken = (ownerId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: ownerId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
