import mongoose from "mongoose";
import { MONGO_URI } from "../config/config.js";

mongoose.set("strictQuery", true);
const connect = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Connected to MongoDB!!");
	} catch (error) {
		throw error;
	}
};

mongoose.connection.on("disconnected", () => {
	console.log("Database Disconnected");
});

export default connect;
