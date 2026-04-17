import { Component, computed, HostBinding, inject, input, output, signal } from '@angular/core';
import { BookInterface } from '../models/book.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { Book } from '../models/book';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-manage-book-form',
  imports: [FormsModule, UpperCasePipe, ReactiveFormsModule, FormField],
  standalone: true,
  template: ` @if (book()) {
    <div class="flex align-middle w-fit mt-50 px-36">
      <div class="card bg-emerald-50 w-full shadow-sm">
        <div class="card-body">
          <h2 class="card-title mb-5">{{ title() | uppercase }}</h2>
          <div class="flex columns-12 justify-around gap-2">
            <label class="input">
              <span class="label">Title</span>
              <input
                type="text"
                placeholder="Type here"
                class="input"
                [formField]="bookForm.title"
              />
            </label>
            <label class="input">
              <span class="label">Author</span>
              <input
                type="text"
                placeholder="Type here"
                class="input"
                [formField]="bookForm.author"
              />
            </label>
          </div>
          <div class="flex columns-12 justify-around gap-2">
            <label class="input">
              <span class="label">Country</span>
              <input
                type="text"
                placeholder="Type here"
                class="input"
                [formField]="bookForm.country"
              />
            </label>
            <label class="input">
              <span class="label">Language</span>
              <input
                type="text"
                placeholder="Type here"
                class="input"
                [formField]="bookForm.language"
              />
            </label>
          </div>
          <div class="flex columns-12 justify-around gap-2">
            <label class="input">
              <span class="label">Year</span>
              <input
                type="number"
                placeholder="Type here"
                class="input"
                [formField]="bookForm.year"
              />
            </label>
            <label class="input">
              <span class="label">Pages</span>
              <input
                type="number"
                placeholder="Type here"
                class="input"
                [formField]="bookForm.pages"
              />
            </label>
          </div>
          <div class="flex column-12">
            <label class="input input-bordered flex items-center gap-2 w-full">
              <span class="label">Link</span>
              <input
                type="text"
                placeholder="Type here"
                class="input"
                [formField]="bookForm.link"
              />
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
  @HostBinding('class.flex') someField: boolean = true;
  @HostBinding('class.w-full') someOtherField: boolean = true;
  @HostBinding('class.justify-center') anotherFieldInTheWall: boolean = true;
  router = inject(Router);
  book = input.required<BookInterface>();
  formModel = signal<Book>(new Book('', '', '', '', 0, '', 0, undefined));
  bookForm = form(this.formModel);
  editing = input<boolean>(false);
  onSaveEdit = output<{ method: string; book: Book }>();
  title = computed(() => {
    if (this.editing()) {
      return 'Edit Book';
    } else {
      return 'Add New Book';
    }
  });

  backHome() {
    this.router.navigate(['']);
  }

  ngOnInit() {
    this.formModel.update((f) => {
      return {
        ...f,
        author: this.book().author ?? '',
        country: this.book().country ?? '',
        language: this.book().language ?? '',
        link: this.book().link ?? '',
        pages: this.book().pages ?? undefined,
        title: this.book().title ?? '',
        year: this.book().year ?? undefined,
        id: this.book().id ?? undefined,
      };
    });
  }

  mainAction() {
    this.onSaveEdit.emit({ method: this.editing() ? 'PATCH' : 'POST', book: this.bookForm().value() });
  }
}
