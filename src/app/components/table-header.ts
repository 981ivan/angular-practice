import { Component, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: '[app-table-header]',
  imports: [NgIcon],
  template: `
    <span (click)="orderList()">
      @if (title()) {
        {{ title() }}
      }
      @if (title() && sortBy() === title()) {
        <ng-icon name="coolCaretUpMD"></ng-icon>
      }
    </span>
  `,
  styles: ``,
})
export class TableHeader {
  title = input<string>();
  sortBy = input<string>();
  sortingList = output<string>();

  orderList(){
    if(this.title()){
      this.sortingList.emit(this.title()!)
    }
  }
}
