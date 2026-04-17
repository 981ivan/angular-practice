import { Component, input, output } from '@angular/core';
import { BookInterface } from '../models/book.interface';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { coolEditPencil01, coolInfo, coolTrashFull } from '@ng-icons/coolicons';
import { BeforeChristPipe } from '../pipes/before-christ.pipe';
import { ModalInfo } from './modals/modal-info';

@Component({
  selector: '[app-book-item]',
  imports: [NgIcon, BeforeChristPipe, ModalInfo],
  styles: ``,
  viewProviders: [provideIcons({ coolEditPencil01, coolInfo, coolTrashFull })],
  template: `
    <td>{{ book().index }}</td>
    <td>{{ book().title }}</td>
    <td>{{ book().author }}</td>
    <td>{{ book().year | bcPipe }}</td>
    <td>{{ book().language }}</td>
    <td>{{ book().country }}</td>
    <td>
      <div class="flex justify-around">
        <button
          class="btn btn-accent hover:bg-yellow-100 text-green-800"
          (click)="modalInfo.show()"
        >
          <ng-icon name="coolInfo" title="Click for more info..." />
        </button>
        <button
          (click)="this.onEdit($event)"
          class="btn btn-accent hover:bg-yellow-100 text-blue-800"
        >
          <ng-icon title="Click to edit this entry..." name="coolEditPencil01" />
        </button>
        <button
          (click)="this.onDelete($event)"
          class="btn btn-accent hover:bg-yellow-100 hover:text-error text-red-800"
        >
          <ng-icon title="Click to delete this entry..." name="coolTrashFull" />
        </button>
      </div>
    </td>

    <app-modal-info #modalInfo [book]="book()"></app-modal-info>
  `,
})
export class BookItem {
  book = input.required<BookInterface>();
  index = input.required<number>();
  edit = output<BookInterface>();
  delete = output<BookInterface>();

  onEdit(ev: MouseEvent) {
    ev.preventDefault();
    this.edit.emit(this.book());
  }

  onDelete(ev: MouseEvent) {
    ev.preventDefault();
    this.delete.emit(this.book());
  }
}
