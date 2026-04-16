import { Component, computed, inject, input, output } from '@angular/core';
import { BookInterface } from '../models/book.interface';
import { FormsModule } from '@angular/forms';
import { BeforeChristPipe } from '../pipes/before-christ.pipe';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { Book } from '../models/book';
import { httpResource } from '@angular/common/http';
import { CountryInterface } from '../models/country.interface';

@Component({
  selector: 'app-manage-book-form',
  imports: [FormsModule, BeforeChristPipe, UpperCasePipe],
  standalone: true,
  template: ` @if (book()) {
    <div class="flex justify-around w-full mt-50 px-36">
      <div class="card bg-emerald-50 w-full shadow-sm">
        <div class="card-body">
          <h2 class="card-title mb-5">{{ title() | uppercase }}</h2>
          <div class="flex columns-12 justify-between gap-2">
            <label class="input">
              <span class="label">Title</span>
              <input type="text" placeholder="Type here" class="input" [(ngModel)]="book().title" />
            </label>
            <label class="input">
              <span class="label">Author</span>
              <input
                type="text"
                placeholder="Type here"
                class="input"
                [(ngModel)]="book().author"
              />
            </label>
          </div>
          <div class="flex columns-12 justify-between gap-2">
            <label class="input">
              <span class="label">Country</span>
              <input
                type="text"
                placeholder="Type here"
                class="input"
                [(ngModel)]="book().country"
              />
            </label>
            <label class="input">
              <span class="label">Language</span>
              <input
                type="text"
                placeholder="Type here"
                class="input"
                [(ngModel)]="book().language"
              />
            </label>
          </div>
          <div class="flex columns-12 justify-between gap-2">
            <label class="input">
              <span class="label">Year</span>
              <input
                type="text"
                placeholder="Type here"
                class="input"
                [ngModel]="book().year | bcPipe"
                (ngModelChange)="book().year = $event"
              />
            </label>
            <label class="input">
              <span class="label">Pages</span>
              <input type="text" placeholder="Type here" class="input" [(ngModel)]="book().pages" />
            </label>
          </div>
          <div class="w-full">
            <label class="input input-bordered flex items-center gap-2 w-full">
              <span class="label">Link</span>
              <input type="text" placeholder="Type here" class="input" [(ngModel)]="book().link" />
            </label>
          </div>
          <div class="card-actions justify-end mt-5">
            <button class="btn btn-primary" (click)="backHome()">Cancel and go back home</button>
            <button class="btn btn-primary" (click)="mainAction()">
              {{ editing() ? 'Edit Book' : 'Add book' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  }`,
  styles: ``,
})
export class ManageBookForm {
  countryApi: string = 'https://restcountries.com/v3.1/all?fields=name'
  router = inject(Router);
  book = input.required<BookInterface>();
  editing = input<boolean>(false);
  onSaveEdit = output<{ method: string; book: Book }>();
  title = computed(() => {
    if (this.editing()) {
      return 'Edit Book';
    } else {
      return 'Add New Book';
    }
  });

  countries = httpResource <CountryInterface[]>(() => this.countryApi);

  backHome() {
    this.router.navigate(['']);
  }

  mainAction() {
    let method = 'POST';
    if (this.editing()) {
      method = 'PATCH';
    }

    const bookInForm = new Book(
      this.book().author,
      this.book().country,
      this.book().language,
      this.book().link,
      this.book().pages,
      this.book().title,
      this.book().year,
      this.book().id ?? undefined,
    );

    this.onSaveEdit.emit({ method: method, book: bookInForm });
  }
}
