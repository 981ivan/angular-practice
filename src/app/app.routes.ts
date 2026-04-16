import { Routes } from '@angular/router';
import { HomePage } from './components/home-page';
import { ManageBookPage } from './components/manage-book-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'add-new-book',
    component: ManageBookPage,
  },
  {
    path: `edit-book`,
    component: ManageBookPage,
  },
];
