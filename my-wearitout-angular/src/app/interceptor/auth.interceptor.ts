import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get token from localStorage (only in browser)
    let token: string | null = null;
    if (this.isBrowser) {
      token = localStorage.getItem('authToken');
    }
    
    // Clone request and add authorization header if token exists
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    } else {
      // Add default headers for requests without token
      authReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    }

    // Handle the request and catch errors
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          console.error('🔑 Authentication failed:', error);
          // Remove token and redirect to login (only in browser)
          if (this.isBrowser) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            this.router.navigate(['/login']);
          }
        }
        
        // Handle 403 Forbidden errors
        if (error.status === 403) {
          console.error('Access forbidden:', error.message);
          // Optionally redirect to access denied page
        }

        // Handle 500 Server errors
        if (error.status >= 500) {
          console.error('Server error:', error.message);
          // Optionally show error message to user
        }

        // Re-throw the error for component handling
        return throwError(() => error);
      })
    );
  }
}