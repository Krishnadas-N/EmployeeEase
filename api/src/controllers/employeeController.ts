import { NextFunction, Request, Response } from 'express';
import Employee from '../models/Employee';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandlers';

export const getEmployeeProfile = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const employeeId = req.user.id; 
    const [employee] = await Employee.aggregate([
        { $match: { _id: employeeId } }, 
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
