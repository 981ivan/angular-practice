import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { BookList } from './components/book-list';
import { HttpClient, httpResource } from '@angular/common/http';
import { Book } from './models/book.interface';
import { BOOKS_URL, DB_URL } from './constants/constants';
import { Paginator } from './components/paginator';
import { SearchForm } from './components/search-form';
import { SearchFormInterface } from './models/search-form.interface';
import { Query } from './models/query';
import { ModalDelete } from './components/modals/modal-delete';
import { Toast } from './components/utils/toast';

@Component({
  selector: 'app-root',
  imports: [BookList, Paginator, SearchForm, ModalDelete, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  page = signal<number>(1);
  elementsPerPage = signal<number>(10);
  formSet: boolean = false;
  sortSet: boolean = false;
  defaultSearch: string = `${DB_URL}${BOOKS_URL}?_page=${this.page()}&_per_page=${this.elementsPerPage()}`;
  queryDefaultValue: Query = {
    page: 1,
    elementsPerPage: 10,
    sortBy: '',
    title: '',
    author: '',
    year: undefined,
    language: '',
  };
  booksApi = signal<string>(`${DB_URL}${BOOKS_URL}`);
  searchApi = signal<string>(this.defaultSearch);
  sortBy = signal<string>('');
  selectedPage = 1;
  totalItems = computed(() => this.books.headers()?.get('x-total-count'));
  query = signal<Query>(this.queryDefaultValue);
  numberOfPages = computed(() => {
    const items = this.totalItems();
    const total = Number(items) || 0;
    return Math.ceil(total / 10);
  });
  http = inject(HttpClient);
  @ViewChild('modalDelete') modalDeleteComponent!: ModalDelete;
  bookSelectedForDeletion = signal<Book | null>(null);
  showToast = signal<boolean>(false);
  toastPositionCls = signal<string>('toast-top toast-end');
  toastStatusCls = signal<string>('alert-success');
  toastMessage = signal<string>('');

  books = httpResource<Book[]>(() => this.searchApi(), {
    parse: (res) => {
      const mappedRes: Book[] = res as Book[];
      mappedRes.map((b, i) => (b.index = this.getIndex(i)));
      return mappedRes;
    },
  });

  allYearsAndLanguages = httpResource<{ allYears: number[]; allLanguages: string[] }>(
    () => this.booksApi(),
    {
      parse: (res) => {
        const mappedRes: Book[] = res as Book[];
        mappedRes.map((b, i) => (b.index = this.getIndex(i)));
        const allYears = [...new Set(mappedRes.map((b) => b.year))].sort((a, b) => a - b);
        const allLanguages = [...new Set(mappedRes.map((b) => b.language))];
        return { allYears: allYears, allLanguages: allLanguages };
      },
    },
  );

  ngOnInit() {
    this.initialSearch();
  }

  getIndex(index: number): number {
    return (this.page() - 1) * this.elementsPerPage() + index + 1;
  }

  changePage(index: number) {
    if (!this.formSet) {
      this.query.set(this.queryDefaultValue);
      if (this.sortSet) {
        this.query.update((q) => ({ ...q, sortBy: this.sortBy() }));
      }
    }
    this.page.set(index);
    this.query.update((q) => ({ ...q, page: index }));
    this.setApiQuery(this.query());
  }

  orderBy(key: string) {
    this.sortBy.set(key);
    this.sortSet = true;
    this.selectedPage = 1;
    this.query.update((q) => ({ ...q, sortBy: key, page: 1 }));
    this.setApiQuery(this.query());
  }

  filterSearch(form?: SearchFormInterface) {
    this.query.set(this.queryDefaultValue);
    this.formSet = false;
    if (form) {
      this.formSet = true;
      this.query.set(this.queryDefaultValue);
      if (form.title) {
        this.query.update((q) => ({ ...q, title: form.title }));
      }
      if (form.author) {
        this.query.update((q) => ({ ...q, author: form.author }));
      }
      if (form.language) {
        this.query.update((q) => ({ ...q, language: form.language }));
      }
      if (form.year) {
        this.query.update((q) => ({ ...q, year: +form.year }));
      }
      this.query.update((q) => ({ ...q, page: 1, elementsPerPage: 10 }));
      this.setApiQuery(this.query());
    }
  }

  initialSearch() {
    this.formSet = false;
    this.sortSet = false;
    this.sortBy.set('');
    this.selectedPage = 1;
    this.searchApi.set(`${DB_URL}${BOOKS_URL}?_page=1&_per_page=10`);
  }

  setApi(query: string) {
    this.searchApi.set(`${DB_URL}${BOOKS_URL}${query}`);
  }

  setApiQuery(query: Query) {
    let queryReq = `?`;
    if (query.page) {
      queryReq += `&_page=${query.page}`;
    } else {
      queryReq += `&_per_page=1`;
    }
    if (query.elementsPerPage) {
      queryReq += `&_per_page=${query.elementsPerPage}`;
    } else {
      queryReq += `&_per_page=10`;
    }
    for (const [key, value] of Object.entries(query)) {
      if (value) {
        switch (key) {
          case 'title':
          case 'author':
            queryReq += `&${key}_like=${value}`;
            break;
          case 'language':
          case 'year':
            queryReq += `&${key}=${value}`;
            break;
          case 'sortBy':
            queryReq += `&_sort=${value}`;
            break;
          default:
            break;
        }
      }
    }
    this.setApi(queryReq);
  }

  confirmDelete(book: Book) {
    console.log('item to delete', book);
    console.log(this.modalDeleteComponent);
    this.bookSelectedForDeletion.set(book);
    this.modalDeleteComponent.modalDelete.nativeElement.show();
  }

  deleteBook() {
    this.http.delete(`${this.booksApi()}/${this.bookSelectedForDeletion()?.id}`).subscribe(() => {
      this.bookSelectedForDeletion.set(null);
      this.toastMessage.set('Book deleted successfully');
      this.showToast.set(true);
      setTimeout(() => {
        this.showToast.set(false);
      }, 5000);
    });
  }
}
