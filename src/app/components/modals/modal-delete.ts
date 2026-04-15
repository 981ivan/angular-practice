import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { Book } from '../../models/book.interface';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-modal-delete',
  imports: [UpperCasePipe],
  template: `
    <dialog #modalDelete class="modal">
      <div class="modal-box">
        <p class="my-5 text-lg text-center font-bold">
          Warning! You're about to delete the following book
        </p>
        <h3 class="my-5 text-center font-bold">
          {{ bookInDeletion()?.title | uppercase }} by {{ bookInDeletion()?.author }}
        </h3>
        <p class="my-5 text-end font-bold">....R U SURE??</p>
        <div class="modal-action">
          <form method="dialog">
            <div class="flex flex-end justify-around gap-3">
              <button class="btn btn-secondary">Cancel</button>
              <button class="btn btn-error" (click)="delete.emit()">Yes, I'm sure</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  `,
  styles: ``,
})
export class ModalDelete {
  bookInDeletion = input<Book | null>();
  delete = output();
  @ViewChild('modalDelete') modalDelete!: ElementRef<HTMLDialogElement>;
}
