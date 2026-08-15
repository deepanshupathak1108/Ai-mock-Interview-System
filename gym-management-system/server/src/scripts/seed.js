import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import GymOwner from "../models/GymOwner.js";
import Member from "../models/Member.js";
import MembershipPlan from "../models/MembershipPlan.js";
import { addDays, addMonths, startOfDay } from "../utils/dateUtils.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  const email = "owner@fitforge.test";
  const username = "fitforge";
  let owner = await GymOwner.findOne({ email });

  if (!owner) {
    owner = await GymOwner.create({
      gymName: "FitForge Club",
      email,
      username,
      password: await bcrypt.hash("password123", 12),
      logoUrl:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=256&q=80",
    });
  }

  await MembershipPlan.deleteMany({ gymOwnerId: owner._id });
  const plans = await MembershipPlan.insertMany([
    { name: "1 Month", duration: 1, price: 1499, gymOwnerId: owner._id },
    { name: "3 Months", duration: 3, price: 3999, gymOwnerId: owner._id },
    { name: "6 Months", duration: 6, price: 6999, gymOwnerId: owner._id },
    { name: "Annual Pro", duration: 12, price: 11999, gymOwnerId: owner._id },
  ]);

  await Member.deleteMany({ gymOwnerId: owner._id });

  const today = startOfDay();
  const sampleNames = [
    "Aarav Mehta",
    "Diya Sharma",
    "Kabir Rao",
    "Maya Iyer",
    "Rohan Sethi",
    "Anika Bose",
    "Vihaan Nair",
    "Sara Khan",
    "Ishaan Gill",
    "Tara Kapoor",
    "Arjun Das",
    "Nisha Patel",
  ];

  await Member.insertMany(
    sampleNames.map((name, index) => {
      const plan = plans[index % plans.length];
      const joinDate = addDays(today, -index * 4);
      const specialNextDates = [addDays(today, -2), today, addDays(today, 2), addDays(today, 5)];

      return {
        memberId: `M${index + 1}`,
        name,
        phone: `9876500${String(index + 1).padStart(3, "0")}`,
        address: `${12 + index}, Central Fitness Street`,
        joinDate,
        nextBillDate: specialNextDates[index] || addMonths(joinDate, plan.duration),
        plan: plan.name,
        status: index === 7 || index === 10 ? "Pending" : "Active",
        photo: `https://i.pravatar.cc/160?img=${index + 12}`,
        gymOwnerId: owner._id,
      };
    })
  );

  console.log("Seed complete");
  console.log("Login username: fitforge");
  console.log("Login password: password123");

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
