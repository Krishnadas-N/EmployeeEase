import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  Designation,
  Employee,
  Location,
  EmployeeData,
  EmployeeDetail,
} from '../models/employeeModels';
import { ApiResponse } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeBaseUrl = `${environment.backendUrl}/employee`;
  private adminBaseUrl = `${environment.backendUrl}/admin`;

  constructor(private http: HttpClient) {}

  getEmployees(
    page: number = 1,
    pageSize: number = 6,
    searchQuery: string = '',
    location: string,
    designation: string
  ): Observable<ApiResponse<EmployeeData>> {
    let queryParams = `page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}`;
    if (location && location !== 'All') {
      queryParams += `&location=${location}`;
    }
    if (designation && designation !== 'All') {
      queryParams += `&designation=${designation}`;
    }
    return this.http.get<ApiResponse<EmployeeData>>(
      `${this.adminBaseUrl}/employees?${queryParams}`
    );
  }
  getEmployee(): Observable<ApiResponse<EmployeeDetail>> {
    return this.http.get<ApiResponse<EmployeeDetail>>(
      `${this.employeeBaseUrl}/profile`
    );
  }

  addEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(
      `${this.adminBaseUrl}/employees`,
      employee
    );
  }

  updateEmployee(
    id: string,
    employee: Employee
  ): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(
      `${this.adminBaseUrl}/employees/${id}`,
      employee
    );
  }

  deleteEmployee(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.adminBaseUrl}/employees/${id}`
    );
  }

  getLocationAndDesignationDetails(): Observable<
    ApiResponse<{ locations: Location[]; designations: Designation[] }>
  > {
    return this.http.get<
      ApiResponse<{ locations: Location[]; designations: Designation[] }>
    >(`${this.adminBaseUrl}/details`);
  }
  getAdminDashboardDetails(): Observable<
    ApiResponse<{
      totalEmployeesCount: number;
      employeesAddedPast12HoursCount: number;
    }>
  > {
    return this.http.get<
      ApiResponse<{
        totalEmployeesCount: number;
        employeesAddedPast12HoursCount: number;
      }>
    >(`${this.adminBaseUrl}/dashboard`);
  }
}
