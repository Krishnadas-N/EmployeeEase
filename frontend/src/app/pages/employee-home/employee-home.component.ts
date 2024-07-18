import { Component, OnInit } from '@angular/core';
import { EmployeeDetail } from '../../models/employeeModels';
import { EmployeeService } from '../../services/employee.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-employee-home',
  standalone: true,
  imports: [],
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.css'
})
export class EmployeeHomeComponent implements OnInit{
  employer!:EmployeeDetail;
  constructor(private employeeService:EmployeeService,
    private loaderService: LoaderService,
  ){}
  ngOnInit(): void {
    this.loaderService.show()
    this.employeeService.getEmployee().subscribe({
      next:(res)=>{
        this.loaderService.hide()
        if(res.success){
            this.employer = res.data
        }
      },
      error:()=>{
        this.loaderService.hide()
      }
    })
  }
}
