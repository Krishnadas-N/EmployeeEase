import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { LoaderService } from '../../services/loader.service';
import { Designation, Employee, EmployeeData, EmployeeDetail, Location } from '../../models/employeeModels';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-employees-listing',
  standalone: true,
  imports: [MatDialogModule,PaginationComponent,FormsModule,CommonModule,ConfirmationDialogComponent],
  templateUrl: './employees-listing.component.html',
  styleUrl: './employees-listing.component.css',
})
export class EmployeesListingComponent implements OnInit {
  employees: EmployeeDetail[] = [];
  paginatedItems: Employee[] = [];
  locations: Location[] = [];
  designations: Designation[] = [];
  
  selectedLocation!: string ;
  selectedDesignation!: string;
  searchQuery: string = '';
  
  totalPages: number = 0;
  totalCount: number = 0;
  itemsPerPage: number = 6;
  currentPage: number = 1;

  showConfirmationDialog: boolean = false;
  deleteMessage: string = 'Are you sure you want to delete this employee?';
  employeeToDelete: EmployeeDetail|null=null;
  constructor(
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private employeeService: EmployeeService,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.getLocationAndDesignationDatas()
    this.loadEmployees();
  }

  loadEmployees(){
    this.loaderService.show(); // Show loader
    this.employeeService.getEmployees(this.currentPage, this.itemsPerPage, this.searchQuery, this.selectedLocation, this.selectedDesignation)
      .subscribe({
        next: (res) => {
          this.loaderService.hide();
          if(res.success){
          this.employees = res.data.employees;
          this.totalCount = res.data.totalCount;
          this.totalPages = res.data.totalPages;
          this.loaderService.hide(); 
          }
        },
        error: (err) => {
          console.error('Error loading employees', err);
          this.loaderService.hide(); 
        }
      });
  }

  updateFilters(): void {
    this.currentPage = 1; 
    this.loadEmployees();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      data: null, 
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees(); 
      }
    });
  }

  openEditDialog(employee: EmployeeDetail): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      data: employee, 
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees(); // Reload employees after editing
      }
    });
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadEmployees();
  }


  deleteEmployee(employee: EmployeeDetail): void {
    this.employeeService.deleteEmployee(employee._id as string).subscribe({
      next: () => {
        this.toastr.success('Employee deleted successfully');
        this.loadEmployees(); // Reload employees after deletion
      },
      error: (error) => {
        this.toastr.error('Failed to delete employee');
      }
    });
  }
  confirmDelete(employee: any) {
    this.employeeToDelete = employee;
    this.showConfirmationDialog = true;
  }

  onConfirm(result: boolean) {
    if (result && this.employeeToDelete) {
      this.deleteEmployee(this.employeeToDelete);
    }
    this.showConfirmationDialog = false;
  }
  resetFilters() {
    this.searchQuery = '';
    this.selectedDesignation = '';
    this.selectedLocation = '';
    this.loadEmployees();
  }

  getLocationAndDesignationDatas(){
    this.employeeService.getLocationAndDesignationDetails().subscribe({
      next:(res)=>{
        console.log(res);
        if(res.success){
          this.designations =res.data.designations;
          this.locations = res.data.locations
        }
      }
    })
  }
}