import mongoose from "mongoose";
import Member from "../models/Member.js";
import { addDays, addMonths, currentMonthRange, endOfDay, startOfDay } from "../utils/dateUtils.js";

const PAGE_SIZE = 9;

const buildMemberLookup = (id, gymOwnerId) => {
  const conditions = [{ memberId: id }];

  if (mongoose.Types.ObjectId.isValid(id)) {
    conditions.push({ _id: id });
  }

  return { gymOwnerId, $or: conditions };
};

const getNextMemberId = async (gymOwnerId) => {
  let nextNumber = (await Member.countDocuments({ gymOwnerId })) + 1;
  let candidate = `M${nextNumber}`;

  while (await Member.exists({ gymOwnerId, memberId: candidate })) {
    nextNumber += 1;
    candidate = `M${nextNumber}`;
  }

  return candidate;
};

const getFilterQuery = (filter) => {
  const todayStart = startOfDay();
  const todayEnd = endOfDay();

  if (filter === "monthly") {
    const { start, end } = currentMonthRange();
    return { joinDate: { $gte: start, $lte: end } };
  }

  if (filter === "exp3") {
    return {
      status: "Active",
      nextBillDate: {
        $gte: todayStart,
        $lte: endOfDay(addDays(todayStart, 3)),
      },
    };
  }

  if (filter === "exp47") {
    return {
      status: "Active",
      nextBillDate: {
        $gte: startOfDay(addDays(todayStart, 4)),
        $lte: endOfDay(addDays(todayStart, 7)),
      },
    };
  }

  if (filter === "expired") {
    return {
      status: "Active",
      nextBillDate: { $lt: todayStart },
    };
  }

  if (filter === "inactive") {
    return { status: "Pending" };
  }

  return {};
};

const withSearch = (query, search) => {
  if (!search) {
    return query;
  }

  const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(safeSearch, "i");

  return {
    ...query,
    $or: [{ name: regex }, { phone: regex }],
  };
};

export const registerMember = async (req, res, next) => {
  try {
    const { name, phone, address, joinDate, planDuration, duration, planName, plan, photo, status } = req.body;
    const selectedDuration = Number(planDuration || duration);
    const selectedPlanName = planName || plan;

    if (!name || !phone || !joinDate || !selectedDuration || !selectedPlanName) {
      return res.status(400).json({
        message: "Name, phone, join date, plan duration, and plan name are required",
      });
    }

    const parsedJoinDate = new Date(joinDate);

    if (Number.isNaN(parsedJoinDate.getTime())) {
      return res.status(400).json({ message: "Join date is invalid" });
    }

    const memberId = await getNextMemberId(req.gymOwnerId);
    const nextBillDate = addMonths(parsedJoinDate, selectedDuration);

    const member = await Member.create({
      memberId,
      name,
      phone,
      address,
      joinDate: parsedJoinDate,
      nextBillDate,
      plan: selectedPlanName,
      status: status === "Pending" ? "Pending" : "Active",
      photo,
      gymOwnerId: req.gymOwnerId,
    });

    return res.status(201).json({
      message: "Member registered successfully",
      member,
    });
  } catch (error) {
    return next(error);
  }
};

export const listMembers = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page || "1", 10), 1);
    const filter = req.query.filter || "all";
    const search = (req.query.search || "").trim();

    const query = withSearch(
      {
        gymOwnerId: req.gymOwnerId,
        ...getFilterQuery(filter),
      },
      search
    );

    const [members, total] = await Promise.all([
      Member.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE),
      Member.countDocuments(query),
    ]);

    return res.json({
      members,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.max(Math.ceil(total / PAGE_SIZE), 1),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getMemberMetrics = async (req, res, next) => {
  try {
    const base = { gymOwnerId: req.gymOwnerId };
    const filters = {
      all: {},
      monthly: getFilterQuery("monthly"),
      exp3: getFilterQuery("exp3"),
      exp47: getFilterQuery("exp47"),
      expired: getFilterQuery("expired"),
      inactive: getFilterQuery("inactive"),
    };

    const [all, monthly, exp3, exp47, expired, inactive] = await Promise.all([
      Member.countDocuments({ ...base, ...filters.all }),
      Member.countDocuments({ ...base, ...filters.monthly }),
      Member.countDocuments({ ...base, ...filters.exp3 }),
      Member.countDocuments({ ...base, ...filters.exp47 }),
      Member.countDocuments({ ...base, ...filters.expired }),
      Member.countDocuments({ ...base, ...filters.inactive }),
    ]);

    const expiringSoon = exp3 + exp47;
    const activeMembership = Math.max(all - expiringSoon - expired - inactive, 0);

    return res.json({
      cards: {
        all,
        monthly,
        exp3,
        exp47,
        expired,
        inactive,
      },
      composition: {
        activeMembership,
        expiringSoon,
        expired,
        inactive,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const toggleMemberStatus = async (req, res, next) => {
  try {
    const member = await Member.findOne(buildMemberLookup(req.params.id, req.gymOwnerId));

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.status = member.status === "Active" ? "Pending" : "Active";
    await member.save();

    return res.json({
      message: `Member marked as ${member.status}`,
      member,
    });
  } catch (error) {
    return next(error);
  }
};

export const renewMember = async (req, res, next) => {
  try {
    const { planDuration, duration, planName, plan } = req.body;
    const selectedDuration = Number(planDuration || duration);
    const selectedPlanName = planName || plan;

    if (!selectedDuration || !selectedPlanName) {
      return res.status(400).json({ message: "Renewal plan name and duration are required" });
    }

    const member = await Member.findOne(buildMemberLookup(req.params.id, req.gymOwnerId));

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const today = startOfDay();
    member.joinDate = today;
    member.nextBillDate = addMonths(today, selectedDuration);
    member.plan = selectedPlanName;
    member.status = "Active";
    await member.save();

    return res.json({
      message: "Subscription renewed successfully",
      member,
    });
  } catch (error) {
    return next(error);
  }
};
