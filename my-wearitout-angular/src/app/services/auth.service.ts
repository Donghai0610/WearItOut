import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService, ApiResponse } from './api.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Check if user is already logged in on service initialization
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (!this.isBrowser) return;
    
    const token = this.apiService.getToken();
    let userInfo = localStorage.getItem('userInfo');
    
    // If no userInfo but have token, try to construct from available data
    if (token && !userInfo) {
      const username = localStorage.getItem('username');
      const userRole = localStorage.getItem('userRole');
      
      if (username) {
        const tempUser = {
          id: 1, 
          username: username,
          email: '', 
          role: userRole || 'USER'
        };
        userInfo = JSON.stringify(tempUser);
        localStorage.setItem('userInfo', userInfo);
        console.log('🔧 Created userInfo from available data:', tempUser);
      }
    }
    
    if (token && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        console.log('✅ Auth status checked - User:', user);
      } catch (error) {
        console.error('Error parsing user info:', error);
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.login(credentials).pipe(
      tap((response: ApiResponse<AuthResponse>) => {
        if (response.code === 200 && response.result) {
          this.handleAuthSuccess(response.result);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.register(userData).pipe(
      tap((response: ApiResponse<AuthResponse>) => {
        if (response.code === 200 && response.result) {
          this.handleAuthSuccess(response.result);
        }
      })
    );
  }

  logout(): void {
    this.apiService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
      complete: () => {
        this.handleLogout();
      }
    });
  }

  forceLogout(): void {
    this.handleLogout();
  }

  private handleAuthSuccess(authResponse: AuthResponse): void {
    if (!this.isBrowser) return;
    
    this.apiService.setToken(authResponse.token);
    
    if (authResponse.refreshToken) {
      localStorage.setItem('refreshToken', authResponse.refreshToken);
    }
    
    localStorage.setItem('userInfo', JSON.stringify(authResponse.user));
    
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  private handleLogout(): void {
    this.apiService.removeToken();
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.refreshToken().pipe(
      tap((response: ApiResponse<AuthResponse>) => {
        if (response.code === 200 && response.result && this.isBrowser) {
          this.apiService.setToken(response.result.token);
          if (response.result.refreshToken) {
            localStorage.setItem('refreshToken', response.result.refreshToken);
          }
        }
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    if (user && user.id) {
      return user.id;
    }
    
    if (this.isBrowser) {
      const username = localStorage.getItem('username');
      if (username) {
        console.warn('⚠️ Using username as userId - this might need API call to resolve');
        return null; 
      }
    }
    
    return null;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  getProfile(): Observable<ApiResponse<User>> {
    return this.apiService.getProfile().pipe(
      tap((response: ApiResponse<User>) => {
        if (response.code === 200 && response.result) {
          this.currentUserSubject.next(response.result);
          if (this.isBrowser) {
            localStorage.setItem('userInfo', JSON.stringify(response.result));
          }
        }
      })
    );
  }

  updateProfile(profileData: Partial<User>): Observable<ApiResponse<User>> {
    return this.apiService.updateProfile(profileData).pipe(
      tap((response: ApiResponse<User>) => {
        if (response.code === 200 && response.result) {
          this.currentUserSubject.next(response.result);
          if (this.isBrowser) {
            localStorage.setItem('userInfo', JSON.stringify(response.result));
          }
        }
      })
    );
  }
}