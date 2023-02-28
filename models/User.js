import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		confirmed: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			default: "user",
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("User", UserSchema);
