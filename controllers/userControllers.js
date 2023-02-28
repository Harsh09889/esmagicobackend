import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
	try {
		const user = {
			name: req.body.name ? req.body.name : undefined,
			username: req.body.username ? req.body.username : undefined,
			email: req.body.email ? req.body.email : undefined,
			role: req.body.role ? req.body.role : undefined,
		};

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{ $set: user },
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		next(err);
	}
};

export const getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

export const getLoggedInUser = async (req, res, next) => {
	const {
		user: { username, email },
	} = req;
	console.log(username, email);
	try {
		const user = await User.findOne({ username, email });
		const { password, ...userToSend } = user._doc;
		res.status(200).json(userToSend);
	} catch (err) {
		next(err);
	}
};

export const getUsers = async (req, res, next) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};

export const deleteUser = async (req, res, next) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json("User has been deleted");
	} catch (err) {
		next(err);
	}
};
