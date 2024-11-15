import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private sessionService: SessionService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    if (req.url.includes('/login')) {
        return next.handle(req);
      }
      
    // Obtém o token do serviço de sessão
    const token = this.sessionService.getToken();

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
  }
}
