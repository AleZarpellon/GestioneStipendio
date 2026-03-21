import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/resoconto',
    pathMatch: 'full',
  },
  {
    path: 'resoconto',
    loadComponent: () =>
      import('./view/resoconto/resoconto.component').then((m) => m.ResocontoComponent),
  },
  {
    path: 'spese',
    loadComponent: () => import('./view/spese/spese.component').then((m) => m.SpeseComponent),
  },
  {
    path: 'rate',
    loadComponent: () => import('./view/rate/rate.component').then((m) => m.RateComponent),
  },
  {
    path: 'salvadanaio',
    loadComponent: () =>
      import('./view/salvadanai/salvadanai.component').then((m) => m.SalvadanaiComponent),
  },
  {
    path: 'risparmio',
    loadComponent: () =>
      import('./view/risparmio/risparmio.component').then((m) => m.RisparmioComponent),
  },
];
