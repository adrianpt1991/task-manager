import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'tasks',
        canActivate: [authGuard],
        loadComponent: () =>
        import('./tasks/task-dashboard/task-dashboard.component').then(
            (c) => c.TaskDashboardComponent
        ),
    },
    {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: '/tasks',
    }
];
