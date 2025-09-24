import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  result: T;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private baseUrl = environment.apiUrl;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // GET request
  get<T>(endpoint: string, params?: any, includeAuth: boolean = true): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    const headers = this.getHeaders(includeAuth);
    
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, { 
      params: httpParams,
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, data: any, includeAuth: boolean = true): Observable<ApiResponse<T>> {
    const headers = this.getHeaders(includeAuth);
    
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, data: any, includeAuth: boolean = true): Observable<ApiResponse<T>> {
    const headers = this.getHeaders(includeAuth);
    
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string, includeAuth: boolean = true): Observable<ApiResponse<T>> {
    const headers = this.getHeaders(includeAuth);
    
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  patch<T>(endpoint: string, data: any, includeAuth: boolean = true): Observable<ApiResponse<T>> {
    const headers = this.getHeaders(includeAuth);
    
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadFile<T>(endpoint: string, file: File, additionalData?: any, includeAuth: boolean = true): Observable<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    let headers = new HttpHeaders();
    if (includeAuth && this.isBrowser) {
      const token = this.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, formData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Download file
  downloadFile(endpoint: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, { 
      responseType: 'blob' 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Authentication methods
  login(credentials: { username: string; password: string }): Observable<ApiResponse<any>> {
    return this.post('auth/login', credentials);
  }

  register(userData: any): Observable<ApiResponse<any>> {
    return this.post('auth/register', userData);
  }

  logout(): Observable<ApiResponse<any>> {
    return this.post('auth/logout', {});
  }

  refreshToken(): Observable<ApiResponse<any>> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.post('auth/refresh', { refreshToken });
  }

  // Profile methods
  getProfile(): Observable<ApiResponse<any>> {
    return this.get('user/profile');
  }

  updateProfile(profileData: any): Observable<ApiResponse<any>> {
    return this.put('user/profile', profileData);
  }

  // Product methods
  getProducts(params?: any): Observable<ApiResponse<any>> {
    return this.get('product/search', params);
  }

  getProductById(id: number): Observable<ApiResponse<any>> {
    return this.get(`products/${id}`);
  }

  // Cart methods
  addToCart(userId: number, productId: number, quantity: number): Observable<ApiResponse<any>> {
    console.log('🛒 API addToCart called:', {
      userId,
      productId,
      quantity,
      endpoint: `cart/${userId}/add`,
      fullUrl: `${this.baseUrl}/cart/${userId}/add`,
      token: this.getToken() ? 'present' : 'missing'
    });
    return this.post(`cart/${userId}/add`, { productId, quantity });
  }

  getCart(userId: number): Observable<ApiResponse<any>> {
    return this.get(`cart/${userId}`);
  }

  updateCartItem(userId: number, productId: number, quantity: number): Observable<ApiResponse<any>> {
    return this.post(`cart/${userId}/update`, { productId, quantity });
  }

  removeCartItem(userId: number, productId: number): Observable<ApiResponse<any>> {
    return this.post(`cart/${userId}/remove/${productId}`, {});
  }

  clearCart(userId: number): Observable<ApiResponse<any>> {
    return this.post(`cart/${userId}/clear`, {});
  }

  // Utility methods
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('authToken');
  }

  setToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem('authToken', token);
  }

  removeToken(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
  }

  // Private method to get headers with token
  private getHeaders(includeAuth: boolean = true): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (includeAuth && this.isBrowser) {
      const token = this.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
        console.log('🔑 Token added to headers:', token.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ No token found for authenticated request');
      }
    }

    return headers;
  }

  // Private error handler
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('API Service Error:', error);
    
    // If it's already a processed error from interceptor, just re-throw it
    if (error.error?.userMessage) {
      return throwError(() => error);
    }

    // Default error handling
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    }

    return throwError(() => ({
      ...error,
      userMessage: errorMessage
    }));
  };
}