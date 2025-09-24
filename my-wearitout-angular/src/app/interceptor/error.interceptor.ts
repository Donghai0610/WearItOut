import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
          console.error('Client-side error:', error.error.message);
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = 'Bad Request - Dữ liệu không hợp lệ';
              break;
            case 401:
              errorMessage = 'Unauthorized - Vui lòng đăng nhập lại';
              break;
            case 403:
              errorMessage = 'Forbidden - Bạn không có quyền truy cập';
              break;
            case 404:
              errorMessage = 'Not Found - Không tìm thấy tài nguyên';
              break;
            case 408:
              errorMessage = 'Request Timeout - Yêu cầu quá thời gian';
              break;
            case 500:
              errorMessage = 'Internal Server Error - Lỗi máy chủ nội bộ';
              break;
            case 502:
              errorMessage = 'Bad Gateway - Lỗi cổng kết nối';
              break;
            case 503:
              errorMessage = 'Service Unavailable - Dịch vụ tạm thời không khả dụng';
              break;
            case 504:
              errorMessage = 'Gateway Timeout - Hết thời gian chờ cổng kết nối';
              break;
            default:
              errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          
          console.error('Server-side error:', {
            status: error.status,
            message: error.message,
            url: error.url,
            error: error.error
          });
        }

        // Log error for debugging
        console.error('HTTP Error:', errorMessage);

        // Return the error message for handling in components
        return throwError(() => ({
          ...error,
          userMessage: errorMessage
        }));
      })
    );
  }
}
