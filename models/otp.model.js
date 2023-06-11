import mongoose from "mongoose";
import { Schema } from "mongoose";

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Otp", otpSchema);
