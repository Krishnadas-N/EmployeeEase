import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET as string;

export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET as string;
