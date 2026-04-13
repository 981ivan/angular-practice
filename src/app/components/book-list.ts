import { Component, computed, Signal, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Book } from '../models/book.interface';
import { BOOKS_URL, DB_URL } from '../constants/constants';
import { BookItem } from './book-item';
import { Paginator } from './paginator';
import { provideIcons } from '@ng-icons/core';
import { coolCaretUpMD } from '@ng-icons/coolicons';
import { TableHeader } from './table-header';

@Component({
  selector: 'app-book-list',
  imports: [BookItem, Paginator, TableHeader],
  viewProviders: [provideIcons({ coolCaretUpMD })],
  template: `
    <div class="overflow-x-auto m-5">
      <table class="table table-zebra">
        <thead>
          <tr>
            @for (h of tableHeaderConfig; track $index) {
              <th
                app-table-header
                [title]="h"
                [sortBy]="sortBy()"
                (sortingList)="orderBy($event)"
              ></th>
            }
          </tr>
        </thead>
        <tbody>
          @for (b of books.value(); track b.id) {
            <tr
              app-book-item
              [book]="b"
              [index]="$index"
              class="hover:bg-base-300"
            ></tr>
          } @empty {
            <span>There are no results :(</span>
          }
        </tbody>
      </table>
      <div class="m-5 flex justify-end">
        <app-paginator
          [numberOfPages]="numberOfPages()"
          [selectedPage]="selectedPage()"
          (changePage)="changePage($event)" />
      </div>
    </div>
  `,
  styles: ``,
})
export class BookList {
  baseApi: string = `${DB_URL}${BOOKS_URL}`;

  books = httpResource<Book[]>(() => this.completeApi());

  totalItems = computed(() => this.books.headers()?.get('x-total-count'));

  numberOfPages = computed(() => {
    const items = this.totalItems();
    const total = Number(items) || 0;
    return Math.ceil(total / 10);
  });

  page = signal<number>(1);
  elementsPerPage = signal<number>(10);
  sortBy = signal<string>('');
  selectedPage = signal<number>(1);
  completeApi: Signal<string> = computed(() => {
    let api = this.baseApi;
    if (this.page()) {
      api += `?_page=${this.page()}`;
    }
    if (this.elementsPerPage()) {
      api += `&_per_page=${this.elementsPerPage()}`;
    }
    if (this.sortBy()) {
      api += `&_sort=${this.sortBy()}`;
    }

    return api;
  });

  tableHeaderConfig: string[] = ['', 'title', 'author', 'year', 'language', ''];

  constructor() {}

  changePage(index: number) {
    this.page.set(index);
  }

  orderBy(key: string) {
    this.sortBy.set(key);
  }
}
