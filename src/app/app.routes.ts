import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
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
