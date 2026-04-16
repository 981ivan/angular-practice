import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { BookList } from './book-list';
import { ModalDelete } from './modals/modal-delete';
import { Paginator } from './paginator';
import { SearchForm } from './search-form';
import { Toast } from './utils/toast';
import { BOOKS_URL, DB_URL } from '../constants/constants';
import { Query } from '../models/query';
import { HttpClient, httpResource } from '@angular/common/http';
import { BookInterface } from '../models/book.interface';
import { SearchFormInterface } from '../models/search-form.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from './navbar';

@Component({
  selector: 'app-home-page',
  imports: [BookList, ModalDelete, Paginator, SearchForm, Toast, Navbar],
  standalone: true,
  template: `

    <app-navbar
      [context]="'home'"
    />

    <app-search-form
      (search)="filterSearch($event)"
      (cleanSearch)="initialSearch()"
      [allYearsAndLanguages]="allYearsAndLanguages.value()"
    />

    <app-book-list
      [books]="books.value()"
      [sortBy]="sortBy()"
      (orderedBy)="orderBy($event)"
      (edit)="editBook($event)"
      (delete)="confirmDelete($event)"
    />

    <app-paginator
      [numberOfPages]="numberOfPages()"
      [(selectedPage)]="selectedPage"
      (changePage)="changePage($event)"
    />

    <app-modal-delete
      #modalDelete
      [bookInDeletion]="bookSelectedForDeletion()"
      (delete)="deleteBook()"
    >
    </app-modal-delete>

    @if (showToast()) {
      <app-toast
        [positionCls]="toastPositionCls()"
        [statusCls]="toastStatusCls()"
        [message]="toastMessage()"
      />
    }
  `,
  styles: ``,
})
export class HomePage implements OnInit {
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
  bookSelectedForDeletion = signal<BookInterface | null>(null);
  showToast = signal<boolean>(false);
  toastPositionCls = signal<string>('toast-center toast-middle');
  toastStatusCls = signal<string>('alert-success');
  toastMessage = signal<string>('');
  books = httpResource<BookInterface[]>(() => this.searchApi(), {
    parse: (res) => {
      const mappedRes: BookInterface[] = res as BookInterface[];
      mappedRes.map((b, i) => (b.index = this.getIndex(i)));
      return mappedRes;
    },
  });

  allYearsAndLanguages = httpResource<{ allYears: number[]; allLanguages: string[] }>(
    () => this.booksApi(),
    {
      parse: (res) => {
        const mappedRes: BookInterface[] = res as BookInterface[];
        mappedRes.map((b, i) => (b.index = this.getIndex(i)));
        const allYears = [...new Set(mappedRes.map((b) => b.year))].sort((a, b) => a - b);
        const allLanguages = [...new Set(mappedRes.map((b) => b.language))];
        return { allYears: allYears, allLanguages: allLanguages };
      },
    },
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    if(history.state && history.state.saved){
      this.manageToastMessage(`${history.state.bookSaved.title.toUpperCase()} saved successfully!`);
    } else if (history.state && history.state.edited) {
      this.manageToastMessage(`${history.state.bookEdited.title.toUpperCase()} edited successfully!`);
    }
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

  confirmDelete(book: BookInterface) {
    this.bookSelectedForDeletion.set(book);
    this.modalDeleteComponent.modalDelete.nativeElement.show();
  }

  editBook(book: BookInterface) {
    this.router.navigate([`/edit-book`], {
      queryParams: {
        bookId: book.id
      }
    });
  }

  deleteBook() {
    this.http.delete(`${this.booksApi()}/${this.bookSelectedForDeletion()?.id}`).subscribe(() => {
      this.bookSelectedForDeletion.set(null);
      this.books.reload();
      this.manageToastMessage('Book deleted successfully');
    });
  }

  manageToastMessage(msg: string, status?: string) {
    this.toastMessage.set(msg);
    if(status){
      this.toastStatusCls.set(status);
    }
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 2000);
  }

}
