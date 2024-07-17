import { Routes } from '@angular/router';
import { WildCardComponent } from './pages/wild-card/wild-card.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';


export const routes: Routes = [
  {
    path:'login',
    loadComponent:()=>import('./pages/login/login.component').then(m=>m.LoginComponent)
  },
  {
   path:'admin',
   title:'Admin Dashboard',
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


