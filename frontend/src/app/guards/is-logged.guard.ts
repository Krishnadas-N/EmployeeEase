import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/jwtPayloadModel';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();
  if (!token) {
    return true;
  }
  const router = inject(Router);
  const decodedToken = jwtDecode(token as string) as JwtPayload;
  const now = Date.now().valueOf() / 1000;
  if (decodedToken.exp && decodedToken.exp <= now) {
    return true;
  }
  return decodedToken.role === 'admin'
    ? router.navigate(['/admin'])
    : router.navigate(['/admin']);
};
