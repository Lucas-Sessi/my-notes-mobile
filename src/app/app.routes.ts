import { Routes } from '@angular/router';
import { AuthGuard } from './common/guards/auth.guard';
import { TabsPage } from './common/layout/tabs/tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    // canActivate: [AuthGuard],
    component: TabsPage,
    children: [
      {
        path: 'investimentos',
        children: [
          {
            path: '',
            loadComponent: () =>import('./features/investimentos/home/home.page').then((m) => m.HomePage),
          },
          {
            path: 'ativos/:id',
            loadComponent: () => import('./features/investimentos/ativos/ativos.component').then((m) => m.AtivosComponent),
          },
          {
            path: 'calcular-aporte',
            loadComponent: () =>
              import('./features/investimentos/calcular-aporte/calcular-aporte.component').then((m) => m.CalcularAporteComponent),
          },
        ]
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
        redirectTo: '/tabs/investimentos',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/investimentos',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginPage),
  }
];
