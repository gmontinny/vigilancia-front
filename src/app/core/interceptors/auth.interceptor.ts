import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { switchMap, catchError, throwError, from } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return from(authService.getToken()).pipe(
    switchMap(token => {
      if (token && !req.url.includes('/auth/login')) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next(req);
    })
  );
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        return from(authService.shouldRefreshToken()).pipe(
          switchMap(shouldRefresh => {
            if (shouldRefresh) {
              return authService.refresh().pipe(
                switchMap(() => from(authService.getToken())),
                switchMap(token => {
                  const clonedReq = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  return next(clonedReq);
                }),
                catchError(() => {
                  authService.logout();
                  return throwError(() => error);
                })
              );
            }
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
