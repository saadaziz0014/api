import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import userModel from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(createError(401,"You are not authenticated!"))
  
  
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return next(createError(403,"Token is not valid!"))

    const data = await userModel.findOne({"tokens.token":token});

    const lawyer = data.isLawyer

    //console.log(`Is lawyer: ${lawyer}`);
    //console.log(payload._id);
    req.userId = payload._id;
    req.isLawyer = lawyer;
    next()
  });
};
