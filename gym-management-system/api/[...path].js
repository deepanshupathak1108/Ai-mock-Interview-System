import app from "../server/src/app.js";
import connectDB from "../server/src/config/db.js";

let dbPromise;

const ensureDB = () => {
  if (!dbPromise) {
    dbPromise = connectDB();
  }

  return dbPromise;
};

export default async function handler(req, res) {
  try {
    await ensureDB();
    return app(req, res);
  } catch (error) {
    console.error("API bootstrap failed:", error);
    return res.status(500).json({ message: "API failed to connect to the database" });
  }
}
