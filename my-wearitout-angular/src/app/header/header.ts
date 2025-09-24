import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  username: string | null = null;
  userRole: string | null = null;
  isAuthenticated = false;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.checkAuthState();
  }

  private checkAuthState(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem('authToken');
      this.username = localStorage.getItem('username');
      this.userRole = localStorage.getItem('userRole');
      this.isAuthenticated = !!token;
    }
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      localStorage.removeItem('rememberUser');
    }
    
    this.isAuthenticated = false;
    this.username = null;
    this.userRole = null;
    this.router.navigate(['/']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
