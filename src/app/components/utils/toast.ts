import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  template: `
    <div [ngClass]="['toast', positionCls()]">
      <div [ngClass]="['alert', statusCls()]">
        <span>{{ message() }}</span>
      </div>
    </div>
  `,
  styles: ``,
})
export class Toast {
  positionCls = input<string>('');
  statusCls = input<string>('');
  message = input<string>('');
}
