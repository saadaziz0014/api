import User from "../models/user.model.js";
import Admin from '../models/admin.model.js';
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const registerAdmin = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const email = req.body.email;
    const admin = new Admin({
      email,
      password: hash,
    });

    await admin.save();
    res.status(201).send("Admin Saved");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    // const token = jwt.sign(
    //   {
    //     id: user._id,
    //     isLawyer: user.isLawyer,
    //   },
    //   process.env.JWT_KEY
    // );
    const token = await user.generateAuthToken();
    const { password, ...info } = user._doc;
    res.cookie(
      "accessToken",
      token,
      {
        expires: new Date(Date.now() + 80 * 60000),
        httpOnly: true,
      }
    ).send(info);
  } catch (err) {
    next(err);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) return next(createError(404, "Incorrect Credentials"));

    const isCorrect = bcrypt.compareSync(req.body.password, admin.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password!"));

    // const token = jwt.sign(
    //   {
    //     id: user._id,
    //     isLawyer: user.isLawyer,
    //   },
    //   process.env.JWT_KEY
    // );
    const token = await admin.generateAuthToken();
    const { password, ...info } = admin._doc;
    res.cookie(
      "accessTokenAdmin",
      token,
      {
        expires: new Date(Date.now() + 80 * 60000),
        httpOnly: true,
      }
    ).send(info);
  } catch (err) {
    next(err);
  }
};


export const logoutAdmin = async (req, res) => {
  res
    .clearCookie("accessTokenAdmin", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("Admin has been logged out.");
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
