import { Component, computed, Signal, signal } from '@angular/core';
import { BookList } from './components/book-list';
import { httpResource } from '@angular/common/http';
import { Book } from './models/book.interface';
import { BOOKS_URL, DB_URL } from './constants/constants';
import { Paginator } from './components/paginator';

@Component({
  selector: 'app-root',
  imports: [BookList, Paginator],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  baseApi: string = `${DB_URL}${BOOKS_URL}`;
  page = signal<number>(1);
  elementsPerPage = signal<number>(10);
  sortBy = signal<string>('');
  selectedPage = signal<number>(1);
  totalItems = computed(() => this.books.headers()?.get('x-total-count'));
  numberOfPages = computed(() => {
    const items = this.totalItems();
    const total = Number(items) || 0;
    return Math.ceil(total / 10);
  });

  books = httpResource<Book[]>(() => this.completeApi(), {
    parse: (res) => {
      const mappedRes: Book[] = res as Book[];
      mappedRes.map((b, i) => (b.index = this.getIndex(i)));
      return mappedRes;
    },
  });

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

  getIndex(index: number): number {
    return (this.page() - 1) * this.elementsPerPage() + index + 1;
  }

  changePage(index: number) {
    this.page.set(index);
  }

  orderBy(key: string) {
    this.sortBy.set(key);
  }
}
