import { Injectable } from '@angular/core';
import { 
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token del localStorage
    const token = this.authService.getToken();

    if (token) {
      // Clonar la request y añadir el header de autorización
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

      // Enviar la request modificada
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          const isAuthenticationRequest = request.url.includes('/auth/');
          if (error.status === 401 && !isAuthenticationRequest) {
            return this.authService.refreshAccessToken().pipe(
              switchMap(() => {
                const refreshedToken = this.authService.getToken();
                const retryRequest = refreshedToken
                  ? request.clone({
                      headers: request.headers.set('Authorization', `Bearer ${refreshedToken}`)
                    })
                  : request;
                return next.handle(retryRequest);
              }),
              catchError((refreshError) => {
                this.authService.forceLogout();
                return throwError(() => refreshError);
              })
            );
          }
          return throwError(() => error);
        })
      );
    }

    // Si no hay token, enviar la request original
    return next.handle(request);
  }
}
