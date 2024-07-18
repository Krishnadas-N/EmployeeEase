import express from "express";
import { adminLogin, employeeLogin ,refreshToken} from "../controllers/authController";
import { validateLogin } from "../middlewares/bodyValidators";

const authRouter = express.Router();

authRouter.post("/admin/login", validateLogin, adminLogin);
authRouter.post("/employee/login", employeeLogin);
authRouter.post('/refresh-token', refreshToken);

export default authRouter;
