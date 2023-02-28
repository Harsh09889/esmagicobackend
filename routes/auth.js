import express from "express";
import {
	loginAdmin,
	loginUser,
	register,
} from "../controllers/authControllers.js";
import { refreshToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login/admin", loginAdmin);
router.post("/login/user", loginUser);
router.post("/token/refresh", refreshToken);

export default router;
