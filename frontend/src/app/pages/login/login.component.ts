import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PASSWORD_PATTERN } from '../../constants/password-pattern';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit  {
  loginForm!: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
      isAdmin: [false]
    });
  }
  get f() { return this.loginForm.controls; }
  hasError(controlName: string, errorName: string): boolean {
    return this.submitted && this.f[controlName].hasError(errorName);
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      // Handle login logic here, e.g., send login request
      console.log(this.loginForm.value);
    } else {
      // Mark form controls as touched to display validation errors
      this.loginForm.markAllAsTouched();
    }
  }
}
