import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { coolAddPlus, coolSkipBack } from '@ng-icons/coolicons';

@Component({
  selector: 'app-generic-btn',
  imports: [NgIcon],
  viewProviders: [provideIcons({ coolAddPlus, coolSkipBack })],
  standalone: true,
  template: `
    <div class="mx-10">
      <button class="btn btn-success">
        @if (icon()) {
          <ng-icon [name]="icon()" />
        }
        {{ btnText() }}
      </button>
    </div>
  `,
  styles: ``,
})
export class GenericBtn {
  icon = input<string>('');
  btnText = input<string>('');
  btnFnKey = input<string>();
}
