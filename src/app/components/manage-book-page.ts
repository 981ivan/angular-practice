import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from './navbar';
import { ManageBookForm } from './manage-book-form';
import { HttpClient, httpResource } from '@angular/common/http';
import { BookInterface } from '../models/book.interface';
import { BOOKS_URL, DB_URL } from '../constants/constants';
import { Book } from '../models/book';

@Component({
  selector: 'app-manage-book-page',
  imports: [Navbar, ManageBookForm],
  standalone: true,
  template: `
    <app-navbar [context]="'addEditBook'" />
    @if (adding() || bookToEditSave().author) {
      <app-manage-book-form
        [book]="bookToEditSave()"
        [editing]="!adding()"
        (saveEdit)="saveEdit($event)"
      />
    }
  `,
  styles: ``,
})
export default class ManageBookPage implements OnInit {
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  router = inject(Router);
  adding = signal<boolean>(false);
  bookId = signal<number | null>(null);
  bookToAdd = signal<BookInterface>({
    id: 0,
    author: '',
    country: '',
    language: '',
    webLink: '',
    pages: 0,
    title: '',
    year: 0,
    index: 0,
  });
  bookToEdit = httpResource<BookInterface>(() => {
    const id = this.bookId();

    if (id == null) return undefined;

    return `${DB_URL}${BOOKS_URL}/${id}`;
  });
  bookToEditSave = computed(() => this.bookToEdit.value() ?? this.bookToAdd());

  ngOnInit() {
    console.log(this.route);
    this.route.queryParams.subscribe((params) => {
      if (params['addNewBook']) {
        this.adding.set(true);
      } else {
        this.bookId.set(params['bookId']);
      }
    });
  }

  saveEdit(ev: { method: string; book: Book }) {
    switch (ev.method) {
      case 'POST':
        this.http.post(`${DB_URL}${BOOKS_URL}`, ev.book).subscribe((res) => {
          const bookSaved = res as BookInterface;
          this.router.navigate([''], {
            state: {
              saved: true,
              bookSaved: bookSaved,
            },
          });
        });
        break;
      case 'PATCH':
        this.http.patch(`${DB_URL}${BOOKS_URL}/${ev.book.id}`, ev.book).subscribe((res) => {
          const bookEdited = res as BookInterface;
          this.router.navigate([''], {
            state: {
              edited: true,
              bookEdited: bookEdited,
            },
          });
        });
        break;
      default:
        break;
    }
  }
}
