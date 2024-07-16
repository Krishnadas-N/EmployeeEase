import { Request, Response } from 'express';
import Designation from '../models/Designation';
import Location from '../models/Location';
import bcrypt from 'bcryptjs';

// Get all employees
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find()
      .populate('designation', 'name')
      .populate('location', 'name');
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, age, designation, phone, employeeId, email, address, password, location } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      age,
      designation,
      phone,
      employeeId,
      email,
      address,
      password: hashedPassword,
      location,
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, designation, phone, employeeId, email, address, password, location } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, age, designation, phone, employeeId, email, address, password, location },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get designations
export const getDesignations = async (req: Request, res: Response) => {
  try {
    const designations = await Designation.find();
    res.status(200).json(designations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get locations
export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
