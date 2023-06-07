import express from "express";
import { getLawyer } from "../controllers/admin.controller.js";
import { verifyTokenAdmin } from "../middleware/jwt.js";

const router = express.Router();

router.get("/lawyers",verifyTokenAdmin,getLawyer)

export default router;