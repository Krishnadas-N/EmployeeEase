import { NextFunction, Request, Response } from 'express';
import Designation from '../models/Designation';
import Location from '../models/Location';
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandlers';

export const getEmployees = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const employees = await Employee.aggregate([
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

    sendSuccessResponse(res, employees,200);
  } catch (error) {
      next(error)
  }
};

export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
  const { name, age, designationName, phone, employeeId, email, address, password, locationName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let designationId;
    let designation = await Designation.findOne({ name: designationName });
    if (designation) {
      designationId = designation._id;
    } else {
      designation = new Designation({ name: designationName });
      await designation.save();
      designationId = designation._id;
    }

    let locationId;
    let location = await Location.findOne({ name: locationName });
    if (location) {
      locationId = location._id;
    } else {
      location = new Location({ name: locationName });
      await location.save();
      locationId = location._id;
    }

    const existingEmployee = await Employee.findOne({ $or: [{ employeeId }, { email }] });
    if (existingEmployee) {
      return sendErrorResponse(res,'Employee with the same Employee ID or Email already exists',400);
    }

    const newEmployee = new Employee({
      name,
      age,
      designation: designationId,
      phone,
      employeeId,
      email,
      address,
      password: hashedPassword,
      location: locationId,
    });

    // Save the new employee
    const savedEmployee = await newEmployee.save();
    sendSuccessResponse(res, { employee: savedEmployee },201);
  } catch (error) {
    next(error);
  }
};

// Update an employee
export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error('Method is not Implemented')
  } catch (err) {
    next(err)
  }
};

// Delete an employee
export const deleteEmployee = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return sendErrorResponse(res, 'Employee not found', 404);
    }
    sendSuccessResponse(res, { message: 'Employee deleted'},200);
  } catch (error) {
    next(error)
  }
};


export const getDesignations = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const designations = await Designation.find();
    sendSuccessResponse(res, {designations},200);
  } catch (error) {
    next(error)
  }
};

// Get locations
export const getLocations = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const locations = await Location.find();
    sendSuccessResponse(res, {locations},200);
  } catch (error) {
    next(error)
  }
};
