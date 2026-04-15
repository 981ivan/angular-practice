import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { Book } from '../../models/book.interface';
import { UpperCasePipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapWikipedia } from '@ng-icons/bootstrap-icons';
import { BeforeChristPipe } from '../../pipes/before-christ.pipe';

@Component({
  selector: 'app-modal-info',
  imports: [UpperCasePipe, NgIcon, BeforeChristPipe],
  viewProviders: [provideIcons({ bootstrapWikipedia })],
  template: `
    <dialog #modalInfo class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">{{ book().title | uppercase }}</h3>
        <div class="grid grid-cols-12 gap-4 my-5">
          <div class="col-span-6"><span class="font-bold">Author: </span>{{ book().author }}</div>
          <div class="col-span-6"><span class="font-bold">Country: </span>{{ book().country }}</div>
        </div>
        <div class="grid grid-cols-12 gap-4 my-5">
          <div class="col-span-6">
            <span class="font-bold">Year: </span>{{ book().year | bcPipe }}
          </div>
          <div class="col-span-6">
            <span class="font-bold">Language: </span>{{ book().language }}
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4 my-5">
          <div class="col-span-6"><span class="font-bold">Pages: </span>{{ book().pages }}</div>
          <div class="col-span-6">
            <a [href]="book().link" target="_blank" [style.font-size.px]="16">
              <ng-icon name="bootstrapWikipedia" />
            </a>
          </div>
        </div>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-secondary">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  `,
  styles: ``,
})
export class ModalInfo {
  @ViewChild('modalInfo') modalElement!: ElementRef<HTMLDialogElement>;
  book = input.required<Book>();

  show() {
    this.modalElement.nativeElement.showModal();
  }
}

