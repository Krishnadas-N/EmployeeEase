import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee'; 
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandlers';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtTokenGenerator';
import Admin from '../models/Admin';

export const adminLogin = async (req: Request, res: Response,next:NextFunction) => {
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return sendErrorResponse(res, 'Admin not found', 404);
      }
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return sendErrorResponse(res, 'Invalid credentials', 401);
      }
  
      const accessToken = generateAccessToken(admin._id as string, 'admin');
      const refreshToken = generateRefreshToken(admin._id as string, 'admin');
      sendSuccessResponse(res, { accessToken, refreshToken });
    } catch (error) {
        next(error)
    }
  };

// Employee login
export const employeeLogin = async (req: Request, res: Response,next:NextFunction) => {
    const { email, password } = req.body;
    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return sendErrorResponse(res, 'Employee not found', 404);
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return sendErrorResponse(res, 'Invalid credentials', 401);
        }

        const accessToken = generateAccessToken(employee._id as string, 'employee');
        const refreshToken = generateRefreshToken(employee._id as string, 'employee');
        sendSuccessResponse(res, { accessToken, refreshToken });
    } catch (error) {
       next(error)
    }
};

