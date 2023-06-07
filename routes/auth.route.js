import express from "express";
import { register, login, logout, loginAdmin, logoutAdmin, registerAdmin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/registerAdmin", registerAdmin);

router.post("/login", login)
router.post("/loginAdmin",loginAdmin);

router.post("/logout", logout)
router.post("/logoutAdmin",logoutAdmin);

export default router;
