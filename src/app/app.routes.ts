import { Routes } from '@angular/router';
import { requirePasswordChangeGuard } from './guards/password-reset.guard';

import { authGuard } from './service/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent),
  },

  {
    path: 'change-password',
    // Muss mit normalem AuthGuard geschützt sein (man muss eingeloggt sein),
    // aber NICHT mit dem requirePasswordChangeGuard (sonst Endlosschleife)
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/user/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent
      ),
  },
  {
    path: 'dashboard',
    // Hier kommt die Zwangsumleitung rein:
    canActivate: [authGuard, requirePasswordChangeGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },

  // protected routes
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./components/user-management/user-management.component').then(
        (m) => m.UserManagementComponent
      ),
    canActivate: [authGuard],
  },
  // Fallback)
  { path: '**', redirectTo: '/login' },
];
