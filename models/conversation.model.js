import mongoose from "mongoose";
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    lawyerId: {
      type: String,
      required: true,
    },
    lawyerName: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    readByLawyer: {
      type: Boolean,
      required: true,
    },
    readByClient: {
      type: Boolean,
      required: true,
    },
    lastMessage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", ConversationSchema);
