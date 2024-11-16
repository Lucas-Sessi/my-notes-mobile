import { Routes } from '@angular/router';
import { AuthGuard } from './common/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./common/layout/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('../app/pages/login/login.component').then((m) => m.LoginPage),
  }
];
