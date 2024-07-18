import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(AuthService);
  const router = inject(Router)
  if(isAuthenticated.isAuthenticated()){
   return true
  }
  return router.parseUrl('/login');
};
