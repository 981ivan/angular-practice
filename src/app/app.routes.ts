import { Routes } from '@angular/router';
import { HomePage } from './components/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'add-new-book',
    loadComponent: () => import('./components/manage-book-page'),
  },
  {
    path: `edit-book`,
    loadComponent: () => import('./components/manage-book-page'),
  },
];
