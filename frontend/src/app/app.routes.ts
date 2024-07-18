import { Routes } from '@angular/router';
import { WildCardComponent } from './pages/wild-card/wild-card.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { authGuard } from './guards/auth.guard';
import { roleBasedGuard } from './guards/role-based.guard';
import { isLoggedGuard } from './guards/is-logged.guard';
export const routes: Routes = [
  {
    path:'login',
    canActivate:[isLoggedGuard],
    loadComponent:()=>import('./pages/employee-login/employee-login.component').then(m=>m.EmployeeLoginComponent)
  },
  {
    path:'admin/login',
    canActivate:[isLoggedGuard],
    loadComponent:()=>import('./pages/login/login.component').then(m=>m.LoginComponent)
  },
  {
    path:'',
    canActivate: [authGuard,roleBasedGuard],
    data: { roles: ['admin','employee'] },
    loadComponent:()=>import('./pages/login/login.component').then(m=>m.LoginComponent)
  },
  {
   path:'admin',
   title:'Admin Dashboard',
   canActivate: [authGuard,roleBasedGuard],
   data: { roles: ['admin'] },
   component:AdminHomeComponent,
   children:[
    {
    path:'',
    loadComponent:()=>import('./pages/admin-landing-page/admin-landing-page.component').then(m=>m.AdminLandingPageComponent)
    },
    {
      path:'employees',
      loadComponent:()=>import('./pages/employees-listing/employees-listing.component').then(m=>m.EmployeesListingComponent)
    }
   ]
  },
  { path: '**', component:WildCardComponent }
];


