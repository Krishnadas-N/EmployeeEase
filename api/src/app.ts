import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from "dotenv";
import { connectDb } from "./config/dbConnection";
import { sendErrorResponse } from "./utils/responseHandlers";
import CustomError from "./utils/customError";
import adminRouter from "./routes/adminRoutes";
import authRouter from "./routes/authRoutes";
import employeeRouter from "./routes/employeeRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(helmet()); 
app.use(morgan("dev")); 
app.use(cors({ origin: process.env.FRONTEND_URL })); 
const limiter = rateLimit({ 
  windowMs: 60 * 1000, 
  max: 100, 
});
app.use(limiter); 
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

// Database connection
connectDb();

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/employee', employeeRouter);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof CustomError) {
    return sendErrorResponse(res, err.message, err.statusCode);
  } else {
    return sendErrorResponse(res, "Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
