import jwt from "jsonwebtoken";
import Token from "../models/Token.js";
import { createError } from "./error.js";
import { JWT_ACCESS_TOKEN__SECRET } from "../config/config.js";

export const verifyToken = (req, res, next) => {
	const authorization = req.headers["authorization"];

	// validate the token

	if (authorization) {
		const token = authorization.split(" ").pop();

		if (!token) {
			return next(createError(401, "You are not authenticated !!"));
		}

		jwt.verify(token, JWT_ACCESS_TOKEN__SECRET, (err, user) => {
			if (err) return next(createError(403, "Token is not Valid!"));
			req.user = user;
			next();
		});
	} else {
		return next(createError(401, "You are not authenticated !!"));
	}
};

export const verifyUser = (req, res, next) => {
	verifyToken(req, res, next, (err) => {
		if (err) return next(err);

		if (req.user.id === req.params.id || req.user.isAdmin) {
			next();
		} else {
			return next(createError(403, "You are not Authorized!"));
		}
	});
};

export const verifyAdmin = (req, res, next) => {
	verifyToken(
		req,
		res,
		(err) => {
			if (err) return next(err);
			if (req.user.role === "admin") {
				next();
			} else {
				return next(createError(403, "You are not Authorized!"));
			}
		},
		next
	);
};

export const refreshToken = async (request, response, next) => {
	const tokenReq = request.body.refreshToken;
	console.log(tokenReq);
	try {
		const token = await Token.findOne({ token: tokenReq });

		if (!token)
			return response.status(401).json({ msg: "Not a valid Refresh token" });

		const user = jwt.decode(token.token);

		const newToken = jwt.sign(
			JSON.parse(JSON.stringify(user)),
			JWT_ACCESS_TOKEN__SECRET,
			{ expiresIn: "1h" }
		);

		response
			.status(200)
			.cookie("access_token", newToken, {
				httpOnly: true,
			})
			.json({ accessToken: newToken });
	} catch (error) {
		response.status(401).json({ msg: error.message });
	}
};
