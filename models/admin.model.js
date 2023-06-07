import mongoose from "mongoose";
import { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: String,
    },
  ],
});

adminSchema.methods.generateAuthToken = async function () {
    try {
      let token = jwt.sign({ _id: this._id }, process.env.JWT_KEYA);
      this.tokens = this.tokens.concat({ token});
      await this.save();
      return token;
    } catch (err) {
      console.log(err);
    }
  };
  

export default mongoose.model("Admin",adminSchema);