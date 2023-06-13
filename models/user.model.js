import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bardcard: {
      type: String,
      required: false,
    },
    dp: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    isLawyer: {
      type: Boolean,
      default: false,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

export default mongoose.model("User", userSchema);
