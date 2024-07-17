import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Designation, Employee, Location,EmployeeData } from '../models/employeeModels';
import { ApiResponse } from '../models/responseModel';

@Injectable({
  providedIn:'root'
  })
export class EmployeeService {
  private employeeBaseUrl = `${environment.backendUrl}/employee`;
  private adminBaseUrl = `${environment.backendUrl}/admin`;

  constructor(private http: HttpClient) { }

  getEmployees(
    page: number = 1,
    pageSize: number = 6,
    searchQuery: string = '',
    location: string = 'All',
    designation: string = 'All'
  ): Observable<ApiResponse<EmployeeData>> {
    let queryParams = `page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}`;
    if (location && location !== 'All') {
      queryParams += `&location=${location}`;
    }
    if (designation && designation !== 'All') {
      queryParams += `&designation=${designation}`;
    }
    return this.http.get<ApiResponse<EmployeeData>>(`${this.adminBaseUrl}/employees?${queryParams}`);
  }
  getEmployee(id: string): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.employeeBaseUrl}/employees/${id}`);
  }

  addEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(`${this.adminBaseUrl}/employees`, employee);
  }

  updateEmployee(id: string, employee: Employee): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.adminBaseUrl}/employees/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.adminBaseUrl}/employees/${id}`);
  }

  getLocationAndDesignationDetails(): Observable<ApiResponse<{locations:Location[], designations:Designation[]}>>{
    return this.http.get<ApiResponse<{locations:Location[], designations:Designation[]}>>(`${this.adminBaseUrl}/details`);
  }
}
