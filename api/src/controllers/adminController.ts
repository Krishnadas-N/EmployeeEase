import { NextFunction, Request, Response } from 'express';
import Designation from '../models/Designation';
import Location from '../models/Location';
import bcrypt from 'bcryptjs';
import Employee, { IEmployee } from '../models/Employee';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandlers';
import mongoose, { Schema, Types } from 'mongoose';

export const getEmployees = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { page = 1, pageSize = 6, searchQuery = '', location , designation  } = req.query;
    const pageNum = parseInt(page as string, 10);
    const sizeNum = parseInt(pageSize as string, 10);
    const matchStage: any = {};
    console.log(page,pageSize,searchQuery,location,designation)
    if (location) {
      matchStage.location = new mongoose.Types.ObjectId(location as string);
    }
    
    if (designation) {
      matchStage.designation =new mongoose.Types.ObjectId(designation as string);
    }

    if (searchQuery) {
      matchStage.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    console.log(matchStage);

    const employees = await Employee.aggregate([
      { $match: matchStage },
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
      { $project: { password: 0 } },
      { $skip: (pageNum - 1) * sizeNum },
      { $limit: sizeNum }
    ]);

    const totalCount = await Employee.countDocuments(matchStage);

    const response = {
        employees,
        currentPage: pageNum,
        pageSize: sizeNum,
        totalCount,
        totalPages: Math.ceil(totalCount / sizeNum)
      
    };
    console.log(response)
    sendSuccessResponse(res, response, 200);
  } catch (error) {
      next(error)
  }
};

export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
  const { name, age, designation, phone, employeeId, email, address, password, location } = req.body;
  console.log(req.body)
  try {
    const employee = await Employee.findOne({name,employeeId});

    if (employee) {
      return sendErrorResponse(res, 'Employee already Exists', 404);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let designationId;
    let designationExists = await Designation.findOne({ title: designation });
    if (designationExists) {
      designationId = designationExists._id;
    } else {
      designationExists = new Designation({ title: designation });
      await designationExists.save();
      designationId = designationExists._id;
    }

    let locationId;
    let locationExists = await Location.findOne({ name: location });
    if (locationExists) {
      locationId = locationExists._id;
    } else {
      locationExists = new Location({ name: location });
      await locationExists.save();
      locationId = locationExists._id;
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

export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params; // Assuming you pass the employee id in the URL params
  const { name, age, designation, phone, email, address, password, location } = req.body;

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return sendErrorResponse(res, 'Employee not found', 404);
    }

    if (name) {
      employee.name = name;
    }
    if (age) {
      employee.age = age;
    }
    if (phone) {
      employee.phone = phone;
    }
    if (email) {
      employee.email = email;
    }
    if (address) {
      employee.address = address;
    }
    if (designation) {
      let designationId; // Define type explicitly
      let designationExists = await Designation.findOne({ title: designation });

      if (designationExists) {
        designationId = designationExists._id as Types.ObjectId;
      } else {
        designationExists = new Designation({ title: designation });
        await designationExists.save();
        designationId = designationExists._id ;
      }

      employee.designation = designationId as Schema.Types.ObjectId;
    }
    if (location) {
      let locationId; 
      let locationExists = await Location.findOne({ name: location });

      if (locationExists) {
        locationId = locationExists._id as Types.ObjectId;
      } else {
        locationExists = new Location({ name: location });
        await locationExists.save();
        locationId = locationExists._id;
      }

      employee.location = locationId as Schema.Types.ObjectId;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      employee.password = hashedPassword;
    }

    // Save the updated employee
    const updatedEmployee = await employee.save();

    sendSuccessResponse(res, { employee: updatedEmployee });
  } catch (error) {
    next(error);
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


export const getLocationAndDesignationDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locations = await Location.find().exec();
    const designations = await Designation.find().exec();

    sendSuccessResponse(res, { locations, designations });
  } catch (error) {
    next(error);
  }
};

export const getDashBoardDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

    const pipeline = [
      {
        $facet: {
          totalEmployees: [
            { $count: 'count' }
          ],
          employeesAddedPast12Hours: [
            {
              $match: {
                createdAt: { $gte: twelveHoursAgo }
              }
            },
            { $count: 'count' }
          ],
        }
      }
    ];

    const [results] = await Employee.aggregate(pipeline);

    const details = {
      totalEmployeesCount: results.totalEmployees.length > 0 ? results.totalEmployees[0].count : 0,
      employeesAddedPast12HoursCount: results.employeesAddedPast12Hours.length > 0 ? results.employeesAddedPast12Hours[0].count : 0,
    };
    console.log(details)

    sendSuccessResponse(res, details);
  } catch (error) {
    next(error);
  }
};