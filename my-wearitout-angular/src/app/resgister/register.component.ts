import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      phone: this.registerForm.value.phone
    };


    this.http.post<any>('http://localhost:8080/api/v1/user/register', registerData)
      .subscribe({
        next: (response) => {
          this.successMessage = 'Đăng ký thành công! Chuyển hướng đến trang đăng nhập...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
          
          this.isLoading = false;
        },
        error: (error) => {
          
          this.handleRegisterError(error);
          this.isLoading = false;
        }
      });
  }

  private handleRegisterError(error: any): void {
    if (error.status === 400) {
      this.errorMessage = 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.';
    } else if (error.status === 409) {
      this.errorMessage = 'Username hoặc email đã tồn tại.';
    } else if (error.status === 0) {
      this.errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
    } else {
      this.errorMessage = error.error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(field => {
      const control = this.registerForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Getter methods for form validation
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get phone() { return this.registerForm.get('phone'); }
}
