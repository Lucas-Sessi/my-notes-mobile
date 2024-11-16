import { Routes } from '@angular/router';
import { AuthGuard } from './common/guards/auth.guard';
import { TabsPage } from './common/layout/tabs/tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('./features/investimentos/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('./features/tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('./features/tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginPage),
  }
];
