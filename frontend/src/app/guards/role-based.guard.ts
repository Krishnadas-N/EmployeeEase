import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/jwtPayloadModel';

export const roleBasedGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();
  const router = inject(Router)
  const expectedRoles = route.data['roles'] as string[];
  const decodedToken = jwtDecode(token as string) as JwtPayload;
  if (expectedRoles && expectedRoles.length > 0 && expectedRoles.includes(decodedToken.role)) {
    return true; 
  }
   return decodedToken.role === 'admin'? router.parseUrl('/admin') : router.parseUrl('/')
 
};
