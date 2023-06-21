import express from "express";
import {
  register,
  login,
  logout,
  forgetpassword,
  otpenter,
  changepassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgetpassword", forgetpassword);
router.post("/otpenter", otpenter);
router.post("/changepassword", changepassword);

export default router;
