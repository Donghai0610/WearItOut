import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer],
  template: `
    <app-header></app-header>
    
    <div class="profile-container">
      <div class="container">
        <h2>Thông tin cá nhân</h2>
        
        <div *ngIf="isAuthenticated" class="profile-card">
          <div class="profile-section">
            <h3>Thông tin tài khoản</h3>
            <div class="info-item">
              <label>Tên đăng nhập:</label>
              <span>{{ username }}</span>
            </div>
            <div class="info-item">
              <label>Vai trò:</label>
              <span class="role-badge">{{ userRole }}</span>
            </div>
          </div>
          
          <div class="profile-actions">
            <button class="btn-primary">Chỉnh sửa thông tin</button>
            <button class="btn-secondary">Đổi mật khẩu</button>
          </div>
        </div>
        
        <div *ngIf="!isAuthenticated" class="no-user">
          <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>
          <a routerLink="/login" class="btn-primary">Đăng nhập</a>
        </div>
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .profile-container {
      min-height: 60vh;
      padding: 40px 0;
      background: #f8f9fa;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    h2 {
      color: #333;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .profile-card {
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .profile-section {
      margin-bottom: 30px;
    }
    
    .profile-section h3 {
      color: #333;
      margin-bottom: 20px;
      font-size: 20px;
    }
    
    .info-item {
      display: flex;
      margin-bottom: 15px;
      align-items: center;
    }
    
    .info-item label {
      font-weight: 600;
      min-width: 150px;
      color: #555;
    }
    
    .info-item span {
      color: #333;
    }
    
    .role-badge {
      background: #007bff;
      color: white;
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .profile-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-primary {
      background: #007bff;
      color: white;
    }
    
    .btn-primary:hover {
      background: #0056b3;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background: #545b62;
    }
    
    .no-user {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .no-user p {
      margin-bottom: 20px;
      color: #666;
    }
  `]
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  userRole: string | null = null;
  isAuthenticated = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem('authToken');
      this.username = localStorage.getItem('username');
      this.userRole = localStorage.getItem('userRole');
      this.isAuthenticated = !!token;
    }
  }
}