import express from "express";
import {
	deleteUser,
	getLoggedInUser,
	getUser,
	getUsers,
	updateUser,
} from "../controllers/userControllers.js";
import { verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/checkauthentication", verifyToken, (req, res, next) => {
	res.send("Hello User you have been logged in !");
});

// router.get("/checkuser/:id", verifyUser, (req, res, next) => {
// 	res.send("Hello User you are logged in and you can update your account !");
// });

//UPDATE
router.put("/:id", verifyUser, updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/:id", getUser);
router.get("/get/loggedinuser", verifyToken, getLoggedInUser);

//GETALL
router.get("/", getUsers);

export default router;
