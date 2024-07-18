import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-admin-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './admin-landing-page.component.html',
  styleUrl: './admin-landing-page.component.css'
})
export class AdminLandingPageComponent implements OnInit{
  employeesCount:number=0;
  newlyAddedEmployeesCount:number =0;
  constructor(private employeeService:EmployeeService){}
  ngOnInit(): void {
    this.employeeService.getAdminDashboardDetails().subscribe({
      next:(res)=>{
        if(res.success){
          this.employeesCount=res.data.totalEmployeesCount;
          this.newlyAddedEmployeesCount = res.data.employeesAddedPast12HoursCount
        }
      }
    })
  }
}
