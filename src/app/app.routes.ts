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
      import(
        './features/tasks/pages/task-list/task-list.page'
      ).then(module => module.TaskListPage),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import(
        './features/categories/pages/category-list/category-list.page'
      ).then(module => module.CategoryListPage),
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
