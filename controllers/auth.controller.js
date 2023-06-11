import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import Otp from "../models/otp.model.js";
import nodemailer from "nodemailer";
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
    const user = await User.findOne({ email: req.body.email });

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
    res
      .cookie("accessToken", token, {
        expires: new Date(Date.now() + 80 * 60000),
        httpOnly: true,
      })
      .send(info);
  } catch (err) {
    next(err);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) return next(createError(404, "Incorrect Credentials"));

    const isCorrect = bcrypt.compareSync(req.body.password, admin.password);
    if (!isCorrect) return next(createError(400, "Wrong password!"));

    // const token = jwt.sign(
    //   {
    //     id: user._id,
    //     isLawyer: user.isLawyer,
    //   },
    //   process.env.JWT_KEY
    // );
    const token = await admin.generateAuthToken();
    const { password, ...info } = admin._doc;
    res
      .cookie("accessTokenAdmin", token, {
        expires: new Date(Date.now() + 80 * 60000),
        httpOnly: true,
      })
      .send(info);
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

export const forgetpassword = async (req, res) => {
  try {
    const otp = Math.round(Math.random() * 1000000 + 1);
    const deleteop = await Otp.deleteOne({ email: req.body.email });
    if (deleteop) {
      const otpS = new Otp({ email: req.body.email, otp });
      await otpS.save();
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saadaziz0014@gmail.com",
        pass: process.env.apppass,
      },
    });

    const mailOptions = {
      from: "saadaziz0014@gmail.com",
      to: req.body.email,
      subject: "OTP",
      text: `Your OTP is ${otp}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(401).send("Error");
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).send("Email Sent");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const otpenter = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await Otp.findOne({ email, otp });
    if (result) {
      res.status(201).send("Correct");
    } else {
      res.status(403).send("Not Correct");
    }
  } catch (err) {
    console.log(err);
  }
};

export const changepassword = async (req, res) => {
  try {
    let { email, password } = req.body;
    password = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email });
    if (user) {
      const change = await User.updateOne({ email }, { $set: { password } });
      if (change) {
        res.status(201).send("Password Changed");
      } else {
        res.status(401).send("Error in Changing Paasword");
      }
    } else {
      res.status(402).send("Sign Up First");
    }
  } catch (err) {
    console.log(err);
  }
};
