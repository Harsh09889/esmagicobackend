import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import {
	GMAIL_PASSWORD,
	GMAIL_USERNAME,
	JWT_ACCESS_TOKEN__SECRET,
	JWT_REFRESH_TOKEN__SECRET,
} from "../config/config.js";
import Token from "../models/Token.js";

export const register = async (req, res, next) => {
	const { username, name, email, password } = req.body;

	if (!username || !email || !password || !name) {
		return res.status(400).send({
			error: "Incomplete data",
		});
	}

	try {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(req.body.password, salt);

		const newUser = new User({
			username: req.body.username,
			name: req.body.name,
			password: hash,
			email: req.body.email,
			role: req.body.role ? req.body.role : "user",
		});

		//////////////////////////////

		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: GMAIL_USERNAME,
				pass: GMAIL_PASSWORD,
			},
		});

		const token = jwt.sign(newUser._doc, JWT_ACCESS_TOKEN__SECRET, {
			expiresIn: "1d",
		});

		const url = `http://localhost:3000/confirmation/${token}`;

		transporter.sendMail({
			to: newUser.email,
			subject: "Confirm Email",
			html: `Please Click on the following link to Confirm Your Email : <a href="${url}">${url}</a>`,
		});

		////////////////////////////////////

		await newUser.save();
		res.status(201).send("User succesfuly created");
	} catch (err) {
		next(err);
	}
};

export const loginAdmin = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).send({
			error: "Incomplete data",
		});
	}

	try {
		const user = await User.findOne({ email: req.body.email, role: "admin" });

		if (!user) return next(createError(404, "User does not exist!!"));

		const isPasswordCorrect = await bcrypt.compare(
			req.body.password,
			user.password
		);

		if (!isPasswordCorrect)
			return next(createError(401, "Username or Password is Wrong"));

		const token = jwt.sign(user._doc, JWT_ACCESS_TOKEN__SECRET, {
			expiresIn: "1d",
		});

		const refreshToken = jwt.sign(user._doc, JWT_REFRESH_TOKEN__SECRET);

		const tokenSubmitted = await Token.create({ token: refreshToken });

		const { isAdmin, password, ...otherDetails } = user._doc;

		res
			.cookie("access_token", token, {
				httpOnly: true,
			})
			.cookie("refresh_token", refreshToken, {
				httpOnly: true,
			})
			.status(200)
			.json({ user: otherDetails, token, refreshToken });
	} catch (err) {
		next(err);
	}
};

export const loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).send({
			error: "Incomplete data",
		});
	}

	try {
		const user = await User.findOne({ email: req.body.email, role: "user" });

		if (!user) return next(createError(404, "User does not exist!!"));

		const isPasswordCorrect = await bcrypt.compare(
			req.body.password,
			user.password
		);

		if (!isPasswordCorrect)
			return next(createError(401, "Username or Password is Wrong"));

		const token = jwt.sign(user._doc, JWT_ACCESS_TOKEN__SECRET, {
			expiresIn: "1h",
		});

		const refreshToken = jwt.sign(user._doc, JWT_REFRESH_TOKEN__SECRET);

		const tokenSubmitted = await Token.create({ token: refreshToken });

		const { isAdmin, password, ...otherDetails } = user._doc;

		res
			.cookie("access_token", token, {
				httpOnly: true,
			})
			.cookie("refresh_token", refreshToken, {
				httpOnly: true,
			})
			.status(200)
			.json({ user: otherDetails, token, refreshToken });
	} catch (err) {
		next(err);
	}
};

// export const forgotPassword = (req, res, next) => {
// 	const { email } = req.body;
// 	if (!email) return next(createError(401, "Email not provided"));
// 	const
// };
