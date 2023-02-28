import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI = process.env.MONGO;
export const PORT = process.env.PORT;
export const JWT_ACCESS_TOKEN__SECRET = process.env.JWT_ACCESS_TOKEN__SECRET;
export const JWT_REFRESH_TOKEN__SECRET = process.env.JWT_REFRESH_TOKEN__SECRET;
export const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
