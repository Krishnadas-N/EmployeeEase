import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PASSWORD_PATTERN } from '../../constants/password-pattern';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SnackBarService } from '../../services/snack-bar.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loaderService: LoaderService,
    private toastr:SnackBarService,
    private router:Router
  ) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
      const { email, password } = this.loginForm.value;
      this.loaderService.show();
        this.authService.adminLogin(email, password).subscribe({
          next: () => {
            this.router.navigate(['/admin']);
            this.loaderService.hide();
          },
          error: (error) => {
            this.toastr.showError(error);
            this.loaderService.hide();
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
