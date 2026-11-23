import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return next(req.clone({ withCredentials: true })).pipe(
    catchError((error: HttpErrorResponse) => {
      const esRutaDeSesion = req.url.includes('/auth/login') || req.url.includes('/auth/me');
      if (error.status === 401 && !esRutaDeSesion && auth.usuario) {
        auth.terminarSesion();
      }
      return throwError(() => error);
    }),
  );
};
