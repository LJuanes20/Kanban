import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'boards',
    canActivate: [authGuard],
    loadComponent: () => import('./features/boards/boards-page.component').then(m => m.BoardsPageComponent)
  },
  {
    path: '',
    redirectTo: '/boards',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/boards'
  }
];