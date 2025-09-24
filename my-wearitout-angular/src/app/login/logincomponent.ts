import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

 onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    console.log('🚀 Calling login API:', loginData);

    // Call API trực tiếp
    this.http.post<any>('http://localhost:8080/api/v1/auth/login', loginData)
      .subscribe({
        next: (response) => {
          console.log('✅ Login successful:', response);
          
          if (response.code === 200 && response.token) {
            // Save token to localStorage (only in browser)
            if (this.isBrowser) {
              localStorage.setItem('authToken', response.token);
              localStorage.setItem('userRole', response.role);
              localStorage.setItem('username', loginData.username);
              
              if (this.loginForm.value.rememberMe) {
                localStorage.setItem('rememberUser', 'true');
              }
            }
            
            // Navigate to home
            this.router.navigate(['/']);
          } else {
            this.errorMessage = response.message || 'Đăng nhập thất bại';
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Login error:', error);
          this.handleLoginError(error);
          this.isLoading = false;
        }
      });
  }

  private handleLoginError(error: any): void {
    if (error.status === 401) {
      this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
    } else if (error.status === 403) {
      this.errorMessage = 'Tài khoản của bạn đã bị khóa';
    } else if (error.status === 404) {
      this.errorMessage = 'Tài khoản không tồn tại';
    } else if (error.status === 0) {
      this.errorMessage = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
    } else {
      this.errorMessage = error.error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  // Getter methods for form validation
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  // Demo login (for testing)
  loginAsDemo(): void {
    this.loginForm.patchValue({
      username: 'hai123',
      password: 'hai123'
    });
  }
}
