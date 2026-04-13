import { Component, computed, input, model } from '@angular/core';
import { Book } from '../models/book.interface';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { coolEditPencil01 } from '@ng-icons/coolicons';
import { BeforeChristPipe } from '../pipes/before-christ.pipe';

@Component({
  selector: '[app-book-item]',
  imports: [NgIcon, BeforeChristPipe],
  styles: ``,
  viewProviders: [provideIcons({ coolEditPencil01 })],
  template: `
    <td>{{ index() + 1 }}</td>
    <td>{{ book().title }}</td>
    <td>{{ book().author }}</td>
    <td>{{ book().year | bcPipe }}</td>
    <td>{{ book().language }}</td>
    <td><ng-icon name="coolEditPencil01" /></td>
  `,
})
export class BookItem {
  book = input.required<Book>();
  index = input.required<number>();
  //todo aggiungere sequenzialità numeri in tabella e ripartire da qui

}
