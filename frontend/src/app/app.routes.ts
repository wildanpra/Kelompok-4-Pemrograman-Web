import { Routes } from '@angular/router';
import { Main } from './components/main/main';
import { CustomerComponent } from './pages/customer/customer';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Main,
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
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
