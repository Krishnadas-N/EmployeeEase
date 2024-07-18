import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee'; 
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandlers';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtTokenGenerator';
import Admin from '../models/Admin';
import { Payload } from '../dtos/jwtPayloadModel';

export const adminLogin = async (req: Request, res: Response,next:NextFunction) => {
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return sendErrorResponse(res, 'Admin not found', 404);
      }
  
      if (admin.password !== password) {
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
    const { loginCredential,password } = req.body;
    try {
      console.log( req.body);
       const empIdPattern = /^E\d{5}$/;
       const isEmpId = empIdPattern.test(loginCredential);
       const employee = isEmpId
       ? await Employee.findOne({ employeeId: loginCredential })
       : await Employee.findOne({ name: loginCredential });

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

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return sendErrorResponse(res, 'Refresh token is required', 400);
  }

  try {
    const decoded = verifyRefreshToken(refreshToken) as Payload;
    const { id, role } = decoded;
    const newAccessToken = generateAccessToken(id, role);
    const newRefreshToken = generateRefreshToken(id, role);

    sendSuccessResponse(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return sendErrorResponse(res, 'Invalid refresh token', 401);
  }
};