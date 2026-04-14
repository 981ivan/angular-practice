import { Component, computed, effect, input, model, output, Signal } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  template: `
    <div class="m-5 flex justify-end">
      @if (pages().length > 0) {
        @for (p of pages(); track $index) {
          <button
            class="join-item btn mx-2"
            (click)="goToPage($index + 1)"
            [class.btn-active]="selectedPage() ? selectedPage() === $index + 1 : $index === 0"
          >
            {{ $index + 1 }}
          </button>
        }
      }
    </div>
  `,
  styles: ``,
})
export class Paginator {
  numberOfPages = input.required<number>();
  pages: Signal<number[]> = computed(() => Array.from(Array(this.numberOfPages()).keys()));
  selectedPage = model<number>();
  changePage = output<number>();

  goToPage(index: number) {
    this.selectedPage.set(index);
    this.changePage.emit(index);
  }
}
