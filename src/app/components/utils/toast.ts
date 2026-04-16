import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  standalone: true,
  template: `
    <div [ngClass]="['toast', 'z-50', positionCls()]">
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
