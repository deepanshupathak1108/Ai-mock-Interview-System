import MembershipPlan from "../models/MembershipPlan.js";

export const listPlans = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find({ gymOwnerId: req.gymOwnerId }).sort({
      isActive: -1,
      duration: 1,
      createdAt: -1,
    });

    return res.json({ plans });
  } catch (error) {
    return next(error);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const { name, duration, price } = req.body;

    if (!name || !duration || price === undefined) {
      return res.status(400).json({ message: "Plan name, duration, and price are required" });
    }

    const plan = await MembershipPlan.create({
      name,
      duration: Number(duration),
      price: Number(price),
      gymOwnerId: req.gymOwnerId,
    });

    return res.status(201).json({
      message: "Membership plan created",
      plan,
    });
  } catch (error) {
    return next(error);
  }
};

export const togglePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findOne({
      _id: req.params.id,
      gymOwnerId: req.gymOwnerId,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    plan.isActive = !plan.isActive;
    await plan.save();

    return res.json({
      message: `Plan ${plan.isActive ? "activated" : "paused"}`,
      plan,
    });
  } catch (error) {
    return next(error);
  }
};
