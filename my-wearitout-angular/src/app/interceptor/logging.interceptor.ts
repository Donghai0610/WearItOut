import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    let status: string;

    // Log the outgoing request
    console.group(`🔄 HTTP Request: ${req.method} ${req.url}`);
    console.log('📤 Request Details:', {
      method: req.method,
      url: req.url,
      headers: this.getHeaders(req),
      body: req.body
    });

    return next.handle(req).pipe(
      tap(
        // Log successful responses
        (event) => {
          if (event instanceof HttpResponse) {
            status = 'succeeded';
            console.log('✅ Response Success:', {
              status: event.status,
              statusText: event.statusText,
              body: event.body
            });
          }
        },
        // Log error responses
        (error) => {
          status = 'failed';
          console.error('❌ Response Error:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error
          });
        }
      ),
      finalize(() => {
        const elapsedTime = Date.now() - startTime;
        console.log(`⏱️ Request ${status} in ${elapsedTime}ms`);
        console.groupEnd();
      })
    );
  }

  private getHeaders(req: HttpRequest<any>): any {
    const headers: any = {};
    req.headers.keys().forEach(key => {
      headers[key] = req.headers.get(key);
    });
    return headers;
  }
}
