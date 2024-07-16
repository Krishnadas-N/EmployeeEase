import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDb = () => {
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/myapp";
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));
};
