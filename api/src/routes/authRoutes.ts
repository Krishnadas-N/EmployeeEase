import express from "express";
import { adminLogin, employeeLogin } from "../controllers/authController";
import { validateLogin } from "../middlewares/bodyValidators";

const authRouter = express.Router();

authRouter.post("/admin/login", validateLogin, adminLogin);
authRouter.post("/employee/login", validateLogin, employeeLogin);

export default authRouter;
