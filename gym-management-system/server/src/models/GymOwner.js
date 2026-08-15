import mongoose from "mongoose";

const gymOwnerSchema = new mongoose.Schema(
  {
    gymName: {
      type: String,
      required: [true, "Gym name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    logoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    passwordResetOtp: {
      type: String,
      select: false,
    },
    passwordResetOtpExpires: {
      type: Date,
      select: false,
    },
    passwordResetVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.passwordResetOtp;
        delete ret.passwordResetOtpExpires;
        delete ret.passwordResetVerified;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const GymOwner = mongoose.model("GymOwner", gymOwnerSchema);

export default GymOwner;
