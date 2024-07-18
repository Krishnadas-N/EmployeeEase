import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PASSWORD_PATTERN } from '../../constants/password-pattern';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-employee-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './employee-login.component.html',
  styleUrl: './employee-login.component.css',
})
export class EmployeeLoginComponent {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loaderService: LoaderService,
    private router: Router,
    private toastr: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      loginCredential: ['', [Validators.required]],
      password: [
        '',
        [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
      ],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.submitted && this.f[controlName].hasError(errorName);
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { loginCredential, password } = this.loginForm.value;
      this.loaderService.show();
      this.authService.employeeLogin(loginCredential, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.loaderService.hide();
        },
        error: (error) => {
          this.toastr.showError(
            error || 'unable to login now please try again after sometimes'
          );
          this.loaderService.hide();
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
