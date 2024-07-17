export interface Employee{
  _id?:string;
  name: string;
  age: number;
  designation: string;
  phone: string;
  employeeId: string;
  email: string;
  address: string;
  location: string;
}

export interface EmployeeDetail{
  _id?:string;
  name: string;
  age: number;
  designation: Designation;
  phone: string;
  employeeId: string;
  email: string;
  address: string;
  location: Location;
}

export interface EmployeeData{
  employees:EmployeeDetail[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface Designation {
  _id: string;
  title: string
}

export interface Location {
  _id: string;
  name: string
}