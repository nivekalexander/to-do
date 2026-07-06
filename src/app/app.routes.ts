import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tasks',
  },
  {
  path: 'tasks',
  loadComponent: () =>
    import('./features/tasks/pages/task-list/task-list.page')
      .then(({ TaskListPage }) => TaskListPage),
},
  {
    path: '**',
    redirectTo: 'tasks',
  },
];

