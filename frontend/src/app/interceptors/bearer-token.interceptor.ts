import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from "@angular/core";
import { from, Observable, throwError, BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment.development";
import { TokenService } from "../services/token.service";
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

const refreshToken = async (refreshToken: string): Promise<any> => {
  const authService = inject(AuthService);

  return new Promise((resolve, reject) => {
    authService.getRefreshToken(refreshToken).subscribe({
      next: (res) => {
        if (res.success) {
          resolve(res.data);
        } else {
          reject(res.error.message);
        }
      },
      error: (err) => {
        reject(err);
      }
    });
  });
};

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refresh_Token = tokenService.getRefreshToken();
    if (refresh_Token) {
      return from(refreshToken(refresh_Token as string)).pipe(
        switchMap((newToken: any) => {
          isRefreshing = false;
          tokenService.setTokens(newToken.accessToken, newToken.refreshToken);
          refreshTokenSubject.next(newToken.accessToken);
          return next(addTokenHeader(request, newToken.accessToken));
        }),
        catchError((err) => {
          isRefreshing = false;
          tokenService.clearTokens();
          return throwError(() => err);
        })
      );
    }
  }

  return refreshTokenSubject.pipe(
    filter(token => token != null),
    take(1),
    switchMap(jwt => {
      return next(addTokenHeader(request, jwt!));
    })
  );
};

const addTokenHeader = (request: HttpRequest<any>, token: string): HttpRequest<any> => {
  return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
};

export const bearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  if (req.url.startsWith(environment.backendUrl)) {
    const token = tokenService.getAccessToken();
    if (token) {
      req = addTokenHeader(req, token);
      return next(req).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return handle401Error(req, next);
          } else {
            return throwError(() => error);
          }
        })
      );
    }
  }
  return next(req);
};
