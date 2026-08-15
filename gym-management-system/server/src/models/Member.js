import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Member name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    joinDate: {
      type: Date,
      required: true,
    },
    nextBillDate: {
      type: Date,
      required: true,
    },
    plan: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Pending"],
      default: "Active",
    },
    photo: {
      type: String,
      default: "",
      trim: true,
    },
    gymOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymOwner",
      required: true,
      index: true,
    },
  },
  {
    id: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret.memberId;
        delete ret.memberId;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

memberSchema.virtual("id").get(function getMemberId() {
  return this.memberId;
});

memberSchema.index({ gymOwnerId: 1, memberId: 1 }, { unique: true });
memberSchema.index({ gymOwnerId: 1, phone: 1 });
memberSchema.index({ gymOwnerId: 1, name: "text", phone: "text" });

const Member = mongoose.model("Member", memberSchema);

export default Member;
