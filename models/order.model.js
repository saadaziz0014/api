import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    lawyerId: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // payment_intent: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
