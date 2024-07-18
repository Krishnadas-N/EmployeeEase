import { NextFunction, Request, Response } from 'express';
import Employee from '../models/Employee';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandlers';
import mongoose from 'mongoose';

export const getEmployeeProfile = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const employeeId = req.user.userId; 
    const [employee] = await Employee.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(employeeId) } }, 
        {
          $lookup: {
            from: 'designations', 
            localField: 'designation',
            foreignField: '_id',
            as: 'designation'
          }
        },
        {
          $lookup: {
            from: 'locations', 
            localField: 'location',
            foreignField: '_id',
            as: 'location'
          }
        },
        { $unwind: '$designation' },
        { $unwind: '$location' },
        {
          $project: {
            password: 0
          }
        }
      ]);
    if (!employee) {
      return sendErrorResponse(res, 'Employee not found', 404);
    }
    sendSuccessResponse(res, employee,200);
  } catch (error) {
    next(error)
  }
};
