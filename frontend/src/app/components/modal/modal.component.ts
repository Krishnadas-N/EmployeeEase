import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PASSWORD_PATTERN } from '../../constants/password-pattern';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Designation, Location } from '../../models/employeeModels';
import { SnackBarService } from '../../services/snack-bar.service';
import { LoaderService } from '../../services/loader.service';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, FormsModule, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  providers: [EmployeeService],
})
export class ModalComponent implements OnInit {
  employeeForm: FormGroup;
  locations: Location[] = [];
  designations: Designation[] = [];
  newLocation: string = '';
  newDesignation: string = '';
  isEditMode: boolean = false;
  showNewLocationInput: boolean = false;
  showNewDesignationInput: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private employeeService: EmployeeService,
    private toastr: SnackBarService
  ) {
    this.getLocationAndDesignationDatas();
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, this.ageValidator]],
      designation: ['', Validators.required],
      employeeId: ['', [Validators.required, Validators.pattern(/^E\d{5}$/)]],
      newDesignation: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      password: [
        '',
        [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
      ],
      location: ['', Validators.required],
      newLocation: [''],
    });
    if (data) {
      this.isEditMode = true;
      this.employeeForm.patchValue(data);
      this.employeeForm.patchValue({
        designation: data.designation.title,
        location: data.location.name,
      });
      const passwordControl = this.employeeForm.get('password');
      passwordControl!.clearValidators(); // Remove all validators
      passwordControl!.setValidators([Validators.pattern(PASSWORD_PATTERN)]);
    }
  }
  ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (
      control.value !== undefined &&
      (isNaN(control.value) || control.value < 18)
    ) {
      return { invalidAge: true };
    }
    return null;
  }
  ngOnInit(): void {
    this.employeeForm.get('location')!.valueChanges.subscribe((value) => {
      if (value === 'addNewLocation') {
        this.showNewLocationInput = true;
        this.employeeForm
          .get('newLocation')!
          .setValidators([
            Validators.required,
            Validators.pattern(/^[A-Z][a-z]*( [A-Z][a-z]*)*$/),
          ]);
      } else {
        this.showNewLocationInput = false;
        this.employeeForm.get('newLocation')!.clearValidators();
      }
      this.employeeForm.get('newLocation')!.updateValueAndValidity();
    });

    this.employeeForm.get('designation')!.valueChanges.subscribe((value) => {
      if (value === 'addNewDesignation') {
        this.showNewDesignationInput = true;
        this.employeeForm
          .get('newDesignation')!
          .setValidators([
            Validators.required,
            Validators.pattern(/^[A-Z][a-z]*( [A-Z][a-z]*)*$/),
          ]);
      } else {
        this.showNewDesignationInput = false;
        this.employeeForm.get('newDesignation')!.clearValidators();
      }
      this.employeeForm.get('newDesignation')!.updateValueAndValidity();
    });
  }

  get f() {
    return this.employeeForm.controls;
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.loaderService.show();
      const formData = { ...this.employeeForm.value };
      if (formData.location === 'addNewLocation') {
        formData.location = formData.newLocation;
      }
      if (formData.designation === 'addNewDesignation') {
        formData.designation = formData.newDesignation;
      }
      console.log(formData);
      if (this.isEditMode) {
        this.employeeService.updateEmployee(this.data._id, formData).subscribe({
          next: (res) => {
            this.loaderService.hide();
            this.toastr.showSuccess('Successfully updated employee details');
            this.dialogRef.close(formData);
          },
          error: (err) => {
            this.loaderService.hide();
            this.toastr.showError(err || 'Failed to update employee');
          },
        });
      } else {
        this.employeeService.addEmployee(formData).subscribe({
          next: (res) => {
            this.loaderService.hide();
            this.toastr.showSuccess('Successfully added new employee');
            this.dialogRef.close(formData);
          },
          error: (err) => {
            this.loaderService.hide();
            this.toastr.showError(err || 'Failed to add employee');
          },
        });
      }
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
  getLocationAndDesignationDatas() {
    this.employeeService.getLocationAndDesignationDetails().subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.designations = res.data.designations;
          this.locations = res.data.locations;
        }
      },
    });
  }
}
