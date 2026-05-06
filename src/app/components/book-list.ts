import { Component, input, output } from '@angular/core';
import { BookInterface } from '../models/book.interface';
import { BookItem } from './book-item';
import { provideIcons } from '@ng-icons/core';
import { coolCaretUpMD, coolCaretDownMD } from '@ng-icons/coolicons';
import { TableHeader } from './table-header';

@Component({
  selector: 'app-book-list',
  imports: [BookItem, TableHeader],
  viewProviders: [provideIcons({ coolCaretUpMD, coolCaretDownMD })],
  standalone: true,
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
                (sortingList)="order($event)"
              ></th>
            }
          </tr>
        </thead>
        <tbody>
          @for (b of books(); track b.id) {
            <tr
              app-book-item
              [book]="b"
              [index]="$index"
              class="hover:bg-base-300"
              (edit)="edit.emit(b)"
              (delete)="delete.emit(b)"
            ></tr>
          } @empty {
            <span>There are no results :(</span>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: ``,
})
export class BookList {
  books = input<BookInterface[] | undefined>([]);
  sortBy = input<string>('');
  edit = output<BookInterface>();
  delete = output<BookInterface>();
  orderedBy = output<string>();
  tableHeaderConfig: string[] = ['', 'title', 'author', 'year', 'language', 'country', ''];

  constructor() {}

  order(key: string) {
    this.orderedBy.emit(key);
  }
}
