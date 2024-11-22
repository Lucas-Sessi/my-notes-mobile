import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/utils/toast/toast.component';
import { AuthService } from '../../shared/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly toastService: ToastService,    
    ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('/login')) {
      return next.handle(req);
    }

    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        if (token) {
          // Clona a requisição e adiciona o token no header
          const clonedRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(clonedRequest);
        }

        // Continua a requisição sem modificar se não houver token
        return next.handle(req);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          
          this.authService.clearCredentials().then(() => {
            this.toastService.error('Sua sessão expirou. Faça login novamente.');
            
            this.router.navigate(['/login']);
          });
        }
        return throwError(error);
      })
    );
  }
}
