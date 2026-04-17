import { Component, inject, input } from '@angular/core';
import { GenericBtn } from './utils/generic-btn';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { coolBookOpen } from '@ng-icons/coolicons';

@Component({
  selector: 'app-navbar',
  imports: [GenericBtn, NgIcon],
  standalone: true,
  viewProviders: [provideIcons({ coolBookOpen })],
  template: `
    <div
      class="navbar bg-base-100 bg-green-100 shadow-sm w-auto flex justify-between sticky top-0 z-30"
    >
      <h3 class="text-lg font-bold">
        My book app
        <span class="flex justify-end"><ng-icon name="coolBookOpen" /></span>
      </h3>

      <span class="font-bold italic">We care about reading, not CSS...</span>
      @if (context() === 'home') {
        <app-generic-btn
          [icon]="'coolAddPlus'"
          [btnText]="'Add a new book!'"
          [btnFnKey]="'addBook'"
          (click)="addNewBook()"
        />
      }

      @if (context() === 'addEditBook') {
        <app-generic-btn
          [icon]="'coolSkipBack'"
          [btnText]="'Back Home'"
          [btnFnKey]="'goBackHome'"
          (click)="backHome()"
        />
      }
    </div>
  `,
  styles: ``,
})
export class Navbar {
  router = inject(Router);
  context = input<string>('home');

  addNewBook() {
    this.router.navigate(['/add-new-book'], {
      queryParams: { addNewBook: true },
    });
  }

  backHome() {
    this.router.navigate(['']);
  }
}
