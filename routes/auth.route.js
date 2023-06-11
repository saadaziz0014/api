import express from "express";
import {
  register,
  login,
  logout,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  forgetpassword,
  otpenter,
  changepassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/registerAdmin", registerAdmin);

router.post("/login", login);
router.post("/loginAdmin", loginAdmin);

router.post("/logout", logout);
router.post("/logoutAdmin", logoutAdmin);

router.post("/forgetpassword", forgetpassword);
router.post("/otpenter", otpenter);
router.post("/changepassword", changepassword);

export default router;
