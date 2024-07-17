import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import * as jwtDecode from 'jwt-decode';
import { ApiResponse } from '../models/responseModel';
import { AuthResponseData } from '../models/authModels';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthService  {
  private apiUrl = `${environment.backendUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router:Router
  ) {}

  public isAuthenticated(): boolean {
    const token = this.tokenService.getAccessToken();
    try {
      const decodedToken = jwtDecode.jwtDecode(token as string);
      const now = Date.now().valueOf() / 1000;
      return  decodedToken &&  decodedToken.exp? decodedToken.exp > now : false;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  employeeLogin(email: string, password: string): Observable<ApiResponse<AuthResponseData>> {
    return this.http.post<ApiResponse<AuthResponseData>>(`${this.apiUrl}/employee/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success) {
            this.tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
          }
        })
      );
  }

  adminLogin(email: string, password: string): Observable<ApiResponse<AuthResponseData>> {
    return this.http.post<ApiResponse<AuthResponseData>>(`${this.apiUrl}/admin/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success) {
            this.tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
          }
        })
      );
  }

  getRefreshToken(refreshToken: string): Observable<ApiResponse<AuthResponseData>> {
    return this.http.post<ApiResponse<AuthResponseData>>(`${this.apiUrl}/refresh-token`, { refreshToken });
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.router.navigate(['/login']);
  }
}
