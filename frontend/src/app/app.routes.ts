import { Routes } from '@angular/router';
import { Main } from './components/main/main';
import { CustomerComponent } from './pages/customer/customer';
import { Dashboard } from './pages/dashboard/dashboard';
import { ContactComponent } from './pages/contact/contact';
import { UserComponent } from './pages/user/user';
import { ActivitiesComponent } from './pages/activities/activities';
import { LeadsComponent } from './pages/leads/leads';
import { DealsComponent } from './pages/deals/deals';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: Main,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'customers',
        component: CustomerComponent,
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'activities',
        component: ActivitiesComponent,
      },
      {
        path: 'leads',
        component: LeadsComponent,
      },
      {
        path: 'deals',
        component: DealsComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
